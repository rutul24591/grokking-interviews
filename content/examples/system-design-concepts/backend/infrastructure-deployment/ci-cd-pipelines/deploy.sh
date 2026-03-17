#!/bin/sh
set -e
scp dist/app.tar.gz deploy@server:/srv/app/
ssh deploy@server 'systemctl restart app'