import argparse
from pathlib import Path

from app.core.database import engine


def init_db() -> None:
    project_root = Path(__file__).resolve().parents[2]
    schema_path = project_root / "db" / "init.sql"
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema file not found: {schema_path}")

    schema_sql = schema_path.read_text(encoding="utf-8")
    with engine.begin() as connection:
        connection.exec_driver_sql(schema_sql)

    print(f"Applied schema: {schema_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Job Tracker backend utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("init-db", help="Apply db/init.sql to DATABASE_URL")
    args = parser.parse_args()

    if args.command == "init-db":
        init_db()


if __name__ == "__main__":
    main()
