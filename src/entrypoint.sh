#!/bin/sh -l

# make sure to make this file executable: https://github.com/orgs/community/discussions/26239
# make sure to store with only Unix-EOL: https://stackoverflow.com/a/69072648/1169798

# move to our code folder
cd /home/iadopt-catalogue/

# run build process
pnpm run build
