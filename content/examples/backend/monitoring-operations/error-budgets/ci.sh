#!/bin/bash
node -e "const { canDeploy } = require('./gate'); if (!canDeploy()) process.exit(1);"