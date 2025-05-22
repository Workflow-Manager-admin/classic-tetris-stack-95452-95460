#!/bin/bash
cd /home/kavia/workspace/code-generation/classic-tetris-stack-95452-95460/main_container_for_classic_tetris_stack
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

