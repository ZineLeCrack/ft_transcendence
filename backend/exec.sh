#!/bin/bash
node server_local/main_server.js &
node server_local/server-ia.js &
node server_multi/server_multi.js
