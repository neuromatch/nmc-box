#!/bin/bash

# download elasticsearch if directory does not exist
declare -r version="7.4.0"
declare -r dl_url="https://artifacts.elastic.co/downloads/elasticsearch"
declare -r app_path="elasticsearch-${version}"

# download data from grid.ac
declare -r grid_version="2021-06-15"
declare -r grid_dl_url="https://digitalscience.figshare.com/ndownloader/files/20151785"
declare -r grid_data_path="grid-${grid_version}"


getDownloadName() {
  local osname

  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    osname=linux
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    osname=darwin
  else
    echo "Manually download elasticsearch according to your operating system from https://www.elastic.co/downloads/elasticsearch"
    exit 1
  fi

  echo elasticsearch-${version}-${osname}-x86_64
}

download() {
  local dl_name

  dl_name="$(getDownloadName)"

  wget ${dl_url}/"${dl_name}".tar.gz
  tar -zxvf "${dl_name}".tar.gz
  rm "${dl_name}".tar.gz
}

downloadGridData() {
  wget ${grid_dl_url} -O "grid-${grid_version}.zip"
  unzip "grid-${grid_version}.zip" -d "grid-${grid_version}"
  rm "grid-${grid_version}.zip"
}

main() {
  # main logic happens here
  if [ ! -d "${app_path}" ]; then
    download
  fi

  # grid data
  if [ ! -d "${grid_data_path}" ]; then
    downloadGridData
  fi

  # serve elasticsearch backend
  cd "${app_path}" || exit
  bin/elasticsearch
}

main