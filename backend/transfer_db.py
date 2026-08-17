import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

local_db_url = "postgresql://postgres:postgres@localhost:5432/academic_platform"
neon_db_url = "postgresql://neondb_owner:npg_nl6PjX4zwHLk@ep-winter-bird-axjy7248.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"

print("Connecting to local database...")
local_engine = create_engine(local_db_url)
local_metadata = MetaData()
local_metadata.reflect(bind=local_engine)

print("Connecting to Neon database...")
neon_engine = create_engine(neon_db_url)

print("Creating tables in Neon database...")
local_metadata.create_all(bind=neon_engine)

print("Transferring data...")
# Copy data in order of foreign key dependencies
for table in local_metadata.sorted_tables:
    print(f"  Transferring {table.name}...")
    with local_engine.connect() as local_conn:
        with neon_engine.connect() as neon_conn:
            # fetch all rows
            rows = local_conn.execute(table.select()).fetchall()
            if rows:
                # Need to convert list of rows into list of dictionaries
                data = [dict(row._mapping) for row in rows]
                # bulk insert
                with neon_conn.begin():
                    neon_conn.execute(table.insert(), data)
            print(f"    -> {len(rows)} rows transferred.")

print("Data transfer complete!")
