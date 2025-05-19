import re
import sqlite3
from pathlib import Path

# Salva em backend/events.sqlite3
DB_PATH = Path(__file__).parent / "events.sqlite3"
DB_PATH.parent.mkdir(exist_ok=True)


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def create_table():
    with get_connection() as conn:
        # Tabela principal de eventos
        conn.execute(
            """
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            organization_name TEXT,
            event_name TEXT,
            start_datetime DATETIME,
            end_datetime DATETIME,
            address TEXT,
            maps_link TEXT,
            online INTEGER,
            event_link TEXT
        );
        """
        )

        # Traduções (intl)
        conn.execute(
            """
        CREATE TABLE IF NOT EXISTS event_intl (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER,
            lang TEXT,
            event_edition TEXT,
            cost TEXT,
            banner_link TEXT,
            short_description TEXT,
            FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
        );
        """
        )

        # Tabela mestre de tags (sem duplicação)
        conn.execute(
            """
        CREATE TABLE IF NOT EXISTS tags_master (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tag TEXT UNIQUE
        );
        """
        )

        # Associação entre eventos e tags
        conn.execute(
            """
        CREATE TABLE IF NOT EXISTS event_tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER,
            tag_id INTEGER,
            UNIQUE(event_id, tag_id),
            FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE,
            FOREIGN KEY(tag_id) REFERENCES tags_master(id) ON DELETE CASCADE
        );
        """
        )

        conn.commit()


def clear_events():
    """Limpa tudo antes de recarregar."""
    with get_connection() as conn:
        conn.execute("DELETE FROM event_intl;")
        conn.execute("DELETE FROM tags;")
        conn.execute("DELETE FROM events;")
        conn.commit()


