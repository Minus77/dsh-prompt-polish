window.__ModuleLoader__.load({
	id: "@benrong/dsh-prompt-polish",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		const R = typeof react.useState === "function" ? react : react.default;
		const h = R.createElement;
		/**
		 * DSH 0.2.2 turned the docked composer into a CSS containment context
		 * (`container-type: inline-size` on the controls row). Under containment,
		 * `position: fixed` resolves against the composer, not the viewport, so a
		 * panel mounted inside the slot is clipped and dragged to the right. The
		 * shipped slot contract states the fix verbatim: "fixed overlays must portal
		 * to the document body because the docked composer contains them."
		 */
		let reactDom = require("react-dom");
		const createPortal = typeof reactDom.createPortal === "function"
			? reactDom.createPortal
			: (reactDom.default && typeof reactDom.default.createPortal === "function" ? reactDom.default.createPortal : null);
		const useState = R.useState;
		const useRef = R.useRef;
		const useEffect = R.useEffect;
		const useCallback = R.useCallback;
		const useMemo = R.useMemo;
		//#region styles.js
		var STYLE_ID = "dsh-prompt-polish-style-2";
		/**
		 * One stylesheet, injected once and shared by every occurrence.
		 *
		 * House rules, copied from the app's own controls rather than invented:
		 *   - only `--dsw-alias-*` theme tokens, so light/dark follow for free;
		 *   - two surface levels (panel = bg-layer-1, inset = label-primary @2-4%);
		 *   - borders are 1px border-l1/l2, never a gradient or a glow;
		 *   - heights 26 (seat) / 28 (buttons, controls) / 24 (mini);
		 *   - radii 14 panel, 10 card, 8 control, 7 icon button;
		 *   - one filled primary (button-primary-fill, the app's black), the rest
		 *     ghost or hairline outlined;
		 *   - motion is 120-160ms opacity/translate only, and none of it loops.
		 */
		var CSS = [
			".pp2-seatwrap{display:inline-flex;align-items:center}",
			".pp2-seat{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 8px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:12px;line-height:1;cursor:pointer;white-space:nowrap;transition:background .12s ease,color .12s ease}",
			".pp2-seat:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".pp2-seat:active{background:var(--dsw-alias-interactive-bg-active)}",
			".pp2-seat[data-open=\"1\"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".pp2-seat[data-flash=\"1\"]{color:var(--dsw-alias-state-success-primary)}",
			".pp2-undo{height:24px;margin-left:2px;padding:0 7px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-link,var(--dsw-alias-brand-primary));font-family:inherit;font-size:11.5px;line-height:1;cursor:pointer;white-space:nowrap}",
			".pp2-undo:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".pp2-diff{flex:1 1 auto;min-height:0;overflow:auto;padding:6px 10px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.55;scrollbar-width:thin}",
			".pp2-dl{display:flex;gap:8px;padding:0 4px;border-radius:4px}",
			".pp2-dl>span:last-child{flex:1 1 auto;white-space:pre-wrap;overflow-wrap:anywhere}",
			".pp2-dl-s{flex:0 0 12px;color:var(--dsw-alias-label-tertiary);user-select:none}",
			".pp2-dl[data-t=\"del\"]{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 9%,transparent)}",
			".pp2-dl[data-t=\"add\"]{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 11%,transparent)}",
			".pp2-dl[data-t=\"gap\"]{justify-content:center;padding:2px 0;color:var(--dsw-alias-label-tertiary);font-family:inherit;font-size:11px}",
			".pp2-seat:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}",
			".pp2-i{display:block;flex:0 0 auto}",
			".pp2-spin{animation:pp2-rot .9s linear infinite}",
			"@keyframes pp2-rot{to{transform:rotate(360deg)}}",
			".pp2{position:fixed;z-index:1200;display:flex;flex-direction:column;width:min(520px,calc(100vw - 24px));max-height:min(72vh,660px);border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 12px 32px color-mix(in srgb,#000 14%,transparent),0 2px 8px color-mix(in srgb,#000 6%,transparent);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:1.5;animation:pp2-in .14s ease-out}",
			"@keyframes pp2-in{from{opacity:0;transform:translateY(4px) scale(.995)}to{opacity:1;transform:none}}",
			"body[data-ds-dark-theme] .pp2{box-shadow:0 16px 40px rgba(0,0,0,.55),0 2px 8px rgba(0,0,0,.35)}",
			".pp2-head{display:flex;align-items:center;gap:6px;height:44px;padding:0 8px 0 12px;flex:0 0 auto}",
			".pp2-title{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;letter-spacing:.01em;white-space:nowrap;color:var(--dsw-alias-label-primary)}",
			".pp2-title .pp2-i{color:var(--dsw-alias-label-tertiary)}",
			".pp2-grow{flex:1 1 auto;min-width:0}",
			".pp2-ibtn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background .12s ease,color .12s ease}",
			".pp2-ibtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".pp2-ibtn:active{background:var(--dsw-alias-interactive-bg-active)}",
			".pp2-ibtn[data-on=\"1\"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".pp2-ibtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}",
			".pp2-badge{position:absolute;top:5px;right:5px;width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-1)}",
			".pp2-bar{display:flex;align-items:center;gap:8px;padding:0 12px 10px;flex:0 0 auto;min-width:0}",
			".pp2-seg{display:inline-flex;gap:2px;padding:2px;border-radius:9px;background:var(--dsw-alias-interactive-bg-hover);flex:0 0 auto}",
			".pp2-seg button{height:24px;padding:0 9px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:12px;cursor:pointer;white-space:nowrap;transition:background .12s ease,color .12s ease}",
			".pp2-seg button:hover:not(:disabled):not([data-on=\"1\"]){color:var(--dsw-alias-label-primary)}",
			".pp2-seg button[data-on=\"1\"]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-weight:600;box-shadow:0 1px 2px color-mix(in srgb,#000 10%,transparent),0 0 0 .5px color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent)}",
			".pp2-seg button:disabled{opacity:.5;cursor:not-allowed}",
			".pp2-seg button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}",
			".pp2-menuwrap{position:relative;display:inline-flex;min-width:0}",
			".pp2-pick{display:inline-flex;align-items:center;gap:4px;height:26px;max-width:190px;padding:0 7px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:12px;cursor:pointer;min-width:0;transition:background .12s ease,color .12s ease}",
			".pp2-pick:hover:not(:disabled),.pp2-pick[data-on=\"1\"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".pp2-pick:disabled{opacity:.5;cursor:not-allowed}",
			".pp2-pick:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}",
			".pp2-pick>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".pp2-menu{position:absolute;top:calc(100% + 5px);left:0;z-index:9;min-width:184px;max-width:280px;max-height:min(320px,60vh);overflow:auto;padding:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 10px 28px color-mix(in srgb,#000 16%,transparent),0 1px 3px color-mix(in srgb,#000 8%,transparent);animation:pp2-in .1s ease-out}",
			".pp2-menu[data-up=\"1\"]{top:auto;bottom:calc(100% + 5px)}",
			".pp2-menu[data-align=\"right\"]{left:auto;right:0}",
			".pp2-item{display:flex;align-items:center;gap:8px;width:100%;height:28px;padding:0 8px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:12px;text-align:left;cursor:pointer;white-space:nowrap}",
			".pp2-item:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".pp2-item[aria-checked=\"true\"]{font-weight:600}",
			".pp2-item>span{overflow:hidden;text-overflow:ellipsis}",
			".pp2-item .pp2-sub{margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:11.5px;font-weight:400}",
			".pp2-group{padding:6px 8px 3px;font-size:11px;color:var(--dsw-alias-label-tertiary);letter-spacing:.02em}",
			".pp2-menu[data-wide=\"1\"]{min-width:296px;max-width:320px;padding:5px}",
			".pp2-item[data-rich=\"1\"]{height:auto;min-height:32px;padding:6px 8px;align-items:flex-start;white-space:normal;overflow:visible}",
			".pp2-item[data-rich=\"1\"]>span{overflow:visible;white-space:normal}",
			".pp2-ttl{display:block;font-size:12px;line-height:1.4}",
			".pp2-desc{display:block;margin-top:1px;font-size:11px;line-height:1.45;font-weight:400;color:var(--dsw-alias-label-tertiary)}",
			".pp2-why{display:block;margin-top:2px;font-size:11px;line-height:1.4;font-weight:400;color:var(--dsw-alias-label-tertiary);opacity:.9}",
			".pp2-main{position:relative;flex:1 1 auto;min-height:0;display:flex;flex-direction:column}",
							".pp2-body{flex:1 1 auto;min-height:0;overflow:auto;padding:0 12px 12px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;background-image:linear-gradient(var(--dsw-alias-bg-layer-1),transparent),linear-gradient(transparent,var(--dsw-alias-bg-layer-1)),radial-gradient(farthest-side at 50% 0,color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent),transparent),radial-gradient(farthest-side at 50% 100%,color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent),transparent);background-position:top,bottom,top,bottom;background-size:100% 18px,100% 18px,100% 7px,100% 7px;background-repeat:no-repeat;background-attachment:local,local,scroll,scroll}",
			".pp2-fade{position:absolute;left:0;right:0;bottom:0;height:26px;pointer-events:none;background:linear-gradient(to top,var(--dsw-alias-bg-layer-1) 26%,color-mix(in srgb,var(--dsw-alias-bg-layer-1) 55%,transparent) 62%,transparent)}",
			".pp2-muted{color:var(--dsw-alias-label-tertiary);font-size:11.5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".pp2-empty{display:flex;flex-direction:column;align-items:center;gap:4px;padding:20px 12px 16px;text-align:center}",
			".pp2-empty-i{display:flex;align-items:center;justify-content:center;width:36px;height:36px;margin-bottom:4px;border-radius:10px;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-tertiary)}",
			".pp2-empty-t{margin:0;font-size:12.5px;color:var(--dsw-alias-label-primary)}",
			".pp2-empty-s{margin:0;font-size:11.5px;color:var(--dsw-alias-label-tertiary);max-width:320px}",
			".pp2-card{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1);overflow:hidden;flex:0 0 auto}",
			".pp2-card-h{display:flex;align-items:center;gap:6px;height:30px;padding:0 6px 0 10px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 2%,transparent);border-bottom:1px solid var(--dsw-alias-border-l1);min-width:0}",
			".pp2-card-t{font-size:11.5px;font-weight:600;color:var(--dsw-alias-label-secondary);flex:0 0 auto}",
			".pp2-stale{flex:0 0 auto;font-size:10.5px;line-height:18px;padding:0 7px;border-radius:999px;color:var(--dsw-alias-label-secondary);background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent)}",
			".pp2-card-m{font-size:11px;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}",
			".pp2-card-b{padding:9px 12px 10px;max-height:min(260px,32vh);overflow:auto;scrollbar-width:thin}",
			".pp2-card[data-compact=\"1\"] .pp2-card-b{max-height:152px;-webkit-mask-image:linear-gradient(to bottom,#000 84%,transparent);mask-image:linear-gradient(to bottom,#000 84%,transparent)}",
			".pp2-text{margin:0;font-size:12.5px;line-height:1.68;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-primary);font-family:inherit}",
			".pp2-text[data-placeholder=\"1\"]{color:var(--dsw-alias-label-tertiary)}",
			".pp2-caret{display:inline-block;width:2px;height:1em;margin-left:1px;vertical-align:-2px;border-radius:1px;background:var(--dsw-alias-label-tertiary);animation:pp2-blink 1.1s steps(2,start) infinite}",
			"@keyframes pp2-blink{to{visibility:hidden}}",
			".pp2-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-business-primary);flex:0 0 auto;animation:pp2-pulse 1.4s ease-in-out infinite}",
			"@keyframes pp2-pulse{0%,100%{opacity:.35}50%{opacity:1}}",
			".pp2-tailed{display:flex;align-items:center;gap:6px;min-width:0}",
			".pp2-acts{display:flex;align-items:center;gap:6px;flex:0 0 auto}",
			".pp2-foot{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:0 0 auto;min-width:0}",
			".pp2-btn{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:12px;line-height:1;cursor:pointer;white-space:nowrap;flex:0 0 auto;transition:background .12s ease,border-color .12s ease}",
			".pp2-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}",
			".pp2-btn:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}",
			".pp2-btn:disabled{opacity:.45;cursor:not-allowed}",
			".pp2-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}",
			".pp2-btn[data-sm=\"1\"]{height:24px;padding:0 9px;font-size:11.5px}",
			".pp2-btn[data-primary=\"1\"]{border-color:transparent;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);font-weight:600}",
			".pp2-btn[data-primary=\"1\"]:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}",
			".pp2-btn[data-primary=\"1\"]:active:not(:disabled){background:var(--dsw-alias-button-primary-hover);filter:brightness(.96)}",
			".pp2-ta{width:100%;min-height:56px;max-height:150px;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 2%,transparent);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:12.5px;line-height:1.55;resize:vertical;box-sizing:border-box;outline:none;transition:border-color .12s ease}",
			".pp2-ta::placeholder{color:var(--dsw-alias-label-tertiary)}",
			".pp2-ta:focus{border-color:var(--dsw-alias-label-tertiary)}",
			".pp2-field{display:flex;flex-direction:column;gap:6px}",
			".pp2-label{font-size:11.5px;color:var(--dsw-alias-label-secondary);display:flex;align-items:center;gap:6px}",
			".pp2-err{display:flex;gap:8px;align-items:flex-start;padding:9px 10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 26%,transparent);border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 6%,transparent);color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:1.55;word-break:break-word}",
			".pp2-err .pp2-i{margin-top:1px}",
			".pp2-note{display:flex;gap:10px;padding:10px 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 2%,transparent)}",
			".pp2-consent{display:flex;align-items:center;gap:8px;padding:7px 8px 7px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 2%,transparent);flex:0 0 auto}",
			".pp2-consent>.pp2-i{color:var(--dsw-alias-label-tertiary)}",
			".pp2-consent-t{margin:0;font-size:12px;line-height:1.4;color:var(--dsw-alias-label-secondary);min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
			".pp2-consent-t b{color:var(--dsw-alias-label-primary);font-weight:600;margin-right:4px}",
			".pp2-note-b{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:8px}",
			".pp2-note p{margin:0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}",
			".pp2-note b{color:var(--dsw-alias-label-primary);font-weight:600}",
			".pp2-src{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 2%,transparent);padding:7px 10px 8px}",
			".pp2-src-h{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--dsw-alias-label-tertiary);margin-bottom:3px}",
			".pp2-src-t{margin:0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word;max-height:3.2em;overflow:hidden}",
			".pp2-src[data-open=\"1\"] .pp2-src-t{max-height:150px;overflow:auto;scrollbar-width:thin}",
			".pp2-cmp{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
			".pp2-col{display:flex;flex-direction:column;min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;overflow:hidden;background:color-mix(in srgb,var(--dsw-alias-label-primary) 2%,transparent)}",
			".pp2-col-h{display:flex;align-items:baseline;gap:6px;padding:6px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);font-size:11px;color:var(--dsw-alias-label-tertiary)}",
			".pp2-col-h b{font-size:11.5px;color:var(--dsw-alias-label-secondary);font-weight:600}",
			".pp2-col-h span{margin-left:auto;flex:0 0 auto}",
			".pp2-col-b{margin:0;padding:8px 10px;font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-secondary);max-height:260px;overflow:auto;scrollbar-width:thin;font-family:inherit;-webkit-mask-image:linear-gradient(to bottom,#000 90%,transparent);mask-image:linear-gradient(to bottom,#000 90%,transparent)}",
			".pp2-col[data-emph=\"1\"] .pp2-col-b{color:var(--dsw-alias-label-primary)}",
			".pp2-csum{display:flex;align-items:flex-start;gap:12px;margin:0;font-size:11.5px;line-height:1.7;color:var(--dsw-alias-label-tertiary)}",
			".pp2-csum-b{flex:1 1 auto;min-width:0;text-wrap:pretty}",
			".pp2-csum-u{flex:0 0 auto;white-space:nowrap;font-variant-numeric:tabular-nums}",
			".pp2-csum b{color:var(--dsw-alias-label-secondary);font-weight:600}",
			".pp2-hist{display:flex;flex-direction:column;gap:2px}",
			".pp2-row{display:flex;align-items:center;gap:8px;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;color:inherit;font-family:inherit;text-align:left;cursor:pointer;min-width:0;transition:background .12s ease}",
			".pp2-row:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".pp2-row[data-on=\"1\"]{background:var(--dsw-alias-interactive-bg-hover)}",
			".pp2-row-t{flex:1 1 auto;min-width:0;font-size:12px;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".pp2-row-m{flex:0 0 auto;font-size:11.5px;color:var(--dsw-alias-label-tertiary)}",
			".pp2-hbody{display:flex;flex-direction:column;gap:8px;padding:2px 8px 10px}",
			".pp2-hblock{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;overflow:hidden}",
			".pp2-hblock-h{padding:5px 9px;border-bottom:1px solid var(--dsw-alias-border-l1);background:color-mix(in srgb,var(--dsw-alias-label-primary) 2%,transparent);font-size:11px;color:var(--dsw-alias-label-tertiary)}",
			".pp2-hblock-b{margin:0;padding:7px 9px;font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-primary);max-height:150px;overflow:auto;scrollbar-width:thin;font-family:inherit}",
			".pp2-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}",
			".pp2-chip{display:inline-flex;align-items:baseline;gap:6px;padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 5%,transparent);font-size:11.5px;color:var(--dsw-alias-label-secondary);max-width:100%}",
			".pp2-chip code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--dsw-alias-label-primary)}",
			".pp2-chip em{font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}",
			".pp2-hrow{display:flex;align-items:center;gap:6px;min-width:0}",
			".pp2-hrow-t{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary)}",
			".pp2-kbd{display:inline-flex;align-items:center;height:16px;padding:0 4px;border:1px solid var(--dsw-alias-border-l2);border-radius:4px;font-size:10px;color:var(--dsw-alias-label-tertiary);line-height:1}",
			"@media (max-width:520px){.pp2-cmp{grid-template-columns:1fr}}",
			"@media (prefers-reduced-motion:reduce){.pp2,.pp2-menu{animation:none}.pp2-caret,.pp2-dot,.pp2-spin{animation:none}}",
		].join("\n");
		function ensureStyle() {
			if (typeof document === "undefined" || document.getElementById(STYLE_ID) !== null) return;
			var tag = document.createElement("style");
			tag.id = STYLE_ID;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region icons.js
		/** 14px line icons, stroke-only, same weight as the app's own icon set. */
		var ICONS = {
			sparkle: [["path", { d: "M12 3.4l1.85 5.05L19 10.3l-5.15 1.85L12 17.2l-1.85-5.05L5 10.3l5.15-1.85L12 3.4z" }], ["path", { d: "M18.6 15.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" }]],
			chevron: [["path", { d: "M6 9.5l6 6 6-6" }]],
			close: [["path", { d: "M6.5 6.5l11 11M17.5 6.5l-11 11" }]],
			clock: [["path", { d: "M12 3.2a8.8 8.8 0 100 17.6 8.8 8.8 0 000-17.6z" }], ["path", { d: "M12 7.4v5l3.1 1.9" }]],
			copy: [["rect", { x: 9, y: 9, width: 10.5, height: 10.5, rx: 2.2 }], ["path", { d: "M15.4 6.2A2.4 2.4 0 0013 4H6.6A2.6 2.6 0 004 6.6V13a2.4 2.4 0 002.2 2.4" }]],
			check: [["path", { d: "M5 12.6l4.2 4.2L19 6.4" }]],
			stop: [["rect", { x: 6.4, y: 6.4, width: 11.2, height: 11.2, rx: 2.4, fill: "currentColor", stroke: "none" }]],
			refresh: [["path", { d: "M19.6 12a7.6 7.6 0 11-2.3-5.4" }], ["path", { d: "M19.8 4.4v4.2h-4.2" }]],
			send: [["path", { d: "M12 19.2V5.2" }], ["path", { d: "M6.4 10.8L12 5.2l5.6 5.6" }]],
			braces: [["path", { d: "M9.4 4.4c-1.9 0-2.9 1-2.9 2.9v2c0 1.1-.8 1.9-1.9 1.9 1.1 0 1.9.8 1.9 1.9v2c0 1.9 1 2.9 2.9 2.9" }], ["path", { d: "M14.6 4.4c1.9 0 2.9 1 2.9 2.9v2c0 1.1.8 1.9 1.9 1.9-1.1 0-1.9.8-1.9 1.9v2c0 1.9-1 2.9-2.9 2.9" }]],
			back: [["path", { d: "M14.5 6l-6 6 6 6" }]],
			compare: [["rect", { x: 3.6, y: 5.4, width: 7, height: 13.2, rx: 1.8 }], ["rect", { x: 13.4, y: 5.4, width: 7, height: 13.2, rx: 1.8 }]],
			alert: [["path", { d: "M12 3.6a8.4 8.4 0 100 16.8 8.4 8.4 0 000-16.8z" }], ["path", { d: "M12 7.8v5" }], ["path", { d: "M12 16.1v.1" }]],
			trash: [["path", { d: "M4.6 7h14.8" }], ["path", { d: "M9.2 7V4.8h5.6V7" }], ["path", { d: "M6.8 7l.9 12.2h8.6L17.2 7" }]],
			arrowRight: [["path", { d: "M5 12h13.4" }], ["path", { d: "M13.4 6.8l5.2 5.2-5.2 5.2" }]],
		};
		function Icon(name, size, extra) {
			var spec = ICONS[name] || ICONS.sparkle;
			var props = {
				className: "pp2-i" + (extra ? " " + extra : ""),
				width: size || 14,
				height: size || 14,
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 1.7,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				focusable: "false"
			};
			return h("svg", props, spec.map(function(entry, index) {
				return h(entry[0], Object.assign({ key: index }, entry[1]));
			}));
		}
		//#endregion
		//#region api.js
		var OPTIMIZE_ROUTE = "/prompt-polish/optimize";
		var MODELS_ROUTE = "/prompt-polish/models";
		var EXTRACT_ROUTE = "/prompt-polish/extract-variables";
		/**
		 * Where the pinned polish model lives. The composer's own model can be an
		 * image model, which cannot answer a text rewrite, so the panel keeps a
		 * choice of its own and empty means "follow the composer".
		 */
		var PIN_KEY = "dsh.prompt-polish/model";
		function readPin() {
			try {
				var raw = localStorage.getItem(PIN_KEY);
				return typeof raw === "string" ? raw : "";
			} catch {
				return "";
			}
		}
		function writePin(value) {
			try {
				if (value === "") localStorage.removeItem(PIN_KEY);
				else localStorage.setItem(PIN_KEY, value);
			} catch {}
		}
		/**
		 * Polish history, v2: a consent-gated, version-chained local record.
		 *
		 * The envelope is `{ schemaVersion, consent, entries }`. consent gates
		 * persistence: "unknown" saves nothing and raises the consent card after
		 * the first successful run; "granted" persists; "declined" persists
		 * nothing and wipes what was there. Entries form chains — an iterate run
		 * points at the version it revised via parentId/rootId — so 对比 and
		 * 删除整条链 operate on something honest. A legacy bare-array store (the
		 * first shipped format) migrates to consent:"granted" with normalized
		 * entries, preserving what the user already had. Any storage failure
		 * degrades to no-persistence rather than breaking a run.
		 */
		var HISTORY_KEY = "dsh.prompt-polish/history";
		var HISTORY_SCHEMA = 2;
		var HISTORY_MAX = 50;
		var HISTORY_CLIP = 4000;
		function clip(text) {
			if (typeof text !== "string") return "";
			return text.length > HISTORY_CLIP ? text.slice(0, HISTORY_CLIP) + "…" : text;
		}
		function emptyHistoryStore() {
			return { schemaVersion: HISTORY_SCHEMA, consent: "unknown", entries: [] };
		}
		/** Timestamps collide; the random tail keeps entry ids unique. */
		function newEntryId() {
			return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
		}
		/** Fill in fields older formats lack, so views never branch on shape. */
		function normalizeEntry(entry) {
			var e = entry && typeof entry === "object" ? entry : {};
			var id = typeof e.id === "string" && e.id !== "" ? e.id : String(e.id === void 0 || e.id === null ? newEntryId() : e.id);
			return {
				id: id,
				rootId: typeof e.rootId === "string" && e.rootId !== "" ? e.rootId : id,
				parentId: typeof e.parentId === "string" ? e.parentId : null,
				at: typeof e.at === "number" ? e.at : typeof e.id === "number" ? e.id : Date.now(),
				mode: typeof e.mode === "string" ? e.mode : "",
				template: typeof e.template === "string" ? e.template : "",
				templateId: typeof e.templateId === "string" ? e.templateId : "",
				model: typeof e.model === "string" ? e.model : "",
				input: typeof e.input === "string" ? e.input : "",
				output: typeof e.output === "string" ? e.output : "",
				usage: e.usage && typeof e.usage === "object" ? e.usage : void 0,
				elapsedMs: typeof e.elapsedMs === "number" ? e.elapsedMs : 0,
				source: typeof e.source === "string" ? e.source : "run"
			};
		}
		function readHistoryStore() {
			try {
				var raw = localStorage.getItem(HISTORY_KEY);
				if (typeof raw !== "string" || raw === "") return emptyHistoryStore();
				var parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					return { schemaVersion: HISTORY_SCHEMA, consent: "granted", entries: parsed.map(normalizeEntry) };
				}
				if (parsed === null || typeof parsed !== "object") return emptyHistoryStore();
				return {
					schemaVersion: HISTORY_SCHEMA,
					consent: parsed.consent === "granted" || parsed.consent === "declined" ? parsed.consent : "unknown",
					entries: Array.isArray(parsed.entries) ? parsed.entries.map(normalizeEntry) : []
				};
			} catch {
				return emptyHistoryStore();
			}
		}
		function writeHistoryStore(store) {
			try {
				localStorage.setItem(HISTORY_KEY, JSON.stringify(store));
			} catch {}
		}
		/**
		 * Over-capacity prune: drop whole oldest chains first (the newest chain is
		 * never dropped wholesale), then trim tail entries one by one, re-parenting
		 * their children so every surviving chain stays walkable.
		 */
		function pruneEntries(entries) {
			if (entries.length <= HISTORY_MAX) return entries;
			var roots = [];
			var seen = {};
			for (var i = 0; i < entries.length; i++) {
				var r = entries[i].rootId || entries[i].id;
				if (!seen[r]) {
					seen[r] = true;
					roots.push(r);
				}
			}
			var dropped = {};
			var remaining = entries.length;
			for (var k = roots.length - 1; k >= 1 && remaining > HISTORY_MAX; k--) {
				var size = 0;
				for (var i2 = 0; i2 < entries.length; i2++) if ((entries[i2].rootId || entries[i2].id) === roots[k]) size++;
				remaining -= size;
				dropped[roots[k]] = true;
			}
			var result = [];
			for (var i3 = 0; i3 < entries.length; i3++) {
				if (!dropped[entries[i3].rootId || entries[i3].id]) result.push(entries[i3]);
			}
			while (result.length > HISTORY_MAX) {
				var oldest = result.pop();
				for (var j = 0; j < result.length; j++) {
					if (result[j].parentId === oldest.id) {
						result[j].parentId = oldest.parentId || null;
						if (result[j].parentId === null) result[j].rootId = result[j].id;
					}
				}
			}
			return result;
		}
		function appendEntry(store, entry) {
			return {
				schemaVersion: HISTORY_SCHEMA,
				consent: store.consent,
				entries: pruneEntries([entry].concat(store.entries))
			};
		}
		/** Remove one version; its children splice up to the removed node's parent. */
		function dropEntry(entries, id) {
			var removed = null;
			var next = [];
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].id === id) removed = entries[i];
				else next.push(entries[i]);
			}
			if (removed === null) return entries;
			for (var j = 0; j < next.length; j++) {
				if (next[j].parentId === id) {
					next[j].parentId = removed.parentId;
					if (next[j].parentId === null) next[j].rootId = next[j].id;
				}
			}
			return next;
		}
		function dropChain(entries, rootId) {
			return entries.filter(function(entry) {
				return entry.rootId !== rootId;
			});
		}
		/** One chain, oldest first: 原稿 → 每一次润色. */
		function chainOf(entries, rootId) {
			var chain = [];
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].rootId === rootId) chain.push(entries[i]);
			}
			return chain.reverse();
		}
		/** Short "812 → 430 tok" sentence; empty when the provider reported none. */
		function usageShort(usage) {
			if (usage && typeof usage.inputTokens === "number" && typeof usage.outputTokens === "number") return usage.inputTokens + " → " + usage.outputTokens + " tok";
			return "";
		}
		/** Token sentence used by 对比's chain summary; honest when some runs lack usage. */
		//#region i18n
		/**
		 * Follow the harness, not a hard-coded locale: DSH writes its language into
		 * <html lang>, so the panel speaks whatever the surrounding chrome speaks.
		 * Anything that is not English keeps the Chinese copy, which is the plugin's
		 * primary audience.
		 */
		/** Harness locale lives on `<html lang>`; navigator is only a fallback. */
		function detectEN() {
			var lang = typeof document !== "undefined" && document.documentElement ? String(document.documentElement.lang || "") : "";
			if (lang === "" && typeof navigator !== "undefined") lang = String(navigator.language || "");
			return /^en(\b|-)/i.test(lang);
		}
		var EN = detectEN();
		var DICT = {
		"不保存": "Not now",
		"两段文字完全一样。": "Both texts are identical.",
		"仍用屏幕上这版结果写回输入框": "Write the result on screen back anyway",
		"优化中": "Polishing",
		"优化失败": "Polish failed",
		"优化对象": "What to polish",
		"优化输入框里的提示词（打开面板，不改动草稿）": "Polish the composer prompt — opens the panel, leaves the draft alone",
		"位置对不上，无法套用": "Offsets don't match — can't apply",
		"使用哪个优化模板": "Template to use",
		"例如：再简短一些，补一个输出示例，语气面向新手……": "e.g. shorter, add an output example, friendlier tone…",
		"保存": "Save",
		"保存润色历史？": "Keep a polish history?",
		"停止": "Stop",
		"停止本次生成（已生成的部分会保留）": "Stop this run; what's already generated stays",
		"先写一句改进意见": "Describe the change first",
		"先在输入框里写一句需求，打开就会自动优化。": "Type a request in the composer — this opens with the polish already running.",
		"关闭（Esc）": "Close (Esc)",
		"内容已经比较完整": "Already fairly complete",
		"内容较短": "The text is short",
		"再请求一次": "Ask again",
		"写回": "Write back",
		"写回后仍可继续编辑": "You can keep editing after writing back",
		"写回模板": "Write back",
		"刚换了模板，屏幕上还是上一版结果": "Template changed — this result is from the previous one",
		"删除这一条": "Delete this entry",
		"历史记录已关闭，本机没有保存任何润色内容。": "History is off; nothing is stored on this machine.",
		"原稿": "Original",
		"发送": "Send",
		"取消": "Cancel",
		"取消（Esc）": "Cancel (Esc)",
		"只在浏览器本地保存输入、结果和用量，不上传、不发往服务器。": "Kept in this browser only: input, result, usage. Never uploaded.",
		"只存在本机，不上传。": "Stored on this machine only.",
		"只存在这台机器上，不上传。想清空随时可以。": "Stored on this machine only. Clear it whenever you like.",
		"只改输入框里的草稿，满意了再手动发送。": "Only the composer draft changes — send when you're happy.",
		"可参数化片段": "Parameterisable spans",
		"在输入框写点内容，这里会自动润色": "Type in the composer — polish runs automatically",
		"复制": "Copy",
		"复制到剪贴板失败，请手动选中结果文本复制。": "Couldn't reach the clipboard — select the result and copy it manually.",
		"复制结果": "Copy result",
		"复制结果到剪贴板（不改动输入框）": "Copy the result; the composer is untouched",
		"对比版本": "Compare versions",
		"展开": "Expand",
		"展开原稿": "Expand original",
		"展开看这次润色的输入、结果和用量": "Show this run's input, result and usage",
		"已复制": "Copied",
		"已替换": "Replaced",
		"开启历史": "Turn history on",
		"开始迭代": "Iterate",
		"恢复替换前的草稿": "Restore the draft from before the replace",
		"找出可以参数化的片段（另一次模型调用）": "Find spans worth parameterising (one more model call)",
		"把当前结果写回输入框，不发送": "Write this result back, don't send",
		"把片段替换成 {{变量}} 占位并写回输入框，不发送": "Replace the spans with {{variables}} and write back; no send",
		"把结果写回输入框并直接发送": "Write back and send",
		"把结果写回输入框，不发送": "Write back, don't send",
		"把草稿改写成更清晰的提示词": "Rewrite the draft into a clearer prompt",
		"把这条结果写回输入框（不发送）": "Write this result back (no send)",
		"按改进意见再润色一版（⌘↵）": "Polish again with your notes (⌘↵)",
		"提示词优化": "Prompt polish",
		"撤销": "Undo",
		"收起": "Collapse",
		"收起原稿": "Collapse original",
		"替换后 9 秒内可撤销": "Undo stays available for 9 seconds",
		"替换草稿": "Replace draft",
		"查看历史记录": "Open history",
		"模型没有返回可用内容。": "The model returned nothing usable.",
		"模型给出的位置对不上原文，无法套成模板。": "The model's offsets don't line up with the text, so no template.",
		"模板": "Template",
		"模板已切换": "Template changed",
		"模板目录还没载入": "The template list is still loading",
		"模板目录还没载入，请稍后重试。": "The template catalogue is still loading — try again in a moment.",
		"正在准备…": "Getting ready…",
		"正在生成…": "Generating…",
		"每完成一次润色，这里会存一条：当时的输入、结果和用量，重启后也还在。": "Each polish adds one entry: input, result, usage — kept across restarts.",
		"没有明确的动作要求": "No clear action",
		"没有说清输出形式": "Output shape unspecified",
		"润色": "Polish",
		"润色历史": "Polish history",
		"润色用哪个模型（默认跟随输入框）": "Model for polish (defaults to the composer's)",
		"润色结果": "Result",
		"清空": "Clear",
		"清空所有记录（授权状态不变）": "Clear every entry; authorisation stays as is",
		"版本对比": "Compare versions",
		"生成中": "Generating",
		"生成中…": "Generating…",
		"用刚选的模板重新优化（⌘↵）": "Re-polish with the template you just picked (⌘↵)",
		"用新模板重跑": "Run with new template",
		"用量未提供": "No usage reported",
		"目标/动作": "goal",
		"确认替换草稿": "Replace the draft?",
		"约束": "constraints",
		"结构变化（本机分析）": "Structural change (local check)",
		"结果": "Result",
		"缺少背景或对象": "Missing context",
		"背景": "context",
		"草稿已更新": "Draft updated",
		"要不要留着润色记录？": "Keep a polish history?",
		"要求比较模糊": "Vague request",
		"跟随当前": "Follow current",
		"跟随当前模型": "Follow current model",
		"载入中…": "Loading…",
		"输入框还是空的": "The composer is empty",
		"输入框里的内容已经变了，按 ⌘↵ 用新内容重新生成": "The draft changed — press ⌘↵ to regenerate",
		"输入框里还没有内容": "The composer is empty",
		"输入框里还没有内容可润色。": "There's nothing in the composer yet.",
		"输出格式": "output format",
		"返回优化": "Back to polish",
		"返回历史": "Back to history",
		"还没有结果，这次会把输入框里的内容当作底稿。": "No result yet — this run uses the composer as the base.",
		"还没有记录": "No entries yet",
		"这一版想怎么改？": "What should change?",
		"迭代优化要先填改进意见。": "Write what to change before iterating.",
		"重试": "Retry",
		"（空）": "(empty)",
		"适合：": "Best for: ",
		"基础": "Basics",
		"结构": "Structure",
		"示范": "Examples",
		"推理": "Reasoning",
		"迭代": "Iteration",
		"适用：": "Use when: ",
		"优点：": "Why: ",
		"本次用量未提供": "No usage reported",
		"刚刚": "just now"
		};
		function T(text) {
			return EN ? DICT[text] || text : text;
		}
		/** Host entries carry `label`/`labelEn` (and friends); pick the live one. */
		function pick(entry, base) {
			if (entry === null || entry === void 0) return "";
			var en = entry[base + "En"];
			return EN && typeof en === "string" && en !== "" ? en : entry[base] || "";
		}
		function charsLabel(n) {
			return EN ? n + (n === 1 ? " char" : " chars") : n + " 字";
		}
		function countLabel(n) {
			return EN ? n + (n === 1 ? " entry" : " entries") : "共 " + n + " 条";
		}
		function chainLabel(n) {
			return EN ? n + (n === 1 ? " version" : " versions") + " in this chain" : "这条链有 " + n + " 个版本";
		}
		function gapLabel(n) {
			return EN ? "… " + n + " unchanged lines" : "… 省略 " + n + " 行未改动";
		}
		function failureLabel(status) {
			return EN ? "Request failed (HTTP " + status + ")" : "请求失败（HTTP " + status + "）";
		}
		function extractFailureLabel(status) {
			return EN ? "Extraction failed (HTTP " + status + ")" : "提取失败（HTTP " + status + "）";
		}
		/** The local structure read-out under the compare view. */
		function analysisTail(a) {
			var join = EN ? ", " : "、";
			if (EN) {
				return ": +" + a.addedLines + " / −" + a.removedLines + " lines" + (a.approximate ? " (estimated by line for long text)" : "") + "." + (a.gained.length > 0 ? " Added " + a.gained.map(T).join(join) + "." : "") + (a.lost.length > 0 ? " Dropped " + a.lost.map(T).join(join) + "." : "") + (a.gained.length === 0 && a.lost.length === 0 ? " Goal, context, constraints and output format are unchanged." : "");
			}
			return "：新增 " + a.addedLines + " 行、删除 " + a.removedLines + " 行" + (a.approximate ? "（超长文本按行估算）" : "") + "。" + (a.gained.length > 0 ? " 补上了 " + a.gained.join(join) + "。" : "") + (a.lost.length > 0 ? " 丢了 " + a.lost.join(join) + "。" : "") + (a.gained.length === 0 && a.lost.length === 0 ? " 目标/背景/约束/输出格式 的覆盖没有变化。" : "");
		}
		//#endregion
		function usageText(usage) {
			if (usage && typeof usage.inputTokens === "number" && typeof usage.outputTokens === "number") {
				var total = typeof usage.totalTokens === "number" ? usage.totalTokens : usage.inputTokens + usage.outputTokens;
				return EN ? usage.inputTokens + " in + " + usage.outputTokens + " out = " + total + " tokens" : "本次 " + usage.inputTokens + " 输入 + " + usage.outputTokens + " 输出 = " + total + " tokens";
			}
			return T("本次用量未提供");
		}
		/** Relative stamp: 刚刚 / 12 分钟前 / 14:03 / 昨天 09:12 / 11月8日. */
		function relTime(ms) {
			var diff = Date.now() - ms;
			if (!(diff >= 0)) return "";
			if (diff < 60000) return T("刚刚");
			if (diff < 3600000) {
				var mins = Math.floor(diff / 60000);
				return EN ? mins + " min ago" : mins + " 分钟前";
			}
			var d = new Date(ms);
			var pad = function(n) {
				return (n < 10 ? "0" : "") + n;
			};
			var hm = pad(d.getHours()) + ":" + pad(d.getMinutes());
			var now = new Date();
			if (d.toDateString() === now.toDateString()) return hm;
			if (d.toDateString() === new Date(now.getTime() - 86400000).toDateString()) return EN ? "Yesterday " + hm : "昨天 " + hm;
			if (EN) return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()] + " " + d.getDate();
			return d.getMonth() + 1 + "月" + d.getDate() + "日";
		}
		/**
		 * 智能火苗的判分：纯本地、纯字符串，绝不调用模型。
		 *
		 * Kept exported for the contract test even though the seat no longer draws
		 * a flame: the score is still the honest local answer to "this draft looks
		 * under-specified", and a future hint can use it without a model call.
		 */
		var HINT_INTENT = /帮我|请|给我|写一|写个|做个|来一|生成|翻译|总结|分析|优化|起草|列出|设计|实现|检查|改写|润色|回答|解释|评估|编写|拟/;
		var HINT_OUTPUT = /格式|表格|列表|要点|步骤|json|JSON|Markdown|markdown|字数|字以内|字左右|正式|口语|风格|结构|分点|大纲|一段|一篇|条理/;
		var HINT_CONTEXT = /背景|目标|因为|由于|需要|用途|场景|对象|受众|上周|本周|今天|明天|昨天|项目|公司|客户|领导|老师|数据|主题|题目|时间/;
		var HINT_VAGUE = /随便|简单写|大概|看看|试试|优化一下|来一个|帮我写个|写个.{0,6}就行/;
		function scoreDraft(text) {
			var raw = typeof text === "string" ? text : "";
			if (raw.trim() === "") return { level: "quiet", score: 0, reasons: [] };
			var compact = raw.replace(/\s+/g, "");
			var score = 0;
			var reasons = [];
			if (compact.length < 80) {
				score += 2;
				reasons.push(T("内容较短"));
			}
			if (!HINT_INTENT.test(raw)) {
				score += 1;
				reasons.push(T("没有明确的动作要求"));
			}
			if (!HINT_OUTPUT.test(raw)) {
				score += 1;
				reasons.push(T("没有说清输出形式"));
			}
			if (!HINT_CONTEXT.test(raw)) {
				score += 1;
				reasons.push(T("缺少背景或对象"));
			}
			if (HINT_VAGUE.test(raw)) {
				score += 2;
				reasons.push(T("要求比较模糊"));
			}
			if (compact.length > 600) {
				score -= 3;
				reasons.push(T("内容已经比较完整"));
			}
			var level = score >= 4 ? "burn" : score >= 2 ? "ember" : "quiet";
			return { level: level, score: score, reasons: reasons };
		}
		/**
		 * 结构变化：确定性的前后对照，行级 LCS 加上“目标/背景/约束/输出格式”
		 * 四个角色标记的有无——全部本地计算，展示为“本机分析”，绝不冒充模型判断。
		 */
		var DIFF_LINE_CAP = 400;
		function splitLines(text) {
			var t = String(text === void 0 || text === null ? "" : text).replace(/\r\n?/g, "\n").replace(/\s+$/, "");
			return t === "" ? [] : t.split("\n");
		}
		function lineDiffCounts(a, b) {
			if (a.length > DIFF_LINE_CAP || b.length > DIFF_LINE_CAP) {
				return { added: Math.max(0, b.length - a.length), removed: Math.max(0, a.length - b.length), approximate: true };
			}
			var n = a.length;
			var m = b.length;
			var width = m + 1;
			var table = new Int32Array((n + 1) * width);
			for (var i = n - 1; i >= 0; i--) {
				var row = i * width;
				var below = row + width;
				for (var j = m - 1; j >= 0; j--) {
					table[row + j] = a[i] === b[j] ? table[below + j + 1] + 1 : Math.max(table[below + j], table[row + j + 1]);
				}
			}
			var common = 0;
			var x = 0;
			var y = 0;
			while (x < n && y < m) {
				if (a[x] === b[y]) {
					common++;
					x++;
					y++;
				} else if (table[(x + 1) * width + y] >= table[x * width + y + 1]) {
					x++;
				} else {
					y++;
				}
			}
			return { added: m - common, removed: n - common, approximate: false };
		}
		var STRUCT_ROLES = [
			["goal", T("目标/动作"), /帮我|请|给我|目标是|需要你|你要|任务|帮我做/],
			["context", T("背景"), /背景|上下文|因为|由于|对象|受众|场景|用途|上周|本周|今天|数据|项目/],
			["constraints", T("约束"), /不要|不能|必须|限制|不超过|至少|避免|禁止|只能|仅限/],
			["format", T("输出格式"), /格式|表格|列表|要点|步骤|json|JSON|Markdown|markdown|字数|分点|大纲|一段|正式|口语/]
		];
		function analyzeChange(before, after) {
			var a = splitLines(before);
			var b = splitLines(after);
			var counts = lineDiffCounts(a, b);
			var beforeText = typeof before === "string" ? before : "";
			var afterText = typeof after === "string" ? after : "";
			var gained = [];
			var lost = [];
			for (var i = 0; i < STRUCT_ROLES.length; i++) {
				var role = STRUCT_ROLES[i];
				var had = role[2].test(beforeText);
				var has = role[2].test(afterText);
				if (!had && has) gained.push(role[1]);
				else if (had && !has) lost.push(role[1]);
			}
			return {
				beforeChars: beforeText.replace(/\s+/g, "").length,
				afterChars: afterText.replace(/\s+/g, "").length,
				addedLines: counts.added,
				removedLines: counts.removed,
				approximate: counts.approximate,
				gained: gained,
				lost: lost
			};
		}
		function compactChars(text) {
			return String(text === void 0 || text === null ? "" : text).replace(/\s+/g, "").length;
		}
		/**
		 * Ask the host half which models the panel may pin.
		 * @returns the current selection plus provider-grouped models.
		 */
		async function fetchModels() {
			var response = await fetch(MODELS_ROUTE, {
				method: "GET",
				credentials: "same-origin"
			});
			if (!response.ok) throw new Error("HTTP " + response.status);
			return await response.json();
		}
		/**
		 * Module-level catalog cache with a short TTL + in-flight dedup.
		 *
		 * Every composer mount used to re-fetch `/models`, so switching sessions
		 * re-paid the round trip even though the template half of the answer never
		 * changes within a run. 30s keeps the model half fresh enough for a
		 * mid-session provider addition while making re-mounts instant, and the
		 * shared promise stops two composers mounting at once from firing twice.
		 * Failures are NOT cached: the next mount retries.
		 */
		var CATALOG_TTL_MS = 30000;
		var catalogCache = null;
		var catalogInflight = null;
		function loadCatalog() {
			if (catalogCache !== null && Date.now() - catalogCache.at < CATALOG_TTL_MS) return Promise.resolve(catalogCache.data);
			if (catalogInflight === null) {
				catalogInflight = fetchModels().then(function(data) {
					catalogCache = {
						at: Date.now(),
						data
					};
					catalogInflight = null;
					return data;
				}, function(cause) {
					catalogInflight = null;
					throw cause;
				});
			}
			return catalogInflight;
		}
		/**
		 * Stream one optimization from the host half.
		 *
		 * `sessionId` is not optional cosmetics: OpenCode-backed routes require the
		 * `x-opencode-session` header, and the pi-ai adapter only adds it when
		 * `GenerateOptions.sessionId` is set. Sending the composer's session id is
		 * what makes the same plugin work against every provider.
		 * @param body - the request payload.
		 * @param onDelta - called per received text delta.
		 * @param signal - aborts the run.
		 * @returns the final text and the model that produced it.
		 */
		async function stream(body, onDelta, signal) {
			var response = await fetch(OPTIMIZE_ROUTE, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
				credentials: "same-origin",
				signal
			});
			if (!response.ok) {
				var detail = "";
				var raw = "";
				try {
					raw = await response.text();
				} catch (ignored) {}
				try {
					var failure = JSON.parse(raw);
					detail = typeof failure.message === "string" ? failure.message : typeof failure.error === "string" ? failure.error : failure !== null && typeof failure.error === "object" && failure.error !== null && typeof failure.error.message === "string" ? failure.error.message : "";
				} catch (ignored) {
					detail = raw.trim().slice(0, 300);
				}
				throw new Error(detail !== "" ? detail : failureLabel(response.status));
			}
			var reader = response.body.getReader();
			var decoder = new TextDecoder();
			var buffer = "";
			var finalText = "";
			var model = "";
			var usage = null;
			while (true) {
				var _ref = await reader.read(), done = _ref.done, value = _ref.value;
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				var lines = buffer.split("\n");
				buffer = lines.pop() ?? "";
				for (var _i = 0, _lines = lines; _i < _lines.length; _i++) {
					var line = _lines[_i];
					if (line.trim() === "") continue;
					var event = void 0;
					try {
						event = JSON.parse(line);
					} catch {
						continue;
					}
					if (event.type === "delta") {
						finalText += event.text;
						onDelta(event.text);
					} else if (event.type === "error") {
						throw new Error(event.message || T("优化失败"));
					} else if (event.type === "done") {
						finalText = event.text;
						model = event.model || "";
						usage = event.usage && typeof event.usage === "object" ? event.usage : null;
					}
				}
			}
			if (finalText.trim() === "") throw new Error(T("模型没有返回可用内容。"));
			return {
				text: finalText,
				model,
				usage
			};
		}
		/**
		 * One non-streaming call: ask the host to find the parameterisable spans in a
		 * finished prompt. The host answers with the parsed list AND the templated
		 * text, because substituting the spans needs the occurrence arithmetic that
		 * lives server-side; a wrong offset there would silently rewrite the prompt.
		 * @param promptContent - the text to analyse.
		 * @param pin - optional `{ provider, model }` override.
		 * @param signal - aborts the request.
		 * @returns `{ variables, summary, templated, model }`.
		 */
		async function extractVariables(promptContent, pin, sessionId, signal) {
			var body = { promptContent };
			if (pin !== null) {
				body.provider = pin.provider;
				body.model = pin.model;
			}
			if (typeof sessionId === "string" && sessionId !== "") body.sessionId = sessionId;
			var response = await fetch(EXTRACT_ROUTE, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
				credentials: "same-origin",
				signal
			});
			var payload = void 0;
			try {
				payload = await response.json();
			} catch {}
			if (!response.ok) {
				var detail = payload && typeof payload.message === "string" ? payload.message : "";
				throw new Error(detail !== "" ? detail : extractFailureLabel(response.status));
			}
			return payload;
		}
		//#endregion
		/**
		 * Line diff for the replace review: LCS over lines, collapsed to context
		 * lines so a long prompt still reads like a patch. Local and synchronous —
		 * no model call, no dependency.
		 */
		function diffLines(before, after) {
			var a = String(before).split("\n");
			var b = String(after).split("\n");
			if (a.length * b.length > 400000) {
				return a.map(function(line) { return { t: "del", s: line }; }).concat(b.map(function(line) { return { t: "add", s: line }; }));
			}
			var width = b.length + 1;
			var dp = new Array((a.length + 1) * width).fill(0);
			for (var i = a.length - 1; i >= 0; i--) for (var j = b.length - 1; j >= 0; j--) {
				dp[i * width + j] = a[i] === b[j] ? dp[(i + 1) * width + j + 1] + 1 : Math.max(dp[(i + 1) * width + j], dp[i * width + j + 1]);
			}
			var rows = [];
			var x = 0;
			var y = 0;
			while (x < a.length && y < b.length) {
				if (a[x] === b[y]) { rows.push({ t: "same", s: a[x] }); x++; y++; }
				else if (dp[(x + 1) * width + y] >= dp[x * width + y + 1]) { rows.push({ t: "del", s: a[x] }); x++; }
				else { rows.push({ t: "add", s: b[y] }); y++; }
			}
			while (x < a.length) rows.push({ t: "del", s: a[x++] });
			while (y < b.length) rows.push({ t: "add", s: b[y++] });
			return rows;
		}
		function collapseDiff(rows, context) {
			var keep = new Array(rows.length).fill(false);
			rows.forEach(function(row, index) {
				if (row.t === "same") return;
				var from = Math.max(0, index - context);
				var to = Math.min(rows.length - 1, index + context);
				for (var k = from; k <= to; k++) keep[k] = true;
			});
			var out = [];
			var skipped = 0;
			rows.forEach(function(row, index) {
				if (keep[index]) {
					if (skipped > 0) { out.push({ t: "gap", s: gapLabel(skipped) }); skipped = 0; }
					out.push(row);
				} else skipped++;
			});
			if (skipped > 0) out.push({ t: "gap", s: gapLabel(skipped) });
			return out;
		}
		//#region view.js
		/**
		 * The composer seat beside the model selector, and the panel it opens.
		 *
		 * Interaction model, deliberately plain:
		 *   seat click  → open the panel and stop there (no hidden model call);
		 *   primary CTA → one run, streamed into the result card;
		 *   result      → 替换草稿 writes the draft back, 发送 writes and sends,
		 *                 copy/extract/compare live on the card itself;
		 *   history     → its own view inside the same panel, no second window.
		 *
		 * Reads and writes the draft through the slot's own session props, so the
		 * button always acts on the composer it is rendered in — including a
		 * subagent composer — without holding a session id of its own. The session
		 * id *is* read from those props, for the provider routing header only.
		 * @param props - the session slot props (`useInput`, `inputActions`, `sessionId`).
		 */
		function PromptPolish(props) {
			ensureStyle();
			var useInput = props.useInput;
			var inputActions = props.inputActions;
			var sessionId = typeof props.sessionId === "string" ? props.sessionId : "";
			var draft = typeof useInput === "function" ? useInput(function(state) {
				return state.draft;
			}) : "";
			var draftRef = useRef(draft);
			draftRef.current = draft;
			var _s1 = useState(false), open = _s1[0], setOpen = _s1[1];
			/** run | history | compare — one panel, three bodies. */
			var _s2 = useState("run"), view = _s2[0], setView = _s2[1];
			var _s3 = useState("user"), mode = _s3[0], setMode = _s3[1];
			var _s4 = useState(""), templateId = _s4[0], setTemplateId = _s4[1];
			var _s5 = useState(""), feedback = _s5[0], setFeedback = _s5[1];
			var _s6 = useState(""), result = _s6[0], setResult = _s6[1];
			var _s7 = useState("idle"), status = _s7[0], setStatus = _s7[1];
			var _s8 = useState(""), error = _s8[0], setError = _s8[1];
			var _s9 = useState(""), modelUsed = _s9[0], setModelUsed = _s9[1];
			var _s10 = useState(null), anchor = _s10[0], setAnchor = _s10[1];
			var _s11 = useState(readPin), pin = _s11[0], setPin = _s11[1];
			var _s12 = useState(null), catalog = _s12[0], setCatalog = _s12[1];
			var _s13 = useState(null), vars = _s13[0], setVars = _s13[1];
			var _s14 = useState(false), extracting = _s14[0], setExtracting = _s14[1];
			var _s15 = useState(null), usage = _s15[0], setUsage = _s15[1];
			var _s16 = useState(0), elapsedMs = _s16[0], setElapsedMs = _s16[1];
			var _s17 = useState(""), copied = _s17[0], setCopied = _s17[1];
			/** "done" for a beat after 替换草稿 / 发送, so the seat confirms it. */
			var _s18 = useState(""), flash = _s18[0], setFlash = _s18[1];
			/** Open menu id ("template" | "model" | ""), one at a time. */
			var _s19 = useState(""), menu = _s19[0], setMenu = _s19[1];
			var _s20a = useState(false), menuUp = _s20a[0], setMenuUp = _s20a[1];
			var _s20 = useState(""), openId = _s20[0], setOpenId = _s20[1];
			var _s21 = useState(readHistoryStore), store = _s21[0], setStore = _s21[1];
			/** The run waiting on the consent decision; lives in memory only. */
			var pendingRef = useRef(null);
			var _s22 = useState(""), rootId = _s22[0], setRootId = _s22[1];
			var _s23 = useState(""), cmpId = _s23[0], setCmpId = _s23[1];
			var _s24 = useState(false), srcOpen = _s24[0], setSrcOpen = _s24[1];
			var _s25 = useState(false), consentOpen = _s25[0], setConsentOpen = _s25[1];
			/** The text this result was generated from — drives the T("草稿已更新") hint. */
			var _s26 = useState(""), usedSource = _s26[0], setUsedSource = _s26[1];
			/** Review sheet: shown before a result overwrites the composer draft. */
			var _s27 = useState(false), review = _s27[0], setReview = _s27[1];
			/** Text to restore from the seat's undo affordance. */
			var _s28 = useState(""), undoText = _s28[0], setUndoText = _s28[1];
			/** Template the visible result was produced with, for "pending" state. */
			var _s29 = useState(""), usedTemplate = _s29[0], setUsedTemplate = _s29[1];
			var seatRef = useRef(null);
			var panelRef = useRef(null);
			var primaryRef = useRef(null);
			var abortRef = useRef(null);
			var varsRef = useRef(null);
			var extractRef = useRef(null);
			var timersRef = useRef([]);
			/** Which (mode, template) pair already spent its automatic call. */
			var autoSigRef = useRef("");
			/** The exact (mode, template, text) a finished result belongs to. */
			var lastSigRef = useRef("");
			var feedbackRef = useRef(null);
			var undoSeqRef = useRef(0);
			var busy = status === "running";
			function later(fn, ms) {
				var id = setTimeout(function() {
					timersRef.current = timersRef.current.filter(function(entry) {
						return entry !== id;
					});
					fn();
				}, ms);
				timersRef.current.push(id);
				return id;
			}
			/** Follow a locale switch without a page reload. */
			var _s30 = useState(0), langTick = _s30[0], setLangTick = _s30[1];
			useEffect(function() {
				if (typeof MutationObserver === "undefined") return;
				var observer = new MutationObserver(function() {
					var next = detectEN();
					if (next === EN) return;
					EN = next;
					setLangTick(function(n) {
						return n + 1;
					});
				});
				observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
				return function() {
					observer.disconnect();
				};
			}, []);
			/** Split "provider/model" into the pair the host half expects. */
			var pinned = useMemo(function() {
				var at = pin.indexOf("/");
				if (pin === "" || at <= 0) return null;
				return {
					provider: pin.slice(0, at),
					model: pin.slice(at + 1)
				};
			}, [pin]);
			/** Load the picker once per session; a failure just leaves it empty. */
			useEffect(function() {
				if (catalog !== null) return;
				var cancelled = false;
				loadCatalog().then(function(data) {
					if (!cancelled) setCatalog(data);
				}, function() {
					if (!cancelled) setCatalog({
						current: null,
						groups: [],
						modes: [],
						templates: [],
						defaults: {}
					});
				});
				return function() {
					cancelled = true;
				};
			}, [catalog]);
			useEffect(function() {
				/**
				 * Extraction lands below a tall result card, so bring it into view
				 * instead of leaving the reader to discover the scroll.
				 */
				if (vars !== null && varsRef.current !== null && varsRef.current.scrollIntoView) {
					varsRef.current.scrollIntoView({ block: "nearest" });
				}
			}, [vars]);
			/** Templates the server offers for the selected `optimizationMode`. */
			var family = useMemo(function() {
				var list = catalog === null || catalog.templates === void 0 ? [] : catalog.templates;
				return list.filter(function(entry) {
					return entry.optimizationMode === mode;
				});
			}, [catalog, mode]);
			/** Falls back to the family's first entry so a stale id never blocks a run. */
			var template = useMemo(function() {
				for (var i = 0; i < family.length; i++) {
					if (family[i].id === templateId) return family[i];
				}
				return family.length > 0 ? family[0] : null;
			}, [family, templateId]);
			/** The text a run should optimize: the draft, or the last result when iterating. */
			var sourceFor = useCallback(function(nextMode) {
				if (nextMode === "iterate" && result !== "") return result;
				return draftRef.current ?? "";
			}, [result]);
			/**
			 * Anchor the panel above the composer, right-aligned to the seat. Wider
			 * viewports get the full 520px; narrow ones clamp to the viewport, and
			 * `bottom` keeps it glued to the composer as the input grows.
			 */
			var place = useCallback(function() {
				var seat = seatRef.current;
				if (seat === null) return;
				var box = seat.getBoundingClientRect();
				var width = Math.min(520, window.innerWidth - 24);
				var left = Math.min(Math.max(12, box.right - width), window.innerWidth - width - 12);
				/**
				 * The panel grows upward from the composer, so its height budget is
				 * whatever sits above the seat — not a fixed 72vh, which would clip
				 * the header off the top of the window on a low composer.
				 */
				var room = box.top - 24;
				setAnchor({
					left,
					width,
					bottom: Math.max(12, window.innerHeight - box.top + 8),
					maxHeight: Math.max(240, Math.min(window.innerHeight * 0.72, room))
				});
			}, []);
			var close = useCallback(function() {
				setOpen(false);
				setMenu("");
				autoSigRef.current = "";
			}, []);
			/** Close on Esc / click outside; re-anchor on resize and scroll. */
			useEffect(function() {
				if (!open) return;
				place();
				var onMove = function() {
					place();
				};
				var onKey = function(event) {
					if (event.key === "Escape") {
						if (menu !== "") setMenu("");
						else close();
					}
				};
				var onDown = function(event) {
					var target = event.target;
					if (panelRef.current !== null && panelRef.current.contains(target)) return;
					if (seatRef.current !== null && seatRef.current.contains(target)) return;
					close();
				};
				window.addEventListener("resize", onMove);
				window.addEventListener("scroll", onMove, true);
				window.addEventListener("keydown", onKey);
				window.addEventListener("mousedown", onDown, true);
				return function() {
					window.removeEventListener("resize", onMove);
					window.removeEventListener("scroll", onMove, true);
					window.removeEventListener("keydown", onKey);
					window.removeEventListener("mousedown", onDown, true);
				};
			}, [open, place, close, menu]);
			/** Focus the primary action once per open; Esc hands focus back. */
			useEffect(function() {
				if (!open) return;
				var id = setTimeout(function() {
					if (primaryRef.current !== null) primaryRef.current.focus({ preventScroll: true });
				}, 0);
				return function() {
					clearTimeout(id);
				};
			}, [open]);
			useEffect(function() {
				return function() {
					for (var i = 0; i < timersRef.current.length; i++) clearTimeout(timersRef.current[i]);
					timersRef.current = [];
				};
			}, []);
			var stop = useCallback(function() {
				if (abortRef.current !== null) abortRef.current.abort();
			}, []);
			useEffect(function() {
				return stop;
			}, [stop]);
			/** Iterate needs an instruction before it can spend a call: save a click. */
			useEffect(function() {
				if (!open || view !== "run" || mode !== "iterate") return;
				later(function() {
					if (feedbackRef.current !== null) {
						try {
							feedbackRef.current.focus();
						} catch (cause) {}
					}
				}, 80);
			}, [open, view, mode]);
			var run = useCallback(function() {
				/* One live stream at a time: a switch mid-answer replaces it. */
				if (abortRef.current !== null) abortRef.current.abort();
				if (template === null) {
					setError(T("模板目录还没载入，请稍后重试。"));
					return;
				}
				var source = sourceFor(mode);
				if (typeof source !== "string" || source.trim() === "") {
					setError(T("输入框里还没有内容可润色。"));
					return;
				}
				if (mode === "iterate" && feedback.trim() === "") {
					setError(T("迭代优化要先填改进意见。"));
					return;
				}
				setError("");
				setResult("");
				setModelUsed("");
				setVars(null);
				setUsage(null);
				setElapsedMs(0);
				setUsedSource(source);
				setMenu("");
				setStatus("running");
				setView("run");
				var startedAt = Date.now();
				var controller = new AbortController();
				abortRef.current = controller;
				var carried = "";
				/**
				 * Delta batching. One `setResult` per token re-rendered the whole panel
				 * per token (bench: 300 deltas → 310 renders); a reasoning model at
				 * 50-100 tok/s turns that into visible stutter. Flush at most every
				 * 60ms instead — still far faster than the eye reads — and let the
				 * terminal handlers write the exact final text unconditionally, so
				 * throttling can never cost accuracy or strand the tail on abort.
				 */
				var flushTimer = null;
				var dropFlush = function() {
					if (flushTimer !== null) {
						clearTimeout(flushTimer);
						flushTimer = null;
					}
				};
				var body = {
					optimizationMode: mode,
					targetPrompt: source,
					templateId: template.id
				};
				if (sessionId !== "") body.sessionId = sessionId;
				if (mode === "iterate") {
					body.lastOptimizedPrompt = result !== "" ? result : source;
					body.iterateInput = feedback;
				}
				if (pinned !== null) {
					body.provider = pinned.provider;
					body.model = pinned.model;
				}
				stream(body, function(text) {
					carried += text;
					if (flushTimer === null) {
						flushTimer = setTimeout(function() {
							flushTimer = null;
							setResult(carried);
						}, 60);
					}
				}, controller.signal).then(function(out) {
					dropFlush();
					setResult(out.text);
					setModelUsed(out.model);
					setUsage(out.usage);
					setElapsedMs(Date.now() - startedAt);
					lastSigRef.current = mode + "|" + template.id + "|" + source;
					setUsedTemplate(template.id);
					setStatus("done");
					/**
					 * A finished run becomes a version: granted persists it, unknown
					 * raises the consent card and keeps the run in memory only, declined
					 * keeps nothing. Iterating a previous version links parent/root so
					 * 对比 and 删除整条链 operate on the real chain.
					 */
					var entry = {
						id: newEntryId(),
						at: Date.now(),
						mode: mode,
						template: pick(template, "label") || template.id,
						templateId: template.id,
						model: out.model,
						input: clip(source),
						output: clip(out.text),
						usage: out.usage !== null && out.usage !== void 0 ? { inputTokens: out.usage.inputTokens, outputTokens: out.usage.outputTokens, totalTokens: out.usage.totalTokens } : void 0,
						elapsedMs: Date.now() - startedAt,
						source: "run"
					};
					var base = null;
					if (mode === "iterate" && result !== "") {
						for (var j = store.entries.length - 1; j >= 0; j--) {
							if (store.entries[j].output === result) {
								base = store.entries[j];
								break;
							}
						}
					}
					if (base !== null) {
						entry.parentId = base.id;
						entry.rootId = base.rootId;
					} else {
						entry.parentId = null;
						entry.rootId = entry.id;
					}
					setRootId(entry.rootId);
					if (store.consent === "granted") {
						var nextStore = appendEntry(store, entry);
						writeHistoryStore(nextStore);
						setStore(nextStore);
					} else if (store.consent === "unknown") {
						pendingRef.current = entry;
						setConsentOpen(true);
					}
				}, function(cause) {
					dropFlush();
					if (controller.signal.aborted) {
						/** A stopped run keeps whatever already arrived, tail included. */
						if (carried !== "") {
							setResult(carried);
							setElapsedMs(Date.now() - startedAt);
						}
						setStatus(carried !== "" ? "done" : "idle");
						return;
					}
					if (carried !== "") setResult(carried);
					setElapsedMs(Date.now() - startedAt);
					setError(cause instanceof Error ? cause.message : String(cause));
					setStatus("error");
				}).finally(function() {
					if (abortRef.current === controller) abortRef.current = null;
				});
			}, [mode, template, feedback, pinned, sessionId, sourceFor, store, result]);
			/**
			 * Opening the panel — or switching family/template — spends one call on
			 * whatever is in the composer right now. That is what makes the panel
			 * behave like part of the input box instead of a form with a submit
			 * button. Iterate stays manual: it needs an instruction first.
			 *
			 * `autoSigRef` keys the automatic call by (mode, template), so completions
			 * and re-renders cannot re-trigger it; only a real switch does.
			 */
			useEffect(function() {
				if (!open || view !== "run") return;
				if (catalog === null || template === null) return;
				if (mode === "iterate") return;
				var source = sourceFor(mode);
				if (typeof source !== "string" || source.trim() === "") return;
				var signature = mode;
				if (autoSigRef.current === signature) return;
				/**
				 * Reopening on text we already answered must not buy the same answer
				 * twice: the result from this very draft is still on screen, so keep
				 * it and mark the signature spent. A delay before the real call also
				 * collapses a rapid template/mode switch into one request instead of
				 * one aborted request per click.
				 */
				var exact = mode + "|" + template.id + "|" + source;
				var id = setTimeout(function() {
					autoSigRef.current = signature;
					if (lastSigRef.current === exact && result !== "") return;
					run();
				}, 220);
				return function() {
					clearTimeout(id);
				};
			}, [open, view, catalog, template, mode, sourceFor, run, result]);
			/** Switching family keeps the result; it never spends a call by itself. */
			var choose = useCallback(function(nextMode) {
				autoSigRef.current = "";
				setMode(nextMode);
				setMenu("");
				setError("");
				var list = catalog === null || catalog.templates === void 0 ? [] : catalog.templates.filter(function(entry) {
					return entry.optimizationMode === nextMode;
				});
				/**
				 * First pick is the server's documented default for the family
				 * (`catalog.defaults`), falling back to list order — never a client-side
				 * hardcoded id, so the server stays the single source of truth.
				 */
				var preferred = catalog !== null && catalog.defaults !== void 0 ? catalog.defaults[nextMode] : void 0;
				var next = null;
				if (typeof preferred === "string") {
					for (var i = 0; i < list.length; i++) {
						if (list[i].id === preferred) {
							next = list[i];
							break;
						}
					}
				}
				if (next === null && list.length > 0) next = list[0];
				setTemplateId(next === null ? "" : next.id);
			}, [catalog]);
			var pickTemplate = useCallback(function(entry) {
				setTemplateId(entry.id);
				setMenu("");
				setError("");
			}, []);
			/**
			 * Replacing a 4,000-character draft is destructive enough to deserve a
			 * look first: the button opens a line diff, and only the confirm writes.
			 */
			var accept = useCallback(function() {
				if (result === "" || inputActions === void 0) return;
				setReview(true);
			}, [inputActions, result]);
			/** Writes the reviewed result back and leaves a short undo window. */
			var confirmReplace = useCallback(function() {
				if (result === "" || inputActions === void 0) return;
				var before = draftRef.current;
				inputActions.setDraft(result);
				setReview(false);
				setUndoText(typeof before === "string" ? before : "");
				var seq = ++undoSeqRef.current;
				later(function() {
					if (undoSeqRef.current === seq) setUndoText("");
				}, 9000);
				setFlash("done");
				later(function() {
					setFlash("");
				}, 1800);
				close();
				setVars(null);
			}, [inputActions, result, close]);
			var undo = useCallback(function() {
				if (inputActions === void 0 || undoText === "") return;
				inputActions.setDraft(undoText);
				undoSeqRef.current++;
				setUndoText("");
				setFlash("");
			}, [inputActions, undoText]);
			/**
			 * Write the result back and submit it in one go.
			 *
			 * Calling `submit()` immediately after `setDraft()` is safe: the draft write
			 * is a discrete Lexical update, which flushes its update listener — and with
			 * it `projection.clipboardText`, the field `submit()` reads — before returning.
			 * `submit()` takes the composer's normal Enter path, so while a turn is
			 * running the message queues instead of interrupting it.
			 */
			var send = useCallback(function() {
				if (result === "" || inputActions === void 0) return;
				inputActions.setDraft(result);
				inputActions.submit();
				setFlash("done");
				later(function() {
					setFlash("");
				}, 1600);
				close();
				setVars(null);
			}, [inputActions, result, close]);
			/** Ask the host which spans of the current output are parameterisable. */
			var extract = useCallback(function() {
				if (result === "" || extracting) return;
				setError("");
				setVars(null);
				setExtracting(true);
				var controller = new AbortController();
				extractRef.current = controller;
				extractVariables(result, pinned, sessionId, controller.signal).then(function(out) {
					setVars(out);
				}, function(cause) {
					if (controller.signal.aborted) return;
					setError(cause instanceof Error ? cause.message : String(cause));
				}).finally(function() {
					setExtracting(false);
					if (extractRef.current === controller) extractRef.current = null;
				});
			}, [result, pinned, sessionId, extracting]);
			/**
			 * Write the slot-substituted text back. Deliberately does not send: a
			 * templated prompt is a draft with holes, and the point of extracting
			 * variables is to keep editing it.
			 */
			var applyTemplate = useCallback(function() {
				if (vars === null || typeof vars.templated !== "string" || inputActions === void 0) return;
				inputActions.setDraft(vars.templated);
				close();
				setVars(null);
			}, [inputActions, vars, close]);
			/** Copy any text; `flash` names the button that briefly confirms. */
			var copyText = useCallback(function(text, tag) {
				if (typeof text !== "string" || text === "") return;
				var mark = function() {
					setCopied(tag);
					later(function() {
						setCopied("");
					}, 1500);
				};
				var fail = function() {
					setError(T("复制到剪贴板失败，请手动选中结果文本复制。"));
				};
				var legacy = function() {
					try {
						var ta = document.createElement("textarea");
						ta.value = text;
						ta.style.position = "fixed";
						ta.style.opacity = "0";
						document.body.appendChild(ta);
						ta.select();
						var ok = document.execCommand("copy");
						document.body.removeChild(ta);
						if (ok) mark();
						else fail();
					} catch {
						fail();
					}
				};
				if (typeof navigator !== "undefined" && navigator.clipboard !== void 0 && typeof navigator.clipboard.writeText === "function") {
					navigator.clipboard.writeText(text).then(mark, legacy);
				} else {
					legacy();
				}
			}, []);
			var grantConsent = useCallback(function() {
				var base = pendingRef.current !== null ? appendEntry(store, pendingRef.current) : store;
				pendingRef.current = null;
				var nextStore = { schemaVersion: HISTORY_SCHEMA, consent: "granted", entries: pruneEntries(base.entries) };
				writeHistoryStore(nextStore);
				setStore(nextStore);
				setConsentOpen(false);
			}, [store]);
			var declineConsent = useCallback(function() {
				pendingRef.current = null;
				var nextStore = { schemaVersion: HISTORY_SCHEMA, consent: "declined", entries: [] };
				writeHistoryStore(nextStore);
				setStore(nextStore);
				setConsentOpen(false);
			}, []);
			var dropHistoryEntry = useCallback(function(id) {
				var next = dropEntry(store.entries, id);
				var nextStore = { schemaVersion: HISTORY_SCHEMA, consent: store.consent, entries: next };
				writeHistoryStore(nextStore);
				setStore(nextStore);
				if (openId === id) setOpenId("");
			}, [store, openId]);
			var wipeHistory = useCallback(function() {
				var nextStore = { schemaVersion: HISTORY_SCHEMA, consent: store.consent, entries: [] };
				writeHistoryStore(nextStore);
				setStore(nextStore);
				setOpenId("");
			}, [store]);
			/** Restore a version into the composer (no send), keeping it as the iterate base. */
			var restoreVersion = useCallback(function(entry) {
				if (inputActions === void 0 || typeof entry.output !== "string" || entry.output === "") return;
				inputActions.setDraft(entry.output);
				setResult(entry.output);
				setMode("iterate");
				setRootId(entry.rootId);
				close();
			}, [inputActions, close]);
			var openCompare = useCallback(function(entry) {
				setRootId(entry.rootId);
				setCmpId(entry.id);
				setView("compare");
				setMenu("");
				setError("");
			}, []);
			/** The chain 对比 walks, oldest first. */
			var chain = useMemo(function() {
				if (rootId === "") return [];
				return chainOf(store.entries, rootId);
			}, [rootId, store.entries]);
			var cmpEntry = useMemo(function() {
				if (chain.length === 0) return null;
				for (var i = 0; i < chain.length; i++) if (chain[i].id === cmpId) return chain[i];
				return chain[chain.length - 1];
			}, [chain, cmpId]);
			var cmpOriginal = chain.length > 0 ? chain[0].input : "";
			var cmpAnalysis = useMemo(function() {
				if (cmpEntry === null) return null;
				return analyzeChange(cmpOriginal, cmpEntry.output);
			}, [cmpOriginal, cmpEntry]);
			var cmpUsage = useMemo(function() {
				var missing = 0;
				var input = 0;
				var output = 0;
				for (var i = 0; i < chain.length; i++) {
					var u = chain[i].usage;
					if (u && typeof u.inputTokens === "number" && typeof u.outputTokens === "number") {
						input += u.inputTokens;
						output += u.outputTokens;
					} else {
						missing++;
					}
				}
				if (chain.length === 0) return "";
				if (missing > 0) return EN ? "Chain total " + input + " → " + output + " tok, " + missing + " run(s) without usage" : "整条链共 " + input + " → " + output + " tok，" + missing + " 次未提供用量";
				return EN ? "Chain total " + input + " → " + output + " tok" : "整条链共 " + input + " → " + output + " tok";
			}, [chain]);
			/**
			 * Why the primary action is disabled, said on the control itself. The
			 * footer shows this string, so an empty composer explains itself instead
			 * of a grey button with no reason.
			 */
			var sourceNow = sourceFor(mode);
			var runBlock = template === null ? T("模板目录还没载入") : typeof sourceNow !== "string" || sourceNow.trim() === "" ? T("输入框里还没有内容") : mode === "iterate" && feedback.trim() === "" ? T("先写一句改进意见") : "";
			var canRun = runBlock === "" && !busy;
			/**
			 * Result metadata lives on the card's own header, so the footer only
			 * speaks while something is happening — or when the primary action is
			 * blocked, which is the one moment the reason must be visible.
			 */
			var metaBits = [];
			if (busy) metaBits.push(T("生成中…"));
			else if (result === "" && runBlock !== "" && draft.trim() !== "") metaBits.push(runBlock);
			var metaText = metaBits.join(" · ");
			var cardMeta = [];
			/** The title already says 生成中 while busy; repeating it here reads as a bug. */
			if (!busy && result !== "") {
				if (modelUsed !== "") cardMeta.push(modelUsed);
				if (elapsedMs > 0) cardMeta.push((elapsedMs / 1000).toFixed(1) + "s");
				cardMeta.push(charsLabel(compactChars(result)));
				var usageBit = usageShort(usage);
				if (usageBit !== "") cardMeta.push(usageBit);
			}
			var cardMetaText = cardMeta.join(" · ");
			/** Pinned model name for the footer picker; falls back to the pin itself. */
			var pinLabel = T("跟随当前模型");
			if (pinned !== null) {
				pinLabel = pinned.model;
				if (catalog !== null && Array.isArray(catalog.groups)) {
					for (var gi = 0; gi < catalog.groups.length; gi++) {
						var group = catalog.groups[gi];
						if (group.provider !== pinned.provider) continue;
						for (var mi = 0; mi < group.models.length; mi++) {
							if (group.models[mi].id === pinned.model) pinLabel = group.models[mi].name;
						}
					}
				}
			} else if (catalog !== null && catalog.current && typeof catalog.current.model === "string") {
				pinLabel = T("跟随当前");
			}
			var modes = catalog === null || catalog.modes === void 0 ? [] : catalog.modes;
			var seatLabel = flash === "done" ? T("已替换") : busy ? T("优化中") : T("提示词优化");
			var seatIcon = flash === "done" ? Icon("check", 13) : Icon("sparkle", 13, busy ? "pp2-spin" : "");
			/** Undo only while the draft still is the text we just wrote. */
			var canUndo = undoText !== "" && result !== "" && draft === result;
			var seat = h("span", { className: "pp2-seatwrap" }, h("button", {
				ref: seatRef,
				type: "button",
				className: "pp2-seat",
				"data-open": open ? "1" : "0",
				"data-flash": flash === "done" ? "1" : "0",
				title: T("优化输入框里的提示词（打开面板，不改动草稿）"),
				"aria-haspopup": "dialog",
				"aria-expanded": open,
				onMouseDown: function(event) {
					/* Keep the composer from swallowing the click as a blur+refocus. */
					event.preventDefault();
					event.stopPropagation();
				},
				onClick: function() {
					if (open) close();
					else {
						setView("run");
						setMenu("");
						setOpen(true);
					}
				}
				}, seatIcon, h("span", null, seatLabel)), canUndo ? h("button", {
					type: "button",
					className: "pp2-undo",
					title: T("恢复替换前的草稿"),
					onMouseDown: function(event) {
						event.preventDefault();
						event.stopPropagation();
					},
					onClick: undo
				}, T("撤销")) : null);
			if (!open) return seat;
			/** Segmented families: the server's own optimizationMode axis. */
			var segmented = h("div", { className: "pp2-seg", role: "tablist", "aria-label": T("优化对象") }, modes.length === 0 ? h("span", { className: "pp2-muted", style: { padding: "0 6px" } }, T("载入中…")) : modes.map(function(entry) {
				return h("button", {
					key: entry.id,
					type: "button",
					role: "tab",
					"aria-selected": mode === entry.id,
					"data-on": mode === entry.id ? "1" : "0",
					title: (EN ? "Polish " : "优化对象是") + pick(entry, "label"),
					disabled: busy,
					onClick: function() {
						choose(entry.id);
					}
				}, pick(entry, "label"));
			}));
			var templateMenu = h("div", { className: "pp2-menuwrap" }, h("button", {
				type: "button",
				className: "pp2-pick",
				"data-on": menu === "template" ? "1" : "0",
				"aria-haspopup": "menu",
				"aria-expanded": menu === "template",
				title: T("使用哪个优化模板"),
				disabled: family.length === 0 || busy,
				onClick: function(event) {
					var rect = event.currentTarget.getBoundingClientRect();
					var groups = {};
					family.forEach(function(entry) { groups[entry.category || ""] = 1; });
					var needed = Math.min(340, 14 + family.length * 76 + Object.keys(groups).length * 24);
					var below = window.innerHeight - rect.bottom - 8;
					var above = rect.top - 8;
					setMenuUp(below < needed && above > below);
					setMenu(menu === "template" ? "" : "template");
				}
			}, h("span", null, template === null ? T("模板") : pick(template, "label")), Icon("chevron", 12)), menu === "template" ? h("div", { className: "pp2-menu", role: "menu", "data-align": "right", "data-wide": "1", "data-up": menuUp ? "1" : "0" }, (function() {
				/**
				 * The catalogue is grouped by method (基础 / 结构 / 示范 / 推理 / 迭代).
				 * Labels alone never told anyone which method a template uses, so each
				 * row carries the one-line description the host publishes.
				 */
				var rows = [];
				var seen = "";
				family.forEach(function(entry) {
					var category = typeof entry.category === "string" && entry.category !== "" ? entry.category : "";
					if (category !== "" && category !== seen) {
						seen = category;
						rows.push(h("div", { key: "cat-" + category, className: "pp2-group" }, T(category)));
					}
					var on = template !== null && template.id === entry.id;
					rows.push(h("button", {
						key: entry.id,
						type: "button",
						role: "menuitemradio",
						"aria-checked": on,
						className: "pp2-item",
						"data-rich": "1",
						title: entry.useWhen === void 0 ? void 0 : T("适合：") + pick(entry, "useWhen"),
						onClick: function() {
							pickTemplate(entry);
						}
					}, h("span", null, h("span", { className: "pp2-ttl" }, pick(entry, "label")), entry.description === void 0 ? null : h("span", { className: "pp2-desc" }, pick(entry, "description")), entry.useWhen === void 0 ? null : h("span", { className: "pp2-why" }, T("适用：") + pick(entry, "useWhen")), entry.benefit === void 0 ? null : h("span", { className: "pp2-why" }, T("优点：") + pick(entry, "benefit"))), on ? Icon("check", 12) : null));
				});
				return rows;
			})()) : null);
			/** Footer model picker: same data as before, no native <select>. */
			var modelMenu = h("div", { className: "pp2-menuwrap" }, h("button", {
				type: "button",
				className: "pp2-pick",
				"data-on": menu === "model" ? "1" : "0",
				"aria-haspopup": "menu",
				"aria-expanded": menu === "model",
				title: T("润色用哪个模型（默认跟随输入框）"),
				disabled: busy,
				onClick: function() {
					setMenu(menu === "model" ? "" : "model");
				}
			}, h("span", null, pinLabel), Icon("chevron", 12)), menu === "model" ? h("div", { className: "pp2-menu", role: "menu", "data-up": "1" },
				h("button", {
					type: "button",
					role: "menuitemradio",
					"aria-checked": pin === "",
					className: "pp2-item",
					onClick: function() {
						setPin("");
						writePin("");
						setMenu("");
					}
				}, h("span", null, T("跟随当前模型")), catalog !== null && catalog.current ? h("span", { className: "pp2-sub" }, catalog.current.model) : null, pin === "" ? Icon("check", 12) : null),
				catalog === null ? null : catalog.groups.filter(function(group) {
					return group.models.length > 0;
				}).map(function(group, groupIndex, list) {
					return h("div", { key: group.provider },
						list.length > 1 ? h("div", { className: "pp2-group" }, group.name) : null,
						group.models.map(function(entry) {
							var value = group.provider + "/" + entry.id;
							return h("button", {
								key: value,
								type: "button",
								role: "menuitemradio",
								"aria-checked": pin === value,
								className: "pp2-item",
								title: value,
								onClick: function() {
									setPin(value);
									writePin(value);
									setMenu("");
								}
							}, h("span", null, entry.name), pin === value ? Icon("check", 12) : null);
						}));
				})) : null);
			var toolbar = view === "run" ? h("div", { className: "pp2-bar" }, segmented, h("span", { className: "pp2-grow" }), templateMenu) : null;
			var errorBanner = error === "" ? null : h("div", { className: "pp2-err", role: "alert" }, Icon("alert", 14), h("div", null, error));
			var iterateField = mode !== "iterate" ? null : h("div", { className: "pp2-field" },
				h("label", { className: "pp2-label" }, T("这一版想怎么改？")),
				h("textarea", {
					className: "pp2-ta",
					ref: feedbackRef,
					value: feedback,
					placeholder: T("例如：再简短一些，补一个输出示例，语气面向新手……"),
					onChange: function(event) {
						setFeedback(event.target.value);
					},
					onKeyDown: function(event) {
						if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
							event.preventDefault();
							if (canRun) run();
						}
					}
				}),
				result === "" ? h("p", { className: "pp2-muted", style: { whiteSpace: "normal" } }, T("还没有结果，这次会把输入框里的内容当作底稿。")) : null);
			var resultCard = result === "" && !busy ? null : h("div", { className: "pp2-card", "data-compact": vars === null ? "0" : "1" },
				h("div", { className: "pp2-card-h" },
					busy ? h("span", { className: "pp2-dot" }) : null,
					h("span", { className: "pp2-card-t" }, busy ? T("生成中") : T("润色结果")),
					h("span", { className: "pp2-card-m", title: cardMetaText }, cardMetaText),
					h("span", { className: "pp2-grow" }),
					!busy && result !== "" && usedSource !== "" && usedSource !== sourceFor(mode) ? h("span", {
						className: "pp2-stale",
						title: T("输入框里的内容已经变了，按 ⌘↵ 用新内容重新生成")
					}, T("草稿已更新")) : null,
					result !== "" && !busy ? h("span", { className: "pp2-acts" },
						h("button", {
							type: "button",
							className: "pp2-ibtn",
							title: T("复制结果到剪贴板（不改动输入框）"),
							onClick: function() {
								copyText(result, "result");
							}
						}, copied === "result" ? Icon("check", 13) : Icon("copy", 13)),
						h("button", {
							type: "button",
							className: "pp2-ibtn",
							title: T("找出可以参数化的片段（另一次模型调用）"),
							disabled: extracting,
							onClick: extract
						}, Icon("braces", 14, extracting ? "pp2-spin" : ""))
					) : null),
				h("div", { className: "pp2-card-b" },
					h("pre", { className: "pp2-text", "data-placeholder": result === "" ? "1" : "0" }, result === "" ? T("正在生成…") : result, busy ? h("span", { className: "pp2-caret" }) : null)));
			var srcCard = result === "" || busy ? null : h("div", { className: "pp2-src", "data-open": srcOpen ? "1" : "0" },
				h("div", { className: "pp2-src-h" },
					h("span", null, T("原稿")),
					h("span", { className: "pp2-grow" }),
					h("button", {
						type: "button",
						className: "pp2-pick",
						title: srcOpen ? T("收起原稿") : T("展开原稿"),
						onClick: function() {
							setSrcOpen(!srcOpen);
						}
					}, srcOpen ? T("收起") : T("展开"))),
				h("pre", { className: "pp2-src-t" }, sourceFor(mode) || T("（空）")));
			var emptyState = mode === "iterate" ? null : h("div", { className: "pp2-empty" },
				h("div", { className: "pp2-empty-i" }, Icon("sparkle", 18)),
				h("p", { className: "pp2-empty-t" }, draft.trim() === "" ? T("输入框还是空的") : T("把草稿改写成更清晰的提示词")),
				h("p", { className: "pp2-empty-s" }, draft.trim() === "" ? T("先在输入框里写一句需求，打开就会自动优化。") : T("只改输入框里的草稿，满意了再手动发送。")));
			var consentCard = !consentOpen && !(store.consent === "unknown" && store.entries.length > 0) ? null : h("div", { className: "pp2-consent" },
				Icon("clock", 14),
				h("p", { className: "pp2-consent-t", title: T("只在浏览器本地保存输入、结果和用量，不上传、不发往服务器。") },
					h("b", null, T("保存润色历史？")), T("只存在本机，不上传。")),
				h("span", { className: "pp2-grow" }),
				h("button", { type: "button", className: "pp2-btn", "data-sm": "1", onClick: declineConsent }, T("不保存")),
				h("button", { type: "button", className: "pp2-btn", "data-sm": "1", "data-primary": "1", onClick: grantConsent }, T("保存")));
			var varsBlock = vars === null ? null : h("div", { className: "pp2-card", ref: varsRef },
				h("div", { className: "pp2-card-h" }, h("span", { className: "pp2-card-t" }, T("可参数化片段")), h("span", { className: "pp2-card-m" }, vars.summary || "")),
				h("div", { className: "pp2-card-b", style: { display: "flex", flexDirection: "column", gap: "8px" } },
					h("ul", { className: "pp2-chips" }, (Array.isArray(vars.variables) ? vars.variables : []).map(function(entry, index) {
						return h("li", { key: entry.name + "-" + index, className: "pp2-chip", title: entry.reason || "" }, h("code", null, "{{" + entry.name + "}}"), h("em", null, entry.value));
					})),
					h("div", { className: "pp2-hrow" },
						h("button", {
							type: "button",
							className: "pp2-btn",
							disabled: typeof vars.templated !== "string",
							title: typeof vars.templated === "string" ? T("把片段替换成 {{变量}} 占位并写回输入框，不发送") : vars.templatedError || T("模型给出的位置对不上原文，无法套成模板。"),
							onClick: applyTemplate
						}, T("写回模板")),
						h("span", { className: "pp2-muted", title: vars.templatedError || "" }, typeof vars.templated === "string" ? T("写回后仍可继续编辑") : T("位置对不上，无法套用")))));
			var runView = h("div", { className: "pp2-body" },
				errorBanner,
				consentCard,
				iterateField,
				resultCard,
				varsBlock,
				result === "" && !busy ? emptyState : srcCard);
			/** "v2 · " when this entry belongs to a multi-run chain, else "". */
			function versionTag(entry) {
				var siblings = chainOf(store.entries, entry.rootId);
				if (siblings.length < 2) return "";
				return "v" + (siblings.findIndex(function(item) { return item.id === entry.id; }) + 1) + " · ";
			}
			/** History: hairline rows, one expanded at a time. */
			var historyRows = store.entries.map(function(entry) {
				var on = openId === entry.id;
				var snippet = String(entry.input || "").replace(/\s+/g, " ").slice(0, 40);
				return h("div", { key: entry.id },
					h("button", {
						type: "button",
						className: "pp2-row",
						"data-on": on ? "1" : "0",
						"aria-expanded": on,
						title: T("展开看这次润色的输入、结果和用量"),
						onClick: function() {
							setOpenId(on ? "" : entry.id);
						}
					},
						h("span", { className: "pp2-row-m", style: { minWidth: "52px" } }, relTime(entry.at)),
						h("span", { className: "pp2-row-t" }, entry.template || T("润色"), snippet === "" ? "" : " · " + snippet),
						h("span", { className: "pp2-row-m" }, versionTag(entry) + charsLabel(compactChars(entry.output))),
						Icon(on ? "chevron" : "arrowRight", 12)),
					on ? h("div", { className: "pp2-hbody" },
						h("div", { className: "pp2-hblock" }, h("div", { className: "pp2-hblock-h" }, T("原稿")), h("pre", { className: "pp2-hblock-b" }, entry.input)),
						h("div", { className: "pp2-hblock" }, h("div", { className: "pp2-hblock-h" }, T("结果") + (entry.model ? " · " + entry.model : "")), h("pre", { className: "pp2-hblock-b" }, entry.output)),
						h("p", { className: "pp2-muted" }, usageShort(entry.usage) || T("用量未提供")),
						h("div", { className: "pp2-hrow" },
							h("button", { type: "button", className: "pp2-btn", onClick: function() { copyText(entry.output, entry.id); } }, copied === entry.id ? T("已复制") : T("复制")),
							h("button", { type: "button", className: "pp2-btn", title: T("把这条结果写回输入框（不发送）"), onClick: function() { restoreVersion(entry); } }, T("写回")),
							h("button", { type: "button", className: "pp2-btn", onClick: function() { openCompare(entry); } }, T("对比版本")),
							h("span", { className: "pp2-grow" }),
							h("button", { type: "button", className: "pp2-ibtn", title: T("删除这一条"), onClick: function() { dropHistoryEntry(entry.id); } }, Icon("trash", 13)))) : null);
			});
			var historyView = h("div", { className: "pp2-body" },
				store.consent === "unknown" ? h("div", { className: "pp2-empty" },
					h("div", { className: "pp2-empty-i" }, Icon("clock", 18)),
					h("p", { className: "pp2-empty-t" }, T("要不要留着润色记录？")),
					h("p", { className: "pp2-empty-s" }, T("只存在这台机器上，不上传。想清空随时可以。")),
					h("div", { className: "pp2-hrow", style: { marginTop: 6 } },
						h("button", { type: "button", className: "pp2-btn", "data-sm": "1", onClick: declineConsent }, T("不保存")),
						h("button", { type: "button", className: "pp2-btn", "data-sm": "1", "data-primary": "1", onClick: grantConsent }, T("保存")))) : null,
				store.consent === "declined" ? h("div", { className: "pp2-note" }, Icon("clock", 14), h("div", { className: "pp2-note-b" },
					h("p", null, T("历史记录已关闭，本机没有保存任何润色内容。")),
					h("div", { className: "pp2-hrow" }, h("button", { type: "button", className: "pp2-btn", onClick: grantConsent }, T("开启历史"))))) : null,
				store.consent === "granted" && store.entries.length === 0 ? h("div", { className: "pp2-empty" },
					h("div", { className: "pp2-empty-i" }, Icon("clock", 18)),
					h("p", { className: "pp2-empty-t" }, T("还没有记录")),
					h("p", { className: "pp2-empty-s" }, T("每完成一次润色，这里会存一条：当时的输入、结果和用量，重启后也还在。"))) : null,
				h("div", { className: "pp2-hist" }, historyRows));
			/** Compare: 原稿 | selected version, plus the deterministic local read-out. */
			var compareView = cmpEntry === null || cmpAnalysis === null ? historyView : h("div", { className: "pp2-body" },
				chain.length > 1 && h("div", { className: "pp2-hrow" },
					h("span", { className: "pp2-muted" }, chainLabel(chain.length)),
					h("span", { className: "pp2-grow" }),
					h("div", { className: "pp2-menuwrap" },
						h("button", {
							type: "button",
							className: "pp2-pick",
							"data-on": menu === "compare" ? "1" : "0",
							onClick: function() {
								setMenu(menu === "compare" ? "" : "compare");
							}
						}, h("span", null, "v" + (chain.findIndex(function(e2) { return e2.id === cmpEntry.id; }) + 1) + " · " + relTime(cmpEntry.at)), Icon("chevron", 12)),
						menu === "compare" ? h("div", { className: "pp2-menu", "data-align": "right", role: "menu" }, chain.map(function(entry, index) {
							return h("button", {
								key: entry.id,
								type: "button",
								className: "pp2-item",
								"aria-checked": entry.id === cmpEntry.id,
								onClick: function() {
									setCmpId(entry.id);
									setMenu("");
								}
							}, h("span", null, "v" + (index + 1) + " · " + relTime(entry.at)), entry.id === cmpEntry.id ? Icon("check", 12) : null);
						})) : null)),
				h("div", { className: "pp2-cmp" },
					h("div", { className: "pp2-col" },
						h("div", { className: "pp2-col-h" }, h("b", null, T("原稿")), h("span", null, charsLabel(cmpAnalysis.beforeChars))),
						h("pre", { className: "pp2-col-b" }, cmpOriginal)),
					h("div", { className: "pp2-col", "data-emph": "1" },
						h("div", { className: "pp2-col-h" }, h("b", null, T("结果")), h("span", null, charsLabel(cmpAnalysis.afterChars))),
						h("pre", { className: "pp2-col-b" }, cmpEntry.output))),
				h("p", { className: "pp2-csum" },
					h("span", { className: "pp2-csum-b" }, h("b", null, T("结构变化（本机分析）")), analysisTail(cmpAnalysis)),
					null),
				h("div", { className: "pp2-hrow" },
					h("span", { className: "pp2-grow" }),
					h("button", { type: "button", className: "pp2-btn", onClick: function() { copyText(cmpEntry.output, "cmp"); } }, copied === "cmp" ? T("已复制") : T("复制结果")),
					h("button", { type: "button", className: "pp2-btn", "data-primary": "1", onClick: function() { restoreVersion(cmpEntry); } }, T("替换草稿"))));
			var body = view === "history" ? historyView : view === "compare" ? compareView : runView;
			var reviewRows = review ? collapseDiff(diffLines(draft, result), 2) : [];
			var reviewView = review ? [
				h("div", { key: "rh", className: "pp2-head" },
					h("span", { className: "pp2-title" }, T("确认替换草稿")),
					h("span", { className: "pp2-grow" }),
					h("button", { key: "x", type: "button", className: "pp2-ibtn", title: T("取消（Esc）"), onClick: function() { setReview(false); } }, Icon("close", 14))),
				h("div", { key: "rb", className: "pp2-diff" }, reviewRows.length === 0 ? h("p", { className: "pp2-muted" }, T("两段文字完全一样。")) : reviewRows.map(function(row, index) {
					if (row.t === "gap") return h("div", { key: index, className: "pp2-dl", "data-t": "gap" }, row.s);
					return h("div", { key: index, className: "pp2-dl", "data-t": row.t },
						h("span", { className: "pp2-dl-s" }, row.t === "del" ? "-" : row.t === "add" ? "+" : " "),
						h("span", null, row.s));
				})),
				h("div", { key: "rf", className: "pp2-foot" },
					h("span", { className: "pp2-muted" }, T("替换后 9 秒内可撤销")),
					h("span", { className: "pp2-grow" }),
					h("button", { key: "c", type: "button", className: "pp2-btn", onClick: function() { setReview(false); } }, T("取消")),
					h("button", { key: "ok", type: "button", className: "pp2-btn", "data-primary": "1", onClick: confirmReplace }, T("替换草稿")))
			] : null;
			/** A template picked after the last run: show the old result, spend nothing. */
			var pendingTemplate = result !== "" && !busy && template !== null && usedTemplate !== "" && usedTemplate !== template.id;
			var footer = view !== "run" ? null : h("div", { className: "pp2-foot" },
				modelMenu,
				pendingTemplate ? h("span", { className: "pp2-muted", title: T("刚换了模板，屏幕上还是上一版结果") }, T("模板已切换")) : null,
				metaText === "" ? null : h("span", { className: "pp2-muted", title: metaText, style: { flex: "0 1 auto" } }, metaText),
				h("span", { className: "pp2-grow" }),
				busy ? h("button", { type: "button", className: "pp2-btn", title: T("停止本次生成（已生成的部分会保留）"), onClick: stop }, Icon("stop", 12), T("停止")) : mode === "iterate" ? [
					result !== "" ? h("button", { key: "accept", type: "button", className: "pp2-btn", title: T("把当前结果写回输入框，不发送"), onClick: accept }, T("替换草稿")) : null,
					h("button", { key: "iter", ref: primaryRef, type: "button", className: "pp2-btn", "data-primary": "1", disabled: !canRun, title: canRun ? T("按改进意见再润色一版（⌘↵）") : runBlock, onClick: run }, T("开始迭代"))
				] : result !== "" && pendingTemplate ? [
					h("button", { key: "accept", type: "button", className: "pp2-btn", title: T("仍用屏幕上这版结果写回输入框"), onClick: accept }, T("替换草稿")),
					h("button", {
						key: "rerun",
						ref: primaryRef,
						type: "button",
						className: "pp2-btn",
						"data-primary": "1",
						disabled: !canRun,
						title: canRun ? T("用刚选的模板重新优化（⌘↵）") : runBlock,
						onClick: run
					}, T("用新模板重跑"))
				] : result !== "" ? [
					h("button", { key: "send", type: "button", className: "pp2-btn", title: T("把结果写回输入框并直接发送"), onClick: send }, T("发送")),
					h("button", { key: "accept", ref: primaryRef, type: "button", className: "pp2-btn", "data-primary": "1", title: T("把结果写回输入框，不发送"), onClick: accept }, T("替换草稿"))
				] : error !== "" ? h("button", {
					ref: primaryRef,
					type: "button",
					className: "pp2-btn",
					title: T("再请求一次"),
					onClick: run
				}, T("重试")) : h("span", { className: "pp2-muted", style: { textAlign: "right" } }, draft.trim() === "" ? T("在输入框写点内容，这里会自动润色") : T("正在准备…")));
			var panel = h("div", {
				ref: panelRef,
				className: "pp2",
				role: "dialog",
				"aria-label": T("提示词优化"),
				style: anchor === null ? { display: "none" } : {
					left: anchor.left,
					width: anchor.width,
					bottom: anchor.bottom,
					maxHeight: anchor.maxHeight
				},
				onMouseDown: function(event) {
					event.stopPropagation();
				},
				onKeyDown: function(event) {
					if (event.key === "Escape" && review) {
						event.preventDefault();
						event.stopPropagation();
						setReview(false);
						return;
					}
					if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && canRun && view === "run") {
						event.preventDefault();
						run();
					}
				}
			}, review ? null : h("div", { className: "pp2-head" },
				view === "run" ? h("span", { className: "pp2-title" }, Icon("sparkle", 15), T("提示词优化")) : [
					h("button", {
						key: "back",
						type: "button",
						className: "pp2-ibtn",
						title: view === "compare" ? T("返回历史") : T("返回优化"),
						onClick: function() {
							setMenu("");
							setOpenId("");
							setView(view === "compare" ? "history" : "run");
						}
					}, Icon("back", 14)),
					h("span", { key: "t", className: "pp2-title" }, view === "history" ? T("润色历史") : T("版本对比"))
				],
				view === "history" && store.entries.length > 0 ? h("span", { key: "c", className: "pp2-muted" }, countLabel(store.entries.length)) : null,
				h("span", { className: "pp2-grow" }),
				view === "history" && store.entries.length > 0 ? h("button", { key: "w", type: "button", className: "pp2-pick", title: T("清空所有记录（授权状态不变）"), onClick: wipeHistory }, T("清空")) : null,
				view === "run" ? h("button", {
					key: "h",
					type: "button",
					className: "pp2-ibtn",
					title: T("查看历史记录"),
					onClick: function() {
						setMenu("");
						setOpenId("");
						setView("history");
					}
				}, Icon("clock", 14), store.entries.length > 0 ? h("span", { className: "pp2-badge" }) : null) : null,
				h("button", { key: "x", type: "button", className: "pp2-ibtn", title: T("关闭（Esc）"), onClick: close }, Icon("close", 14))),
				review ? reviewView : [
					toolbar,
					h("div", { className: "pp2-main" }, body, h("div", { className: "pp2-fade" })),
					footer
				]);
			/**
			 * Portalling the overlay out of the slot is mandatory on DSH 0.2.2+:
			 * the docked composer is a CSS containment context, so a `position:
			 * fixed` child would otherwise be positioned (and clipped) against the
			 * composer instead of the viewport. Keeping the seat in the slot and
			 * the panel on <body> also leaves the click-outside test above correct.
			 */
			var overlay = createPortal !== null && typeof document !== "undefined" && document.body
				? createPortal(panel, document.body)
				: panel;
			return h("div", { style: { display: "contents" } }, seat, overlay);
		}
		//#endregion
		var inject = ["slots"];
		/**
		 * Register the composer seat. Automatic priority places the button into the
		 * compact-control row that renders immediately before the model selector.
		 * @param ctx - the plugin context.
		 */
		function apply(ctx) {
			ctx.effect(function() {
				return ctx.slots.inject("conversation.input.right", function() {
					return ctx.slots.register({
						name: "conversation.input.right",
						id: "prompt-polish",
						order: 5
					}, PromptPolish);
				});
			}, "prompt-polish: composer seat");
		}
		/** Exposed for the contract test: the new features are pure logic worth driving directly. */
		exports.__scoreDraft = scoreDraft;
		exports.__analyzeChange = analyzeChange;
		exports.__usageText = usageText;
		exports.PromptPolish = PromptPolish;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
