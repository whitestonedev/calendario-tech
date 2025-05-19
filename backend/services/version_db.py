import logging
import os
import hashlib
import base64
import requests
from github import Github
from dotenv import load_dotenv
from datetime import datetime

from constants import LOGGER_FORMAT

load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "whitestonedev/calendario-tech"
BRANCH_BASE = "main"
REPO_DB_PATH = "backend/events.sqlite3"
PR_TITLE_TAG = "[db-sync]"


logging.basicConfig(
    level=logging.INFO,
    format=LOGGER_FORMAT,
)
logger = logging.getLogger(__name__)
# Add support for Render, local and docker
CANDIDATE_LOCAL_PATHS = [
    os.path.join(os.getcwd(), "backend", "events.sqlite3"),
    "/app/events.sqlite3",
]
LOCAL_DB_PATH = next((p for p in CANDIDATE_LOCAL_PATHS if os.path.isfile(p)), None)
if LOCAL_DB_PATH is None:
    raise FileNotFoundError(
        "Arquivo events.sqlite3 não encontrado em nenhum dos caminhos conhecidos."
    )


def hash_file(path: str) -> str:
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def get_remote_db_sha_and_hash() -> tuple[str, str] | None:
    url = (
        f"https://api.github.com/repos/{REPO}/contents/{REPO_DB_PATH}?ref={BRANCH_BASE}"
    )
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        logger.error("[version_db] Falha ao buscar o arquivo remoto:", r.text)
        return None
    data = r.json()
    content = base64.b64decode(data["content"])
    sha = data["sha"]
    hash_remote = hashlib.sha256(content).hexdigest()
    return sha, hash_remote


def check_if_pr_already_exists(repo, tag_prefix: str, branch_base: str) -> bool:
    pulls = repo.get_pulls(state="open", base=branch_base)
    for pr in pulls:
        if pr.title.startswith(tag_prefix):
            logger.info(f"[version_db] PR já existente detectado: {pr.title}")
            return True
    return False


def open_db_update_pr():
    ts_machine = datetime.now().strftime("%Y%m%d-%H%M%S")
    ts_human = datetime.now().strftime("%Y-%m-%d %H:%M")

    new_branch = f"db-update-{ts_machine}"

    gh = Github(GITHUB_TOKEN)
    repo = gh.get_repo(REPO)

    if check_if_pr_already_exists(repo, PR_TITLE_TAG, BRANCH_BASE):
        logger.warning(
            "[version_db] PR automático já existe. Abortando criação de novo PR."
        )
        return

    main_ref = repo.get_branch(BRANCH_BASE)
    repo.create_git_ref(ref=f"refs/heads/{new_branch}", sha=main_ref.commit.sha)

    with open(LOCAL_DB_PATH, "rb") as f:
        content = base64.b64encode(f.read()).decode()

    repo.update_file(
        path=REPO_DB_PATH,
        message=f"Update events.sqlite3 @ {ts_human}",
        content=content,
        sha=get_remote_db_sha_and_hash()[0],
        branch=new_branch,
    )

    body = f"""
Atualização automática do arquivo `events.sqlite3`.

Este PR foi gerado por um processo em background para versionar alterações detectadas no banco de dados local.

### 📅 Gerado em:
**{ts_human}**

> Este PR é parte de um sistema automatizado de versionamento contínuo.
"""

    pr = repo.create_pull(
        title=f"{PR_TITLE_TAG} Update events.sqlite3 @ {ts_human}",
        body=body,
        head=new_branch,
        base=BRANCH_BASE,
    )
    logger.info(f"[version_db] PR criada: {pr.html_url}")


def run_db_versioning_job():
    logger.info("[version_db] Verificando alterações no banco...")
    if not GITHUB_TOKEN:
        raise RuntimeError("GITHUB_TOKEN não encontrado nas variáveis de ambiente")

    remote = get_remote_db_sha_and_hash()
    if remote is None:
        logger.error("[version_db] Não foi possível comparar com o arquivo remoto.")
        return

    _, remote_hash = remote
    local_hash = hash_file(LOCAL_DB_PATH)

    if remote_hash != local_hash:
        logger.info("[version_db] Banco de dados foi modificado. Criando PR...")
        open_db_update_pr()
    else:
        logger.info("[version_db] Nenhuma modificação detectada.")


if __name__ == "__main__":
    run_db_versioning_job()
