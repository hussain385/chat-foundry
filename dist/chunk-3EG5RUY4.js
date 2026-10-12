"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/shared/uiHelpers.ts
var DEFAULT_LABELS = {
  placeholder: "Type a message\u2026",
  send: "Send",
  stop: "Stop",
  clear: "Clear",
  open: "Open chat",
  close: "Close chat",
  typing: "is typing",
  errorPrefix: "Something went wrong:",
  you: "You"
};
function isImageUrl(src) {
  return typeof src === "string" && /^(https?:|data:|blob:|file:|\/|\.{1,2}\/)/.test(src);
}
function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}





exports.DEFAULT_LABELS = DEFAULT_LABELS; exports.isImageUrl = isImageUrl; exports.initials = initials;
