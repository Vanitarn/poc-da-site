//#region src/lib/selector.ts
function e(e) {
	return typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e.replace(/[^a-zA-Z0-9_-]/g, (e) => `\\${e}`);
}
function t(e, t) {
	try {
		return t.querySelectorAll(e).length === 1;
	} catch {
		return !1;
	}
}
function n(n) {
	let r = n.ownerDocument, i = n.getAttribute("data-sanity-target");
	if (i) {
		let n = `[data-sanity-target="${e(i)}"]`;
		if (t(n, r)) return n;
	}
	if (n.id) {
		let i = `#${e(n.id)}`;
		if (t(i, r)) return i;
	}
	let a = [], o = n;
	for (; o && o !== r.documentElement;) {
		let e = o.tagName.toLowerCase(), n = o.parentElement, i = e;
		if (n) {
			let e = Array.from(n.children).filter((e) => e.tagName === o.tagName);
			e.length > 1 && (i += `:nth-of-type(${e.indexOf(o) + 1})`);
		}
		a.unshift(i);
		let s = a.join(" > ");
		if (t(s, r)) return s;
		o = n;
	}
	return a.join(" > ") || n.tagName.toLowerCase();
}
//#endregion
//#region src/lib/scan/runtimeErrors.ts
var r = [], i = !1;
function a(e) {
	r.push(e), r.length > 50 && r.shift();
}
function o(e = window) {
	i || (i = !0, e.addEventListener("error", (t) => {
		let r = t.target;
		if (r instanceof Element && r !== e) {
			let e = r.src || r.href || "";
			a({
				message: `Failed to load ${r.tagName.toLowerCase()}${e ? `: ${e}` : ""}`,
				kind: "resource",
				timestamp: Date.now(),
				selector: n(r)
			});
			return;
		}
		a({
			message: t.message || "Script error",
			source: t.filename,
			kind: "script",
			timestamp: Date.now()
		});
	}, !0), e.addEventListener("unhandledrejection", (e) => {
		a({
			message: `Unhandled promise rejection: ${String(e.reason)}`,
			kind: "unhandledrejection",
			timestamp: Date.now()
		});
	}));
}
function s() {
	return [...r];
}
function c(e) {
	return e.map((e, t) => ({
		id: `runtime-${e.kind}-${e.timestamp}-${t}`,
		title: e.kind === "resource" ? "Resource failed to load" : e.kind === "unhandledrejection" ? "Unhandled promise rejection" : "Script error",
		detail: e.message,
		severity: "critical",
		path: e.source,
		targetSelector: e.selector
	}));
}
//#endregion
export { n as i, s as n, o as r, c as t };
