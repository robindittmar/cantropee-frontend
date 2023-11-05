#!/bin/bash

npm run build
rsync --progress -r dist/ robin@dittmar.dev:~/dittmar.dev/data/nginx/serve/cantropee
