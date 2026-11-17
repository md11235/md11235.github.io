#!/usr/bin/env bash
# EP002 / Sparse File: safe bounded experiment; clean up on exit.
set -euo pipefail
export LC_ALL=C
workdir=$(mktemp -d "${TMPDIR:-/tmp}/linux-extreme-ep002.XXXXXXXX")
cleanup() { rm -rf -- "$workdir"; }
trap cleanup EXIT
file="$workdir/one-tib.bin"
size=$((1024 * 1024 * 1024 * 1024))
block=4096
last_block=$((size / block - 1))
printf 'Linux Extreme / EP002 / SPARSE FILE\n'
printf 'Date (UTC): %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
printf 'Kernel: %s\n' "$(uname -srmo)"
printf 'Filesystem: %s\n' "$(stat -f -c %T "$workdir")"
printf 'Filesystem block size: %s bytes\n' "$(stat -f -c %S "$workdir")"
printf 'Location: %s\n' "$workdir"
printf 'Target size: %s bytes (1 TiB)\n' "$size"
printf '\n$ truncate -s 1T one-tib.bin\n'
truncate -s 1T "$file"
report() {
  local logical blocks unit
  read -r logical blocks unit < <(stat -c '%s %b %B' "$file")
  printf 'stat size (logical): %s bytes\n' "$logical"
  printf 'stat blocks allocated: %s (units of %s bytes)\n' "$blocks" "$unit"
  printf 'estimated allocated: %s bytes\n' "$((blocks * unit))"
  printf 'du apparent: %s\n' "$(du -h --apparent-size "$file" | cut -f1)"
  printf 'du disk usage: %s\n' "$(du -h "$file" | cut -f1)"
}
report
printf '\n$ read 16 bytes from the middle of the hole (od -An -tx1)\n'
dd if="$file" bs=1 skip=$((1024 * 1024 * 1024)) count=16 status=none | od -An -tx1
printf '\n$ write 4096 bytes at the first and last 4 KiB of the file\n'
head -c "$block" /dev/zero | tr '\000' 'A' | dd of="$file" bs="$block" seek=0 conv=notrunc status=none
head -c "$block" /dev/zero | tr '\000' 'Z' | dd of="$file" bs="$block" seek="$last_block" conv=notrunc status=none
report
printf '\n$ check first/last byte and hole byte\n'
printf 'start: '; dd if="$file" bs=1 skip=0 count=1 status=none | od -An -tc
printf 'hole:  '; dd if="$file" bs=1 skip=$((1024 * 1024 * 1024)) count=1 status=none | od -An -tx1
printf 'end:   '; dd if="$file" bs=1 skip=$((size - 1)) count=1 status=none | od -An -tc
printf '\nExperiment finished. Temporary directory removed on exit.\n'
