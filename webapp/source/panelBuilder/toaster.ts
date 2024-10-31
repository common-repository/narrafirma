import humane = require("humane");

"use strict";

// For a "toaster" that can give status or progress updates
let toasterWidget = null;

// This should only be called once in your application, at the beginning
export function createToasterWidget(container) {
    // No longer needed to do anything
}

export function toast(message, messageType = "message", duration_ms = 5000) {
    // TODO: Translate message if needed
    humane.log(message, {timeout: duration_ms, clickToClose: true});
}
