#!/bin/sh
set -e
aws autoscaling update-auto-scaling-group --auto-scaling-group-name app --launch-template LaunchTemplateName=app,Version=2