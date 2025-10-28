#!/bin/bash

# Aliases for LinguaLeap development environment
alias ll-up='docker compose -f /home/suadmin/workspaces/LinguaLeap/docker-compose.dev.yml up -d --build'
alias ll-down='docker compose -f /home/suadmin/workspaces/LinguaLeap/docker-compose.dev.yml down'
alias ll-restart='docker compose -f /home/suadmin/workspaces/LinguaLeap/docker-compose.dev.yml restart'

echo "LinguaLeap aliases (ll-up, ll-down, ll-restart) loaded."
