# Bioniq Survey SDK - Vanilla JS Sandpit

This repository contains a minimalist, framework-free sandbox environment for testing the **Bioniq Survey SDK**. The project is intentionally stripped of React, Vue, and npm build tools to allow isolated verification of the UMD script delivery and the host-to-widget handshake mechanism.

---

## 🏗 System Order of Operations

1. **DOM Parsing**: The browser reads the HTML and allocates an empty target node: `<div id="bq-survey-mount">`.
2. **Script Fetching**: The SDK script tag streams down asynchronously from the remote CDN distribution layer.
3. **OnLoad & Polling**: Once the file finishes downloading, the `initBioniqWidget()` function executes. It implements a 100ms recursive backoff timer to ensure the browser engine has completely parsed and registered the global execution scope.
4. **The Initialization Handshake**: Once detected, `sdk.init(config)` passes your custom setup parameters (locale, country, leads) across the window boundary, prompting Vue to paint the interactive canvas inside the target div.

---

## ⚡ Quick Start: Running the Sandbox

Modern web browsers restrict advanced third-party scripts, canvas animations, and tracking layers if you double-click the file and open it locally via the file system (`file://`). To ensure identical production behavior, **always** serve this file over a local HTTP server protocol.

1. Ensure you have Node.js installed on your machine.
2. Open your terminal and navigate to the directory containing your `index.html` file.
3. Boot up the local web server using the following command:

```bash
npx serve
```

## Locale management

Use property called "locale".
The allowed locales are:
<option value="cs-CZ">cs-CZ</option>
<option value="de-AT">de-AT</option>
<option value="de-DE">de-DE</option>
<option value="de-CH">de-CH</option>
<option value="fr-CH">fr-CH</option>
<option value="it-CH">it-CH</option>
<option value="es-ES">es-ES</option>
<option value="en-US">en-US</option>
<option value="es-US">es-US</option>
<option value="en-GB">en-GB</option>
<option value="it-IT">it-IT</option>
<option value="pl-PL">pl-PL</option>
<option value="pt-PT">pt-PT</option>
<option value="ro-RO">ro-RO</option>
Otherwise it'll render english
pass it like a string: locale="pl-PL"