#!/usr/bin/env bash
# Installs the QA skills (.opencode/skills/*) for an AI coding tool by symlinking them,
# so editing the repo copy updates the tool too.
# Usage:
#   bash scripts/install-skills.sh claude            # Claude Code, all projects   (~/.claude/skills)
#   bash scripts/install-skills.sh opencode-global   # Opencode, all projects      (~/.config/opencode/skills)
#   bash scripts/install-skills.sh remove claude     # undo
# Opencode already loads .opencode/skills/ when run inside this repo – no install needed there.
# Note: Opencode ALSO reads ~/.claude/skills, so install to only ONE global target to avoid duplicates.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)/.opencode/skills"
mode=${1:-}; target_name=${2:-$1}
case "$target_name" in
  claude) DEST="$HOME/.claude/skills" ;;
  opencode-global) DEST="$HOME/.config/opencode/skills" ;;
  *) echo "Usage: $0 claude|opencode-global   or   $0 remove claude|opencode-global"; exit 1 ;;
esac
mkdir -p "$DEST"
for dir in "$SRC"/*/; do
  name=$(basename "$dir"); link="$DEST/$name"
  if [ "$mode" = remove ]; then
    [ -L "$link" ] && rm "$link" && echo "removed $link"; continue
  fi
  if [ -e "$link" ] && [ ! -L "$link" ]; then echo "SKIP $link exists and is not a symlink – not touching it"; continue; fi
  ln -sfn "$dir" "$link" && echo "linked $link -> $dir"
done
