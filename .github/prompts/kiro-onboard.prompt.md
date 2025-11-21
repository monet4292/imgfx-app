---
agent: agent
name: kiro-onboard
description: Generate 3 onboarding files into <project>/.kiro for AI coding agents.
argument-hint: ROOT=<path to project root>
---

# Repository Onboarding Command  
This command scans the repository and generates onboarding documents inside:

**$ROOT/.kiro/**

The output includes:

- `$ROOT/.kiro/product.md`
- `$ROOT/.kiro/structure.md`
- `$ROOT/.kiro/tech.md`

If `$ROOT` is omitted, Codex assumes the workspace root.
If the 3 files are already available, update it according to the current codebase
---

## Objective
Produce concise onboarding .kiro to help AI coding agents build, test, and modify this repository accurately and safely.

---

## Files To Generate

### **1. $ROOT/.kiro/product.md**
Contents must include:
- Summary of what the repository does  
- Project type (app, service, CLI, monorepo…)  
- Languages / frameworks  
- Purpose, domain, main flows  
- Constraints or assumptions  

---

### **2. $ROOT/.kiro/structure.md**
Contents must include:
- Architecture & major components  
- Entry points & main runtime files  
- Folder layout  
- Key configs: build, lint, test, runtime  
- Dependencies between modules  
- Where to add new features  
- CI/CD checks and pre-merge requirements  

---

### **3. $ROOT/.kiro/tech.md**
Contents must include:
- Setup / bootstrap  
- Build  
- Run  
- Test  
- Lint / type-check  
- Required environment variables  
- Required external services (DB, queue…)  
- Command ordering (e.g. “always run X before Y”)  
- Known issues, timeouts, flaky steps  
- CI requirements  
- Short code snippets if beneficial  

Add at the end:

> **Future agents should trust .kiro files first, searching only if information is incomplete or incorrect.**

---

## Steps Codex Should Perform
1. Inventory the repository: README, .kiro, configs, scripts, CI pipelines.  
2. Decide which information is needed by a coding agent.  
3. Write the 3 onboarding files accordingly.  
4. Respect the size limit (~2 pages total).  

---

## Metadata & Placeholder Notes
- `$ROOT` comes from ROOT=<path>  
- Positional arguments `$1 $2 ... $9` expand if provided  
- Named placeholders like `$TARGET`, `$FOCUS`, `$ENV`, `$FILE` are accepted  
- Write `$$` to output a literal `$` in generated Markdown  


