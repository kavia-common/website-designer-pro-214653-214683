#!/bin/bash
cd /home/kavia/workspace/code-generation/website-designer-pro-214653-214683/website_designer_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

