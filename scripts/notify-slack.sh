#!/usr/bin/env bash
# Posts the run summary to Slack (QA guide: "Setup Slack/email notification for pipeline results").
# Needs SLACK_WEBHOOK_URL (a Slack incoming-webhook URL). Does nothing if it is not set.
set -euo pipefail
: "${SLACK_WEBHOOK_URL:=}"
if [ -z "$SLACK_WEBHOOK_URL" ]; then echo "SLACK_WEBHOOK_URL not set – skipping Slack message"; exit 0; fi
summary=$(sed -n '1,8p' reports/sprint-automation-report.md 2>/dev/null || echo "No report found")
payload=$(python3 -c 'import json,sys; print(json.dumps({"text": sys.argv[1] + ("\n" + sys.argv[2] if sys.argv[2] else "")}))' "$summary" "${RUN_URL:-}")
curl -fsS -X POST -H 'Content-Type: application/json' --data "$payload" "$SLACK_WEBHOOK_URL" >/dev/null
echo "Slack message sent"
