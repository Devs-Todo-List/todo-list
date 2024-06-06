#!/bin/bash

# Start the script to create the DB and user
/src/config.sh &

# Start SQL Server
/opt/mssql/bin/sqlservr
