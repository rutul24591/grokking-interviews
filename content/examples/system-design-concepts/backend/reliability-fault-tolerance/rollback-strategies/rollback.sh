#!/bin/bash
# disable new flow
cat > flags.json <<EOF
{"checkoutV2": false}
EOF