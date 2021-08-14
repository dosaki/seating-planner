#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [[ -h "${SOURCE}" ]]; do # resolve ${SOURCE} until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "${SOURCE}" )" && pwd )"
    SOURCE="$(readlink "${SOURCE}")"
    [[ ${SOURCE} != /* ]] && SOURCE="${DIR}/${SOURCE}" # if ${SOURCE} was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
CURRENT_DIR="$( cd -P "$( dirname "${SOURCE}" )" && pwd )"

cd "${CURRENT_DIR}"

DEVMODE="$1"

rm -r ./app

if [[ "${DEVMODE}" == "--dev" ]]; then
    ./node_modules/webpack/bin/webpack.js --mode development
else
    ./node_modules/webpack/bin/webpack.js
fi

cp -r ./static/* ./app/

rm -r ./dist
mkdir ./dist
zip -r ./dist/seating-planner.zip ./app/

size=`du -b ./dist/seating-planner.zip | awk '{print $1}'`
if [[ $((size - 13312)) -gt 0 ]]; then
  echo -e "\e[93m\e[1m[WARNING] TOO BIG! File size is ${size}.\e[39m"
else
  echo -e "\e[92m\e[1m[SUCCESS] File size under 13k: ${size}.\e[39m"
fi
