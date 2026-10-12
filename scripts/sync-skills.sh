#!/usr/bin/env bash
# Copies the canonical skills (.opencode/skills – QA guide location) to .claude/skills
# so Claude Code / OpenClaude find them as project skills. Run after editing any SKILL.md.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf .claude/skills && mkdir -p .claude && cp -r .opencode/skills .claude/skills
echo "Synced $(ls .claude/skills | wc -l) skills to .claude/skills"
