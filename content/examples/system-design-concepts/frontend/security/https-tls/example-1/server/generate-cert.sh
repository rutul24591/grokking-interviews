#!/usr/bin/env sh
set -eu

mkdir -p certs

if [ -f certs/key.pem ] && [ -f certs/cert.pem ]; then
  echo "certs already exist in ./certs (key.pem, cert.pem)"
  exit 0
fi

# Self-signed cert for localhost dev only.
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/key.pem \
  -out certs/cert.pem \
  -days 365 \
  -subj "/CN=localhost"

echo "generated certs/key.pem and certs/cert.pem"

