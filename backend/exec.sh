#!/bin/bash
node --max-old-space-size=4096 server_local/main_server.js &
node --max-old-space-size=4096 server_multi/server_multi.js