#!/usr/bin/env bash
# Linux Extreme EP001 — Argument boundary: an actual, reproducible experiment.
set -euo pipefail
count=${1:-12000}
length=${2:-180}
[[ "$count" =~ ^[0-9]+$ && "$length" =~ ^[0-9]+$ ]] || { echo 'Usage: bash ep001.sh [count 1..15000] [filename length 20..220]' >&2; exit 2; }
(( count >= 1 && count <= 15000 && length >= 20 && length <= 220 )) || { echo 'Out of safe parameter range.' >&2; exit 2; }
dir=$(mktemp -d /tmp/linux-extreme-ep001.XXXXXXXX)
cleanup() { rm -rf -- "$dir"; }
trap cleanup EXIT
printf 'EP001 / Linux Extreme × Limitless\n'
printf 'kernel: %s\n' "$(uname -r)"
printf 'ARG_MAX: %s bytes\n' "$(getconf ARG_MAX)"
printf 'stack limit: %s KiB\n' "$(ulimit -s)"
printf 'file count: %s; filename length: %s\n' "$count" "$length"
printf 'test directory: %s\n' "$dir"
printf 'preparing filenames...\n'
for ((i=0; i<count; i++)); do
  printf -v serial '%08d' "$i"
  printf -v padding '%*s' "$(( length - 12 ))" ''
  : > "$dir/${serial}${padding// /x}.txt"
done
printf '\n$ grep -l NEEDLE "$dir"/*.txt\n'
set +e
( grep -l NEEDLE "$dir"/*.txt >/dev/null ) 2>"$dir/glob-stderr.txt"
glob_status=$?
set -e
printf 'exit status: %s\n' "$glob_status"
if [[ -s "$dir/glob-stderr.txt" ]]; then sed -n '1,3p' "$dir/glob-stderr.txt"; fi
printf '\n$ find "$dir" -maxdepth 1 -name "*.txt" -exec grep -l NEEDLE {} +\n'
set +e
find "$dir" -maxdepth 1 -type f -name '*.txt' ! -name 'glob-stderr.txt' -exec grep -l NEEDLE {} + > /dev/null
batch_status=$?
set -e
printf 'exit status: %s\n' "$batch_status"
printf 'note: grep status 1 means no matches; that is expected for empty test files.\n'
printf 'cleanup: temporary files removed by EXIT trap\n'
