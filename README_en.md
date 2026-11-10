# dsh-prompt-polish

[简体中文](README.md) · [English](README_en.md)

[![GitHub stars](https://img.shields.io/github/stars/Minus77/dsh-prompt-polish?style=social)](https://github.com/Minus77/dsh-prompt-polish)
[![license](https://img.shields.io/github/license/Minus77/dsh-prompt-polish)](LICENSE)

A prompt polisher for [DeepSeek Harness](https://www.deepseek.com/harness/) that lives next to the composer.

Most draft boxes hold one line like "write me a weekly report" and leave the model to guess the rest. This plugin rewrites that line into a prompt that states the context, the delivery format, and the boundaries, before you hit send. The entry point is the pill at the bottom right of the composer, styled the same as the native `Select model` control.

![Panel](docs/screenshots/en/02-panel.png)

## What it does

Open the panel and it runs once with the default template for the current mode, streaming the result in. From there you can send it, or write it back to the composer and edit a few words yourself.

Writing back shows a line diff first: what gets removed, what gets added. Only after you confirm does it touch the draft, and for nine seconds there is an undo button. If you edit the draft in the meantime the undo button disappears, so it cannot overwrite what you just typed.

Switching templates is separate from calling the model. Picking another template only changes the selection; a "Run with new template" button appears at the bottom, and that is what spends a call. This matters when you are browsing templates: each click should not cost money.

## Install

DeepSeek Harness `0.1.7` or newer (verified on the `0.2.2-rc.1` desktop build), Node.js 18 or newer. There is no build step; `lib/*.js` is the code that runs.

From npm:

```sh
dsh plugin --profile desktop add @minus77/dsh-prompt-polish
```

Use `--profile web` for the web build.

From GitHub:

```sh
dsh plugin --profile desktop add github:Minus77/dsh-prompt-polish
```

Or pack it yourself. The repository root carries a `dsh.bundle` manifest, and `npm pack` produces `minus77-dsh-prompt-polish-<version>.tgz`, which `dsh plugin add` accepts.

Restart Harness once after installing. The host-side routes and template registry load at process start, so reloading the window is not enough.

## Usage

### Click once, then wait

Write a draft, click `Prompt polish` at the bottom right. The panel opens above the composer and has already run once with the default template.

The result card header shows the model, elapsed time, character count, and token usage. The footer keeps three controls: `Follow current`, `Send`, `Replace draft`. No extra "start" button, because opening the panel already did the work.

![Entry and result](docs/screenshots/en/01-entry.png)

### Look at the diff before replacing

`Replace draft` shows a comparison first. Removed lines get a red background, added lines a green one, and runs of unchanged lines collapse into a single note.

![Line diff](docs/screenshots/en/03-diff.png)

Confirm to write it into the composer. `Cancel` or `Esc` goes back to the result and leaves the draft alone.

### Nine seconds of undo

After the write, the entry pill turns into `✓ Replaced` with an `Undo` button. Click it within nine seconds and the original text comes back.

![Undo](docs/screenshots/en/04-undo.png)

### Iterate

Switch to `Iterate`, describe what should change, and click `Start iteration`. The model rewrites the previous result as a minimal diff, and the new version is appended to the chain so you can compare versions.

![Iterate](docs/screenshots/en/07-iterate.png)

### Templates

The template menu is grouped by category, and each entry says what the template is for plus "Use when" and "Why". Seven templates live in the registry; the panel exposes the five that apply to composer drafts.

![Template menu](docs/screenshots/en/08-templates.png)

| Template | Category | Use when |
| --- | --- | --- |
| `Task brief` `user-task` | Basics | The request is scattered, missing context, or silent about the output |
| `Structured spec` `user-spec` | Structure | Lots of material, and "requirements" must be separated from "data" |
| `Worked examples` `user-fewshot` | Examples | Output format is strict and description is easy to get wrong |
| `Reasoning scaffold` `user-reason` | Reasoning | Comparison, judgement, multi-step work |
| `Minimal diff` `iter-diff` | Iteration | You have a previous version and a change to make |

`sys-role` (role contract) and `sys-soul` (agent persona file) remain in the registry, and the old IDs and aliases still resolve, but they stopped appearing in the panel in 0.5.0. The panel is built around composer drafts, and a system prompt is not that.

### Variable extraction

The `{ }` button in the result header turns the varying parts of the result into variables. This costs one model call. You get a template with `{{variables}}` that is written back to the template list, so you can reuse the shape by filling values later.

### History and version comparison

Once saving is allowed, the clock icon opens the history. Entries are listed newest first; expand one to see the original and the result, copy either one, write one back, compare versions, or delete it.

![History](docs/screenshots/en/05-history.png)

Versions in the same chain can be switched in the comparison view. The "structure changed" line below is computed locally: line additions and deletions, and how much of the goal, context, constraints, and format information each side covers. No model call happens here.

![Version comparison](docs/screenshots/en/06-compare.png)

### Dark mode

Every colour comes from theme tokens, so light and dark follow the Harness theme without a separate palette.

![Dark mode](docs/screenshots/en/09-dark.png)

## Design notes

The UI is modelled on Harness's own composer, and a few constraints are written into the code:

- The panel mounts into the `conversation.input.right` slot and positions itself on `document.body` through `createPortal`. The composer carries `container-type: inline-size`, and without the portal the panel gets clipped.
- Only `--dsw-alias-*` tokens are used. Depth comes from `color-mix(in srgb, var(--dsw-alias-label-primary) N%, transparent)`.
- Controls are 26 to 28px tall, the panel is 520px wide, and the corner radius is 14. No gradients, glows, or breathing animations.
- States such as "generating", "replaced", and "draft updated" are spelled out in words so colour never carries the meaning alone.

## License

[GNU AGPL-3.0-or-later](LICENSE)

## Repository layout

```text
dsh-prompt-polish/
├── LICENSE                  AGPL-3.0-or-later
├── README.md                Chinese documentation
├── README_en.md             This file
├── package.json             Plugin manifest: exports / dsh.client.inject / bundle.patch
├── cordis.patch.yml         The plugin row inserted by the bundle
├── compat.mjs               Contract audit against the local asar (16 checks)
├── templates.test.mjs       Template registry tests (11 checks)
├── lib/
│   ├── index.js             Host: /models, /optimize (NDJSON stream), /extract-variables
│   ├── client.js            Client: entry pill, panel, diff, undo, history, compare, i18n
│   ├── prompts.js           Template registry, aliases, bilingual metadata
│   ├── processor.js         Request assembly and stream parsing
│   ├── mustache.js          mustache rendering (JSON helper / set delimiter)
│   └── extraction.js        Variable extraction and template fill-back
└── docs/
    ├── TEMPLATES.md         Template system (Chinese)
    ├── TEMPLATES.en.md      Template system: methods, skeletons, variables, migration
    └── screenshots/         Images used here (Chinese and English sets)
```
