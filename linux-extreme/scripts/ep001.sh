#!/usr/bin/env bash
set -euo pipefail
count=${1:-12000}
length=${2:-180}
[[ $count =~ ^[0-9]+$ && $length =~ ^[0-9]+$ ]] || { echo 'Usage: bash ep001.sh [count] [filename-length]' >&2; exit 2; }
(( count >= 1 && count <= 50000 && length >= 20 && length <= 220 )) || { echo 'count 1..50000; filename-length 20..220' >&2; exit 2; }
dir=$(mktemp -d /tmp/linux-extreme-ep001.XXXXXXXX)
echo "Test directory: $dir"
echo "Creating $count files..."
for ((i=0;i<count;i++)); do
  printf -v serial '%08d' "$i"
  printf -v padding '%*s' "$((length-13))" ''
  name="${serial}${padding// /x}.txt"
  : > "$dir/$name"
done
echo "ARG_MAX: $(getconf ARG_MAX)"
echo 'Trying grep with shell glob...'
set +e
( grep -l 'NEEDLE' "$dir"/*.txt >/dev/null ) 2>"$dir/error.log"
status=$?
set -e
echo "glob grep exit status: $status"
if [[ -s "$dir/error.log" ]]; then head -n 3 "$dir/error.log"; fi
echo 'Trying find -exec ... + (batched):'
find "$dir" -maxdepth 1 -type f -name '*.txt' -exec grep -l 'NEEDLE' {} + >/dev/null || test "$?" -eq 1
echo 'Finished. Directory retained for inspection.'
echo "Cleanup: rm -rf -- '$dir'"
