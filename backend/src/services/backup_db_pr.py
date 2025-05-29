import logging
import os
import hashlib
import base64
import subprocess
import requests
from github import Github
from dotenv import load_dotenv
from datetime import datetime


load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "whitestonedev/calendario-tech"
BRANCH_BASE = "main"
REPO_DUMP_PATH = "backend/backup.sql"
PR_TITLE_TAG = "[backup-sync]"

DUMP_OUTPUT_PATH = "/tmp/backup.sql"

logging.basicConfig(
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


def run_pg_dump():
    logger.info(
        "[backup] Executando pg_dump para extrair o estado atual do banco de dados..."
    )
    try:
        subprocess.run(
            [
                "pg_dump",
                "-h",
                os.getenv("POSTGRES_HOST"),
                "-p",
                os.getenv("POSTGRES_PORT", "5432"),
                "-U",
                os.getenv("POSTGRES_USER"),
                "-d",
                os.getenv("POSTGRES_DB"),
                "-f",
                DUMP_OUTPUT_PATH,
                "-F",
                "plain",
            ],
            check=True,
            env={**os.environ, "PGPASSWORD": os.getenv("POSTGRES_PASSWORD")},
        )
    except Exception as e:
        logger.error(f"[backup] Erro ao executar pg_dump: {e}")
        raise


def hash_file(path: str) -> str:
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def get_remote_dump_sha_and_hash() -> tuple[str, str] | None:
    url = f"https://api.github.com/repos/{REPO}/contents/{REPO_DUMP_PATH}?ref={BRANCH_BASE}"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        logger.warning(f"[backup] Dump remoto não encontrado ou erro: {r.text}")
        return None
    data = r.json()
    content = base64.b64decode(data["content"])
    remote_sha = data["sha"]
    remote_hash = hashlib.sha256(content).hexdigest()
    return remote_sha, remote_hash


def check_if_pr_already_exists(repo, pr_id_prefix: str, branch_base: str) -> bool:
    for pr in repo.get_pulls(state="open", base=branch_base):
        if pr.title.startswith(f"{PR_TITLE_TAG}-{pr_id_prefix}"):
            logger.info(f"[backup] PR já existente: {pr.title}")
            return True
    return False


def open_backup_update_pr(local_hash: str, remote_sha: str):
    id_prefix = local_hash[:8]
    ts_human = datetime.now().strftime("%Y-%m-%d %H:%M")
    new_branch = f"backup-{id_prefix}"

    gh = Github(GITHUB_TOKEN)
    repo = gh.get_repo(REPO)

    if check_if_pr_already_exists(repo, id_prefix, BRANCH_BASE):
        logger.warning("[backup] PR automático já existe. Abortando.")
        return

    main_ref = repo.get_branch(BRANCH_BASE)
    repo.create_git_ref(ref=f"refs/heads/{new_branch}", sha=main_ref.commit.sha)

    with open(DUMP_OUTPUT_PATH, "rb") as f:
        content_b64 = base64.b64encode(f.read()).decode()

    repo.update_file(
        path=REPO_DUMP_PATH,
        message=f"{PR_TITLE_TAG}-{id_prefix} Update backup.sql @ {ts_human}",
        content=content_b64,
        sha=remote_sha,
        branch=new_branch,
    )

    body = f"""
Atualização automática do arquivo `backup.sql`.

ID deste conteúdo: **{id_prefix}**

Este PR foi gerado por um processo automatizado de versionamento contínuo do banco PostgreSQL.

### 📅 Gerado em:
**{ts_human}**

> Este PR é parte do contexto automatizado de backup.
"""

    pr = repo.create_pull(
        title=f"{PR_TITLE_TAG}-{id_prefix} Update backup.sql @ {ts_human}",
        body=body,
        head=new_branch,
        base=BRANCH_BASE,
    )
    logger.info(f"[backup] PR criado: {pr.html_url}")


def run_database_backup_job():
    # if os.getenv("DEBUG", "False") == "True":
    #     logger.info("[backup] DEBUG=True, não executando o versionamento.")
    #     return

    logger.info("[backup] Gerando dump e verificando alterações...")
    if not GITHUB_TOKEN:
        raise RuntimeError("GITHUB_TOKEN not found in environment variables")

    run_pg_dump()

    remote = get_remote_dump_sha_and_hash()
    if remote is None:
        logger.info(
            "[backup] Nenhum dump remoto anterior encontrado. Criando PR inicial..."
        )
        remote_sha = None
        local_hash = hash_file(DUMP_OUTPUT_PATH)
        open_backup_update_pr(local_hash, remote_sha or "")
        return

    remote_sha, remote_hash = remote
    local_hash = hash_file(DUMP_OUTPUT_PATH)

    if remote_hash != local_hash:
        logger.info("[backup] Alterações detectadas. Criando PR...")
        open_backup_update_pr(local_hash, remote_sha)
    else:
        logger.info("[backup] Nenhuma modificação detectada no dump.")


if __name__ == "__main__":
    run_database_backup_job()
