#!/bin/sh
# Linux: demonstrate the exec argument limit with long filenames.
set -eu
export LC_ALL=C

arg_max=$(getconf ARG_MAX)
demo_dir=$(mktemp -d /tmp/grep-argmax.XXXXXXXX)
printf 'Demo directory: %s\n' "$demo_dir"
cd "$demo_dir"

# Each basename is 240 bytes: 8 digits plus 232 letters.
padding=$(printf '%0232d' 0 | tr '0' 'a')
# Each expanded argument has 2 extra bytes for ./ and 1 for its NUL.
bytes_per_arg=243
file_count=$((arg_max / bytes_per_arg + 1))
i=1
while [ "$i" -le "$file_count" ]; do
    filename=$(printf '%08d%s' "$i" "$padding")
    printf '%s\n' 'demo-match' > "$filename"
    i=$((i + 1))
done

printf 'ARG_MAX: %s bytes\n' "$arg_max"
printf 'Files: %s\n' "$file_count"
printf 'File arguments alone: %s bytes (including NUL terminators)\n' \
    "$((file_count * bytes_per_arg))"
printf '%s\n' 'Running: grep -l -- demo-match ./*'
printf "Cleanup: rm -r -- '%s'\n" "$demo_dir"

# The shell expands the glob and attempts one external grep invocation.
grep -l -- demo-match ./*
