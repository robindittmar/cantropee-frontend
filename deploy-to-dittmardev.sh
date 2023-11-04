#!/bin/bash

npm run build
rsync -r dist/ robin@dittmar.dev:~/dittmar.dev/data/nginx/serve/cantropee
