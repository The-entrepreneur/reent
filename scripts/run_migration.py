#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Apply a single SQL migration file to a Postgres database and optionally verify schema changes.

Usage:
    python reent/scripts/run_migration.py <DATABASE_URL> <SQL_FILE> [--table refresh_tokens] [--yes] [--dry-run]

Examples:
    python reent/scripts/run_migration.py "postgresql://user:pass@localhost:5432/dbname" migrations/003_add_refresh_token_jti.sql
    python reent/scripts/run_migration.py migrations/003_add_refresh_token_jti.sql          # uses env DATABASE_URL
    python reent/scripts/run_migration.py $DATABASE_URL migrations/003_add_refresh_token_jti.sql --yes

Notes:
- If DATABASE_URL is not supplied on the command line, this script will attempt to read the
  connection string from the environment variable DATABASE_URL.
- For safety, by default the script asks for confirmation before executing the SQL unless --yes is used.
- Use --dry-run to print the SQL without executing it.
- This script prints columns and indexes for the specified verification table (default: refresh_tokens).
"""

from __future__ import annotations

import argparse
import getpass
import os
import pathlib
import sys
from typing import Optional

try:
    import psycopg2
    from psycopg2 import sql
except Exception as exc:  # pragma: no cover - runtime environment dependent
    print(
        "Missing dependency: psycopg2 is required to run this script.", file=sys.stderr
    )
    print(f"Import error: {exc}", file=sys.stderr)
    sys.exit(2)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Apply an SQL migration file to a Postgres database and verify results."
    )
    p.add_argument(
        "db_or_sql",
        nargs=1,
        help=(
            "Either the DATABASE_URL (postgresql://user:pass@host:port/dbname) followed by the SQL file, "
            "or just the SQL file if DATABASE_URL is provided via the DATABASE_URL environment variable."
        ),
    )
    p.add_argument(
        "sql_file",
        nargs="?",
        help="Path to SQL file to execute (if DATABASE_URL provided as first arg then this is required).",
    )
    p.add_argument(
        "--table",
        "-t",
        default="refresh_tokens",
        help="Table to verify after migration (columns & indexes). Default: refresh_tokens",
    )
    p.add_argument(
        "--yes",
        "-y",
        action="store_true",
        help="Do not prompt for confirmation; execute immediately.",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Print SQL contents and exit without executing.",
    )
    return p.parse_args()


def resolve_inputs(args: argparse.Namespace) -> tuple[str, pathlib.Path]:
    """
    Determine DATABASE_URL and SQL file path from arguments and environment.
    Accept either:
      - script.py <DATABASE_URL> <SQL_FILE>
      - script.py <SQL_FILE>  (DATABASE_URL taken from env)
    """
    first = args.db_or_sql[0]
    # Heuristic: if first argument looks like a URL (starts with postgresql:// or postgres://) treat it as DB URL
    if first.startswith("postgresql://") or first.startswith("postgres://"):
        if not args.sql_file:
            raise SystemExit(
                "When passing DATABASE_URL on the command line you must also provide the SQL file path."
            )
        db_url = first
        sql_path = pathlib.Path(args.sql_file)
    else:
        # First is probably the SQL file path; read DB URL from env
        sql_path = pathlib.Path(first)
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            raise SystemExit(
                "DATABASE_URL not provided. Either pass it as the first argument or set the DATABASE_URL environment variable."
            )

    if not sql_path.exists():
        raise SystemExit(f"SQL file not found: {sql_path}")

    return db_url, sql_path


def read_sql_file(path: pathlib.Path) -> str:
    text = path.read_text(encoding="utf-8")
    return text


def prompt_confirm(db_url: str, sql_path: pathlib.Path) -> bool:
    print("About to apply migration:")
    print(f"  Database: {db_url}")
    print(f"  SQL file: {sql_path}")
    print()
    print(
        "WARNING: This will execute raw SQL against the target database. Make sure you have a backup or are running against a safe environment (staging/dev)."
    )
    resp = input("Proceed? [y/N]: ").strip().lower()
    return resp in ("y", "yes")


def execute_sql(conn_str: str, sql_text: str) -> None:
    conn = None
    try:
        conn = psycopg2.connect(conn_str)
        # Many migration SQL files include COMMIT/BEGIN/DO blocks; allow the file to control transactions.
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(sql_text)
        cur.close()
    finally:
        if conn is not None:
            conn.close()


def verify_table(conn_str: str, table: str) -> None:
    """
    Print columns and indexes for the given table for quick verification.
    """
    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()
        # Columns
        cur.execute(
            """
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = %s
            ORDER BY ordinal_position;
            """,
            (table,),
        )
        cols = cur.fetchall()
        if not cols:
            print(f"No columns found for table '{table}' (it may not exist).")
        else:
            print(f"\nColumns in {table}:")
            for col_name, data_type, is_nullable in cols:
                print(f" - {col_name}    {data_type}    nullable={is_nullable}")

        # Indexes
        cur.execute(
            """
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE tablename = %s
            ORDER BY indexname;
            """,
            (table,),
        )
        idxs = cur.fetchall()
        if not idxs:
            print(f"\nNo indexes found for table '{table}'.")
        else:
            print(f"\nIndexes on {table}:")
            for indexname, indexdef in idxs:
                print(f" - {indexname}: {indexdef}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Verification query failed: {e}")


def main() -> None:
    args = parse_args()

    try:
        db_url, sql_path = resolve_inputs(args)
    except SystemExit as se:
        print(se, file=sys.stderr)
        sys.exit(2)

    sql_text = read_sql_file(sql_path)

    if args.dry_run:
        print(f"--- DRY RUN: SQL file {sql_path} contents ---\n")
        print(sql_text)
        print("\n--- End SQL ---")
        sys.exit(0)

    if not args.yes:
        if not prompt_confirm(db_url, sql_path):
            print("Migration aborted by user.")
            sys.exit(0)

    # Execute
    print("Executing migration...")
    try:
        execute_sql(db_url, sql_text)
    except Exception as exc:
        print(f"ERROR during migration execution: {repr(exc)}", file=sys.stderr)
        sys.exit(3)

    print("Migration executed successfully.")

    # Verification step
    print("\nRunning verification queries...")
    verify_table(db_url, args.table)


if __name__ == "__main__":
    main()
