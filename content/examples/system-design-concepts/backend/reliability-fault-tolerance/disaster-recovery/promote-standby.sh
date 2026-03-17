#!/bin/bash
set -e

# Stop writes on primary
psql -c "SELECT pg_switch_wal();"

# Promote standby
ssh standby 'pg_ctl promote -D /var/lib/postgresql/data'

# Update routing
aws route53 change-resource-record-sets --hosted-zone-id ZONE --change-batch file://promote.json