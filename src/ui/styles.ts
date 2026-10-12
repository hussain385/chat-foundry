import type { CSSProperties } from 'react';
import type { ChatTheme } from './types';

/** Converts theme keys to `--cf-*` CSS variables, e.g. userBubble -> --cf-user-bubble */
export function themeToCssVars(theme: Partial<ChatTheme> | undefined): CSSProperties {
    const vars: Record<string, string> = {};
    if (!theme) return vars as CSSProperties;
    for (const [key, value] of Object.entries(theme)) {
        if (value == null) continue;
        const kebab = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        vars[`--cf-${kebab}`] = String(value);
    }
    return vars as CSSProperties;
}

const LIGHT = `
  --cf-primary: #4f46e5;
  --cf-primary-text: #ffffff;
  --cf-background: #ffffff;
  --cf-surface: #f6f7f9;
  --cf-text: #111827;
  --cf-muted-text: #6b7280;
  --cf-border: #e5e7eb;
  --cf-user-bubble: var(--cf-primary);
  --cf-user-bubble-text: var(--cf-primary-text);
  --cf-assistant-bubble: var(--cf-surface);
  --cf-assistant-bubble-text: var(--cf-text);`;

const DARK = `
  --cf-primary: #818cf8;
  --cf-primary-text: #0b1020;
  --cf-background: #111318;
  --cf-surface: #1d2028;
  --cf-text: #e5e7eb;
  --cf-muted-text: #9ca3af;
  --cf-border: #2b2f3a;`;

/**
 * Default stylesheet. Everything is driven by CSS variables and low-specificity
 * `:where()` selectors, so user classNames always win without `!important`.
 */
