#!/bin/bash
# https://stackoverflow.com/a/27500740/4010864

while IFS='=' read -r name val
do
    # strip '
    eval val="$val"

    # add
    echo adding "$name"
    npx now secrets add "$name" "$val"
done <.env
