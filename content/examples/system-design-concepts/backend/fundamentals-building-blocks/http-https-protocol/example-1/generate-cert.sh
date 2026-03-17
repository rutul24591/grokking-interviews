#!/bin/sh
# Generates a local self-signed certificate for HTTPS testing only.

set -e

openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.crt -days 365 \
  -subj "/C=US/ST=CA/L=Local/O=InterviewPrep/OU=Dev/CN=localhost"

echo "Generated localhost.key and localhost.crt"
