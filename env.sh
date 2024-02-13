#!/usr/bin/env bash

# Recreate config file and assignment
echo "// Generated automatically, please don't write here" > ./src/env-config.js
echo "" >> ./src/env-config.js
echo "window._env_ = {" >> ./src/env-config.js

# Loop on environment variables prefixed with
# add them to env-config.js


for mockconfig_var in $(env | grep -i REACT_APP); do
    varname=$(printf '%s\n' "$mockconfig_var" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$mockconfig_var" | sed -e 's/^[^=]*=//')

    echo "  $varname: \"$varvalue\"," >> ./src/env-config.js
done

echo "};" >> ./src/env-config.js