export const DEFAULT_CSS = `
:where(.cf-root) {${LIGHT}
  --cf-radius: 16px;
  --cf-bubble-radius: 14px;
  --cf-font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --cf-font-size: 14px;
  --cf-width: 380px;
  --cf-height: 560px;
  --cf-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
  --cf-z-index: 2147483000;
  font-family: var(--cf-font-family);
  font-size: var(--cf-font-size);
  color: var(--cf-text);
  line-height: 1.5;
  box-sizing: border-box;
}
:where(.cf-root) *, :where(.cf-root) *::before, :where(.cf-root) *::after { box-sizing: inherit; }
:where(.cf-root[data-cf-scheme="dark"]) {${DARK}}
@media (prefers-color-scheme: dark) {
  :where(.cf-root[data-cf-scheme="auto"]) {${DARK}}
}
:where(.cf-panel) {
  display: flex; flex-direction: column;
  width: 100%; height: 100%; min-height: 0;
  background: var(--cf-background);
  border: 1px solid var(--cf-border);
  border-radius: var(--cf-radius);
  overflow: hidden;
}
:where(.cf-panel[hidden]) { display: none; }
:where(.cf-root[data-cf-variant="inline"]) { width: 100%; height: var(--cf-height); }
:where(.cf-root[data-cf-variant="floating"]) {
  position: fixed; bottom: 20px; z-index: var(--cf-z-index);
  display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
}
:where(.cf-root[data-cf-variant="floating"][data-cf-position="bottom-right"]) { right: 20px; }
:where(.cf-root[data-cf-variant="floating"][data-cf-position="bottom-left"]) { left: 20px; align-items: flex-start; }
:where(.cf-root[data-cf-variant="floating"]) :where(.cf-panel) {
  width: min(var(--cf-width), calc(100vw - 40px));
  height: min(var(--cf-height), calc(100vh - 120px));
  box-shadow: var(--cf-shadow);
}
:where(.cf-launcher) {
  width: 56px; height: 56px; border-radius: 999px; border: 0; cursor: pointer;
  background: var(--cf-primary); color: var(--cf-primary-text);
  box-shadow: var(--cf-shadow);
  display: grid; place-items: center;
  transition: transform 0.15s ease;
}
:where(.cf-launcher):hover { transform: scale(1.05); }
:where(.cf-header) {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-bottom: 1px solid var(--cf-border);
  background: var(--cf-background);
}
:where(.cf-header-text) { display: flex; flex-direction: column; min-width: 0; flex: 1; }
:where(.cf-title) { font-weight: 600; font-size: 1.05em; margin: 0; }
:where(.cf-subtitle) { color: var(--cf-muted-text); font-size: 0.85em; }
:where(.cf-header-actions) { display: flex; gap: 4px; }
:where(.cf-header-button) {
  border: 0; background: transparent; color: var(--cf-muted-text); cursor: pointer;
  padding: 6px 8px; border-radius: 8px; font: inherit; font-size: 0.85em;
}
:where(.cf-header-button):hover { background: var(--cf-surface); color: var(--cf-text); }
:where(.cf-avatar) {
  width: 32px; height: 32px; flex: none; border-radius: 999px; overflow: hidden;
  display: grid; place-items: center;
  background: var(--cf-surface); color: var(--cf-text); font-weight: 600; font-size: 0.85em;
}
:where(.cf-avatar) img { width: 100%; height: 100%; object-fit: cover; }
:where(.cf-avatar-glyph) { font-size: 1.6em; font-weight: 400; line-height: 1; }
:where(.cf-messages) {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 16px 14px; display: flex; flex-direction: column; gap: 12px;
}
:where(.cf-message) { display: flex; gap: 8px; align-items: flex-end; max-width: 100%; }
:where(.cf-message[data-role="user"]) { flex-direction: row-reverse; }
:where(.cf-message-body) { display: flex; flex-direction: column; gap: 2px; max-width: 80%; min-width: 0; }
:where(.cf-message[data-role="user"]) :where(.cf-message-body) { align-items: flex-end; }
:where(.cf-bubble) {
  padding: 9px 13px; border-radius: var(--cf-bubble-radius);
  white-space: pre-wrap; overflow-wrap: anywhere;
  background: var(--cf-assistant-bubble); color: var(--cf-assistant-bubble-text);
}
:where(.cf-message[data-role="user"]) :where(.cf-bubble) {
  background: var(--cf-user-bubble); color: var(--cf-user-bubble-text);
}
:where(.cf-meta) { font-size: 0.75em; color: var(--cf-muted-text); padding: 0 4px; }
:where(.cf-empty) {
  margin: auto; text-align: center; color: var(--cf-muted-text);
  display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px;
}
:where(.cf-empty-title) { color: var(--cf-text); font-weight: 600; font-size: 1.1em; }
:where(.cf-suggestions) { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
:where(.cf-suggestion) {
  border: 1px solid var(--cf-border); background: var(--cf-background); color: var(--cf-text);
  border-radius: 999px; padding: 6px 12px; cursor: pointer; font: inherit; font-size: 0.85em;
}
:where(.cf-suggestion):hover { border-color: var(--cf-primary); color: var(--cf-primary); }
:where(.cf-typing) { display: inline-flex; gap: 4px; padding: 12px 14px; }
:where(.cf-typing) span {
  width: 6px; height: 6px; border-radius: 999px; background: var(--cf-muted-text);
  animation: cf-bounce 1.2s infinite ease-in-out;
}
:where(.cf-typing) span:nth-child(2) { animation-delay: 0.15s; }
:where(.cf-typing) span:nth-child(3) { animation-delay: 0.3s; }
@keyframes cf-bounce { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
@media (prefers-reduced-motion: reduce) { :where(.cf-typing) span { animation: none; } }
:where(.cf-error) {
  margin: 0 14px 10px; padding: 8px 12px; border-radius: 10px; font-size: 0.85em;
  background: rgba(220, 38, 38, 0.1); color: #dc2626;
}
:where(.cf-input-area) {
  display: flex; gap: 8px; align-items: flex-end;
  padding: 10px 12px; border-top: 1px solid var(--cf-border); background: var(--cf-background);
}
:where(.cf-input) {
  flex: 1; resize: none; max-height: 140px; min-height: 40px;
  padding: 9px 12px; border-radius: 12px; border: 1px solid var(--cf-border);
  background: var(--cf-surface); color: var(--cf-text); font: inherit; outline: none;
}
:where(.cf-input):focus { border-color: var(--cf-primary); }
:where(.cf-input):focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cf-primary) 25%, transparent);
}
:where(.cf-send-button), :where(.cf-stop-button) {
  height: 40px; padding: 0 14px; border-radius: 12px; border: 0; cursor: pointer;
  background: var(--cf-primary); color: var(--cf-primary-text); font: inherit; font-weight: 600;
}
:where(.cf-send-button):disabled { opacity: 0.5; cursor: not-allowed; }
:where(.cf-stop-button) { background: var(--cf-surface); color: var(--cf-text); border: 1px solid var(--cf-border); }
:where(.cf-root) :focus-visible { outline: 2px solid var(--cf-primary); outline-offset: 2px; }
`;
