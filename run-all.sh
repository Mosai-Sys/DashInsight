#!/bin/bash
set -e
bash env-check.sh
bash build-check.sh
bash test.sh
