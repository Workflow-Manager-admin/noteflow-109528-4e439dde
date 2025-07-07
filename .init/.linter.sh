#!/bin/bash
cd /home/kavia/workspace/code-generation/noteflow-109528-4e439dde/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