def insert_event(event):
    with get_connection() as conn:
        cur = conn.execute(
            """
            INSERT INTO events (
                organization_name, event_name,
                start_datetime, end_datetime, address,
                maps_link, online, event_link
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                event.get("organization_name"),
                event.get("event_name"),
                event.get("start_datetime"),
                event.get("end_datetime"),
                event.get("address"),
                event.get("maps_link"),
                int(event.get("online", False)),
                event.get("event_link"),
            ),
        )
        event_db_id = cur.lastrowid

        for tag in set(event.get("tags", [])):
            # Insere na master (ou ignora se já existe)
            conn.execute("INSERT OR IGNORE INTO tags_master (tag) VALUES (?)", (tag,))
            # Recupera o id da tag
            tag_row = conn.execute(
                "SELECT id FROM tags_master WHERE tag = ?", (tag,)
            ).fetchone()
            if tag_row:
                tag_id = tag_row["id"]
                # Cria o vínculo com o evento
                conn.execute(
                    "INSERT OR IGNORE INTO event_tags (event_id, tag_id) VALUES (?, ?)",
                    (event_db_id, tag_id),
                )

        for lang, intl_data in event.get("intl", {}).items():
            conn.execute(
                """
                INSERT INTO event_intl (
                    event_id, lang, event_edition,
                    cost, banner_link, short_description
                ) VALUES (?, ?, ?, ?, ?, ?)
            """,
                (
                    event_db_id,
                    lang,
                    intl_data.get("event_edition"),
                    intl_data.get("cost"),
                    intl_data.get("banner_link"),
                    intl_data.get("short_description"),
                ),
            )

        conn.commit()
        return event_db_id


def list_all_events():
    """
    Reconstrói cada evento em formato de dict.
    Retorna lista de dicts similar ao JSON original.
    """
    conn = get_connection()
    events = []
    # carrega dados básicos
    for row in conn.execute("SELECT * FROM events"):
        e = dict(row)
        eid = e["id"]
        # pega tags
        tags = [
            t["tag"]
            for t in conn.execute(
                """
                SELECT tm.tag FROM event_tags et
                JOIN tags_master tm ON et.tag_id = tm.id
                WHERE et.event_id = ?
            """,
                (eid,),
            )
        ]

        # pega traduções
        intl = {}
        for i in conn.execute(
            """
            SELECT lang, event_edition, cost, banner_link, short_description
            FROM event_intl WHERE event_id = ?
        """,
            (eid,),
        ):
            intl[i["lang"]] = {
                "event_edition": i["event_edition"],
                "cost": i["cost"],
                "banner_link": i["banner_link"],
                "short_description": i["short_description"],
            }
        # monta o objeto final
        events.append(
            {
                "id": eid,
                "organization_name": e["organization_name"],
                "event_name": e["event_name"],
                "start_datetime": e["start_datetime"],
                "end_datetime": e["end_datetime"],
                "address": e["address"],
                "maps_link": e["maps_link"],
                "online": bool(e["online"]),
                "event_link": e["event_link"],
                "tags": tags,
                "intl": intl,
            }
        )
    conn.close()
    return events


def get_numeric_price(price_str: str) -> float:
    """Extrai número (em centavos) de strings como 'R$ 150,00' ou '15000'."""
    digits = re.sub(r"\D", "", price_str or "")
    try:
        return float(digits) / 100.0 if digits else 0.0
    except ValueError:
        return 0.0


def query_events(
    tags: list[str] | None = None,
    name: str | None = None,
    org: str | None = None,
    online: bool | None = None,
    price_type: str | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    address: str | None = None,
    date_start_range: str | None = None,
    date_end_range: str | None = None,
    date_from: str | None = None,
) -> list[dict]:
    """
    Busca eventos no SQLite aplicando dinamicamente filtros.
    Price_min e price_max são aplicados em Python usando get_numeric_price.
    """
    conn = get_connection()
    conn.execute("PRAGMA foreign_keys = ON;")
    params: list = []
    clauses: list[str] = []

    if tags:
        ph = ",".join("?" for _ in tags)
        clauses.append(
            f"""
            id IN (
                SELECT et.event_id
                FROM event_tags et
                JOIN tags_master tm ON et.tag_id = tm.id
                WHERE tm.tag IN ({ph})
            )
        """
        )
        params.extend(tags)

    if name:
        clauses.append("LOWER(event_name) LIKE ?")
        params.append(f"%{name.lower()}%")

    if org:
        clauses.append("LOWER(organization_name) LIKE ?")
        params.append(f"%{org.lower()}%")

    if online is not None:
        clauses.append("online = ?")
        params.append(int(online))

    if address:
        clauses.append("LOWER(address) LIKE ?")
        params.append(f"%{address.lower()}%")

    if date_from:
        clauses.append("DATE(start_datetime) >= DATE(?)")
        params.append(date_from)

    if date_start_range and date_end_range:
        clauses.append(
            "DATE(start_datetime) >= DATE(?) AND DATE(end_datetime) <= DATE(?)"
        )
        params.extend([date_start_range, date_end_range])

    # price_type: free / paid
    if price_type:
        # valores de "gratuito" nos três idiomas
        free_vals = ("grátis", "free", "gratis")
        placeholders = ",".join("?" for _ in free_vals)

        if price_type.lower() == "free":
            # inclui eventos que em QUALQUER tradução aparecem como "grátis"/"free"/"gratis"
            clauses.append(
                f"id IN (SELECT event_id FROM event_intl WHERE LOWER(cost) IN ({placeholders}))"
            )
            params.extend(free_vals)

        elif price_type.lower() == "paid":
            # exclui todos os eventos que apareçam como "grátis"/"free"/"gratis" em qualquer idioma
            clauses.append(
                f"id NOT IN (SELECT event_id FROM event_intl WHERE LOWER(cost) IN ({placeholders}))"
            )
            params.extend(free_vals)

    sql = "SELECT * FROM events"
    if clauses:
        sql += " WHERE " + " AND ".join(clauses)

    cursor = conn.execute(sql, params)
    rows = cursor.fetchall()
    conn.close()

    # reconstrói o objeto completo
    full_map = {e["id"]: e for e in list_all_events()}
    result = [full_map[row["id"]] for row in rows if row["id"] in full_map]

    # aplica price_min / price_max em Python
    if price_min is not None or price_max is not None:
        filtered = []
        for ev in result:
            cost_str = ev.get("intl", {}).get("pt-br", {}).get("cost", "")
            if cost_str.lower() == "grátis":
                continue
            value = get_numeric_price(cost_str)
            if price_min is not None and value < price_min:
                continue
            if price_max is not None and value > price_max:
                continue
            filtered.append(ev)
        result = filtered

    return result
