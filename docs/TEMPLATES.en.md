# The template system (0.7.0)

> Chinese original: [TEMPLATES.md](TEMPLATES.md). The shipped template copy is Chinese (the model is told to answer in the draft's language); the skeletons below are translations for readers of this file.

The panel exposes **two modes**: `Prompt` (a user-prompt draft) and `Iterate` (a previous result plus a correction). Behind them sit **seven optimization templates** plus one tool template (`variable-extraction`). Five appear in the panel — four prompt templates and `iter-diff` — grouped as Basics / Structure / Examples / Reasoning / Iteration.

## 0. At a glance

| ID | Name | Mode | Category | Default |
| --- | --- | --- | --- | --- |
| `user-task` | Task brief | user | Basics | yes |
| `user-spec` | Structured spec | user | Structure | |
| `user-fewshot` | Worked examples | user | Examples | |
| `user-reason` | Reasoning scaffold | user | Reasoning | |
| `iter-diff` | Minimal diff | iterate | Iteration | yes |
| `sys-role` | Role contract | system | Basics | retired from the panel |
| `sys-soul` | Agent persona file | system | Basics | retired from the panel |
| `variable-extraction` | Variable extraction | tool | — | behind the `{ }` action |

## 0.1 Panel behaviour

| Event | Rule |
| --- | --- |
| Open the panel | Run once with the mode's default template; an empty draft spends nothing |
| Switch mode | Abort the live stream, re-run with the new mode's default; switches within 220 ms coalesce |
| Switch template | Selection only — no run. A `Run with new template` button decides when to spend |
| Replace draft | Show a line diff first; write on confirm; offer a 9-second undo |
| Same draft again | Reuse the result on screen, no request |
| Draft changed | Mark the result "Draft updated"; `⌘↵` re-runs |
| Language | Follows `<html lang>`; `labelEn` / `descriptionEn` / `useWhenEn` / `benefitEn` serve English |
| System prompts | Removed from the panel in 0.5.0; IDs and aliases still resolve |

## 1. What was wrong with the first ten

The 0.3.x set was a 1:1 port of `linshenkx/prompt-optimizer`'s ten templates across five "optimization modes". Diagnosed problems:

| Problem | Evidence |
| --- | --- |
| Five near-duplicate pairs | `general-optimize` / `analytical-optimize` share the LangGPT skeleton (~90%); `user-prompt-basic` / `user-prompt-professional` differ only in wording intensity; `soul-hermes-compose` / `soul-openclaw-compose` are the same file with different names; `iterate` / `soul-iterate` both rewrite "the previous version" |
| No way to choose | The menu showed a label and a checkmark — no category, no "when to use", no "when not to" |
| One skeleton for everything | Every system template forced a role/task/rules shape, which over-structures non-role prompts (e.g. customer-service scripts) |
| String templates | The system prompt was concatenated with the draft; the draft could be read as instructions |
| No failure boundaries | Nothing said which template to avoid, so the default was always "whatever is first" |

## 2. Research and selection

Five methods were kept because each has published evidence, a distinct structure, and a clear failure boundary. The full evidence table is in the Chinese original (§2); sources are listed at the end.

| Method | Core structure | Use it when | Don't use it when | Source |
| --- | --- | --- | --- | --- |
| A. Role contract | role → task → rules (must / instead-of) → output → exceptions | the prompt defines long-lived behaviour | the task is a pure data extraction — tags beat prose | Anthropic prompting guide ("give Claude a role") |
| B. Structured spec | goal / context / data / requirements / steps / format / boundaries | there is a lot of material and requirements must be separated from data | the request is one sentence — the structure outweighs the content | OpenAI GPT-5 guide (structured `<spec>` sections improve adherence) |
| C. Worked examples | 3–5 relevant, diverse, structured `<example>` blocks | format is strict and prose descriptions drift | examples would be longer than the output | Anthropic ("examples are one of the most reliable ways to steer format") |
| D. Reasoning scaffold | restate → plan → check assumptions → answer with the plan visible | comparison, judgement, multi-step tasks | latency matters or the answer is a single fact | Wei et al. 2022 (chain-of-thought) |
| E. Minimal diff | keep the previous version, list only the changes | you have a previous result and one correction | starting from scratch — there is nothing to diff against | OpenAI metaprompting (minimal edits), Cursor-style review |

Why these five and not others (the "prompt report" taxonomy has 58 techniques): each one maps to a *different point* in the lifecycle — defining behaviour (A), asking for work (B), pinning format (C), forcing process (D), and revising (E). They are complementary rather than competing; the four prompt templates plus one iterate template cover all of them without overlap.

Deliberately excluded: tree-of-thought and self-consistency (multiple calls — the panel is one streaming call), ReAct / tool-use scaffolding (the harness owns tools), and "prompt polish" rituals such as "take a deep breath" (no reproducible effect).

## 3. The templates

Common rules for all seven:

1. **The draft is data, not instructions.** It is embedded through `{{#helpers.toJson}}{{{originalPrompt}}}{{/helpers.toJson}}` and the template says explicitly that an "ignore the above" inside it is data. This moves the injection surface from same-level text to a string literal.
2. **Output the artifact only** — no analysis, no preamble, no code fences around the result.
3. **Keep placeholders verbatim** — existing `{{variable}}` names are never renamed or replaced.
4. **Answer in the draft's language.**
5. **Resolve contradictions** into one decidable rule instead of keeping both.

### 3.1 `sys-role` — role contract (system, retired from panel)

Fields: `originalPrompt`. Skeleton: role → task (goal, audience, scenario) → rules (must, and "instead of X, do Y") → output (format, length, language, citation) → exceptions (insufficient input, out of scope). Failure boundary: prose rules are weaker than tags for pure extraction.

### 3.2 `sys-soul` — agent persona file (system, retired)

Fields: `originalPrompt`. Output: identity, language habits, interaction defaults, judgement style, 2–4 sample lines, 200–600 characters; `----- FILE: USER.md -----` only when user-side facts are explicit. Failure boundary: writing a role-play script loses the point of a long-lived configuration.

### 3.3 `user-task` — task brief (user, default)

Fields: `originalPrompt`. Skeleton:

```text
Goal: one sentence describing the result.
Context: why it is needed, who reads it, how it will be used (1–3 sentences).
Known: available material, constraints, references — write "not provided" when absent.
Steps: 1. … 2. …
Format: structure, length, language, tables or lists allowed?
Boundaries: what not to do, and the replacement behaviour.
Ambiguity: list 2–3 key ambiguities, continue with the most likely assumption, flag it at the end.
```

Failure boundary: if the request is already a spec, this adds a redundant layer — use `user-spec`.

### 3.4 `user-spec` — structured spec (user)

Fields: `originalPrompt`. Skeleton: goal → context → materials (as data) → requirements (numbered, each testable) → out of scope → acceptance → output format. Failure boundary: duplicating the same requirement as both a rule and an acceptance item.

### 3.5 `user-fewshot` — worked examples (user)

Fields: `originalPrompt`. Output: an instruction, then 3–5 `<example>` blocks with input and output, plus the rule each example demonstrates; examples must differ in surface form but agree in structure. Failure boundary: examples longer than the expected answer, or examples that contradict the instruction.

### 3.6 `user-reason` — reasoning scaffold (user)

Fields: `originalPrompt`. Skeleton: restate the question → list what is known and unknown → plan → check assumptions → answer with a short visible plan. Failure boundary: exposing a long chain of thought when the user asked for an answer; the scaffold asks for a brief plan, not a transcript.

### 3.7 `iter-diff` — minimal diff (iterate, default)

Fields: `lastOptimizedPrompt`, `iterateInput`. Rules: keep everything not mentioned by the feedback, apply the smallest edit that satisfies it, output the whole new version only. Failure boundary: feedback that asks for a rewrite contradicts "minimal"; the template then says to rewrite and say so.

### 3.8 `variable-extraction` — tool

Fields: `promptContent`, `existingVariableNames`, `hasExistingVariables`. Output: `{ "variables": [...], "templated": "..." }` with names in `{{snake_case}}`; existing names are reused, never redefined.

## 4. Variable rules

| Rule | Detail |
| --- | --- |
| Syntax | `{{name}}`, snake_case, no spaces inside the braces |
| Scope | Only names that appear in the template's `fields`; the registry rejects mismatches |
| Preservation | Existing placeholders survive rendering verbatim — the mustache layer escapes the draft, not the placeholders |
| Extraction | Names come from the model, deduplicated against `existingVariableNames`; the templated text is written back only after the user confirms |

## 5. Migration map

| Old ID | New ID | Reason |
| --- | --- | --- |
| `general-optimize` | `sys-role` | same skeleton, clearer name |
| `analytical-optimize` | `sys-role` | ~90% duplicate; analysis is not a separate structure |
| `user-prompt-basic` | `user-task` | merged with professional |
| `user-prompt-professional` | `user-task` | merged; "professional" described intensity, not a method |
| `user-prompt-planning` | `user-reason` | planning is one scaffold, not a separate mode |
| `soul-hermes-compose` | `sys-soul` | same SOUL.md generator |
| `soul-openclaw-compose` | `sys-soul` | duplicate |
| `iterate` | `iter-diff` | merged with `soul-iterate` |
| `soul-iterate` | `iter-diff` | duplicate |

All nine aliases resolve at `getTemplate()`; historical records and old client IDs keep working. The published mode list narrowed to `user` / `iterate` in 0.5.0 — a **breaking change** for clients that requested `optimizationMode: "system"`: the host now answers `mode-template-mismatch`.

## 6. Acceptance checklist

1. Seven templates registered; each renders to a two-message array with `fields` matching its referenced variables.
2. No `{{#`, `helpers.` or `{{=<%` residue after rendering the skeleton — only the draft's own placeholders remain.
3. Every template carries `description`, `category`, `useWhen`, `avoidWhen`, `benefit` (plus `*En` variants).
4. The panel exposes exactly `user-task`, `user-spec`, `user-fewshot`, `user-reason`, `iter-diff`.
5. Old IDs and aliases resolve; `variable-extraction` is unchanged.
6. `templates.test.mjs` passes (11 checks).
7. `docs/TEMPLATES.md` matches the registry.
8. `/prompt-polish/models` returns the metadata the menu renders.

## 7. Sources

1. Anthropic, *Prompting best practices* — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
2. OpenAI, *GPT-5 prompting guide* — https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide
3. Wei et al., *Chain-of-Thought Prompting Elicits Reasoning in LLMs* — https://arxiv.org/abs/2201.11903
4. Schulhoff et al., *The Prompt Report* — https://arxiv.org/abs/2406.06608
5. Sclar et al., *Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design* — https://arxiv.org/abs/2310.11324
