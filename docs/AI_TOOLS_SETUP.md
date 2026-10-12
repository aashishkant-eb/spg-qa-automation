# Set up the AI tools on Ubuntu – Opencode, OpenClaude, Claude Code

You only need **one** of these. All three use the same 5 QA skills in this repo.

| Tool | Best for | Skills folder it reads |
|---|---|---|
| **Opencode** (QA guide standard) | Any AI provider (Claude, OpenAI, Gemini, local models) | `.opencode/skills/` ✅ checked |
| **OpenClaude** | Claude Code look-and-feel with other providers | `.claude/skills/` (Claude Code format) |
| **Claude Code** | Anthropic's own tool | `.claude/skills/` ✅ checked |

---

## Step 0 – Node.js (all tools need it)
```bash
node -v        # must show v18 or newer
```
If it is missing or older, install it **without sudo** with nvm (goes into `~/.nvm`):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
```
`npm install -g` must also work without sudo. Check `npm config get prefix` – if it is a system folder (`/usr`, `/usr/local`), run once:
```bash
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```
(With nvm this is not needed – nvm already installs into your home folder.)

## Option A – Opencode (recommended by the QA guide)
1. **Install**
   ```bash
   npm install -g opencode-ai          # or: curl -fsSL https://opencode.ai/install | bash
   opencode --version                  # tested with 1.18.35
   ```
   Never use `sudo npm …`. If `npm install -g` says "permission denied", fix the npm prefix (Step 0) or run without installing: `npx opencode-ai`.
2. **Connect an AI provider** (once)
   ```bash
   opencode auth login                 # pick Anthropic (or another) and follow the steps
   ```
3. **Check the QA skills are found**
   ```bash
   cd spg-qa-automation
   opencode debug skill | grep '"name"'
   ```
   You should see `testcase-generator`, `api-testcase-generator`, `automation-generator`, `bug-report-writer`, `qa-docs-writer`.
   *(Checked on 7 Oct 2026 – all 5 load from `.opencode/skills/`.)*
4. **Use it**
   ```bash
   cd spg-qa-automation
   opencode
   ```
   Then type, for example: *Generate test cases for this story: …*

## Option B – OpenClaude
1. Install: `npm install -g @gitlawb/openclaude`
2. Start it inside the repo: `cd spg-qa-automation && openclaude`
3. Choose your AI provider with the `/provider` command.
4. It reads `CLAUDE.md` and `.claude/skills/` like Claude Code. Type `/` to see the skills.

*(Install steps from the OpenClaude project; not tested on this machine.)*

## Option C – Claude Code
1. Install: `npm install -g @anthropic-ai/claude-code`
2. Start it inside the repo: `cd spg-qa-automation && claude`
3. The 5 skills and `CLAUDE.md` load automatically. Type `/testcase-generator` (or ask in plain words).
4. Want the skills in every project? From the package folder: `./run.sh skills`.

*(Checked on 7 Oct 2026 – Claude Code lists the 5 skills from `.claude/skills/`.)*

---

## Good first prompts
| You want | Type |
|---|---|
| Test cases for a story | *Generate test cases for this story: <paste story and acceptance criteria>* |
| API tests | *Generate API test cases for POST /admin/support-staff* |
| Automation | *Automate features/api/client.feature and run it* |
| Bug reports | *Write bug reports from reports/sprint-automation-report.md* |
| A report for your senior | *Write the Sprint 7 release report – short and simple* |

## Rules the AI follows here (from `AGENTS.md` / `CLAUDE.md`)
- One login at a time per account, never post emergency response comments, never send partial updates, clean up test data, never print passwords.
- It must run `npx bddgen test`, `npm run check` and the test itself before saying "done".

## Changing a skill
1. Edit the file in `.opencode/skills/<name>/SKILL.md`.
2. Run `bash scripts/sync-skills.sh` (copies it to `.claude/skills/`).
3. Restart the AI tool – skills load at start-up.
