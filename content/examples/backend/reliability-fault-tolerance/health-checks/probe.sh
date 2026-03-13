#!/bin/bash
set -e

curl -s http://localhost:3000/health/live
curl -s http://localhost:3000/health/ready
curl -s http://localhost:3000/health/startup