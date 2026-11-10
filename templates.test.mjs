#!/usr/bin/env node
/**
 * Template layer checks. Run with `node templates.test.mjs`.
 *
 * These assert the promises docs/TEMPLATES.md makes: every template is a
 * message array (draft is JSON-framed, never spliced as prose), declared
 * fields match what the text actually references, placeholders in the user's
 * draft survive byte-for-byte, and every retired id still resolves.
 */
import assert from "node:assert/strict";
import {
	ALIASES, CATEGORIES, OPTIMIZATION_MODES, PREFERRED_DEFAULTS, TEMPLATES,
	getDefaultTemplateId, getTemplate
} from "./lib/prompts.js";
import { buildMessages, referencedVariables, validateTemplate } from "./lib/processor.js";

let passed = 0;
const failures = [];
function check(name, fn) {
	try {
		fn();
		passed += 1;
	} catch (error) {
		failures.push(`${name}: ${error.message}`);
	}
}

const optimization = Object.entries(TEMPLATES).filter(([, t]) => t.templateType !== "variable-extraction");
const DRAFT = "帮我把 {{topic}} 这段改得更正式，保留 {{audience}}，别改我原来的结构。";

check("seven optimization templates ship", () => assert.equal(optimization.length, 7));
check("every template is a message array", () => {
	for (const [id, template] of optimization) {
		assert.ok(Array.isArray(template.content), `${id} is not a message array`);
		assert.ok(template.content.length >= 2, `${id} has fewer than 2 messages`);
		assert.ok(template.content.every((m) => typeof m.content === "string"), `${id} message body`);
	}
});
check("metadata present and category known", () => {
	for (const [id, template] of optimization) {
		assert.ok(template.description && template.description.length > 8, `${id} description`);
		assert.ok(template.useWhen && template.avoidWhen, `${id} useWhen/avoidWhen`);
		assert.ok(CATEGORIES.includes(template.category), `${id} category ${template.category}`);
		assert.equal(template.version, "0.4.0", `${id} version`);
	}
});
check("every template explains when it helps", () => {
	for (const [id, template] of optimization) {
		assert.ok(template.benefit && template.benefit.length > 6, `${id} benefit`);
	}
});
check("published modes keep the system family out of the panel", () => {
	assert.deepEqual(OPTIMIZATION_MODES.map((mode) => mode.id), ["user", "iterate"]);
	for (const mode of OPTIMIZATION_MODES) assert.ok(mode.label, `${mode.id} label`);
	/* Retired ids still resolve, so an old history entry keeps its template. */
	assert.equal(getTemplate("general-optimize").id, "sys-role");
});
check("declared fields match referenced variables", () => {
	for (const [id, template] of optimization) {
		assert.doesNotThrow(() => validateTemplate(template), `${id} validation`);
		assert.deepEqual([...referencedVariables(template)].sort(), [...template.fields].sort(), `${id} fields`);
	}
});
check("draft is JSON-framed and survives rendering verbatim", () => {
	for (const [id, template] of optimization) {
		const source = id === "iter-diff"
			? { lastOptimizedPrompt: DRAFT, iterateInput: "语气再正式一点，结构别动" }
			: { originalPrompt: DRAFT };
		const messages = buildMessages(template, source);
		const blob = messages.map((m) => m.content).join("\n");
		assert.ok(blob.includes("{{topic}}") && blob.includes("{{audience}}"), `${id} dropped a placeholder`);
		assert.ok(!/{{#|{{\/|helpers\.|{{=<%/.test(blob), `${id} leaked mustache syntax`);
		assert.ok(blob.includes("\\\"") || blob.includes("\n"), `${id} draft was not JSON framed`);
	}
});
check("defaults point at shipped templates", () => {
	const expected = { optimize: "sys-role", userOptimize: "user-task", iterate: "iter-diff" };
	for (const [type, id] of Object.entries(expected)) {
		assert.equal(getDefaultTemplateId(type), id, `${type} default`);
		assert.ok(TEMPLATES[id], `${type} default ${id} missing`);
		assert.equal(TEMPLATES[id].templateType, type, `${id} family`);
	}
	assert.deepEqual(PREFERRED_DEFAULTS, { userOptimize: "user-task" });
});
check("every retired id resolves to a shipped template", () => {
	assert.equal(Object.keys(ALIASES).length, 9);
	for (const [oldId, newId] of Object.entries(ALIASES)) {
		assert.equal(getTemplate(oldId), TEMPLATES[newId], `${oldId} -> ${newId}`);
	}
});
check("aliases do not pollute the catalog", () => {
	for (const oldId of Object.keys(ALIASES)) assert.equal(TEMPLATES[oldId], undefined, oldId);
});
check("variable extraction is untouched", () => {
	const t = TEMPLATES["variable-extraction"];
	assert.equal(t.templateType, "variable-extraction");
	assert.deepEqual([...referencedVariables(t)].sort(), ["existingVariableNames", "hasExistingVariables", "promptContent"]);
});

if (failures.length > 0) {
	console.error(`\n${failures.length} failed, ${passed} passed`);
	for (const failure of failures) console.error(`  ✗ ${failure}`);
	process.exit(1);
}
console.log(`${passed} passed — template layer is consistent with docs/TEMPLATES.md`);
