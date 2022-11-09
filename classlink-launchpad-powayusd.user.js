// ==UserScript==
// @name         i wanted powayusd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Made in literally 30 minutes. Super messy.
// @author       You
// @match        https://launchpad.classlink.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=classlink.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .popup-userscript.popup-userscript.popup-userscript.popup-userscript.popup-userscript {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    color: #fff;
    background: repeating-linear-gradient(45deg, #640 0, #640 1em, #660 1em, #660 2em);
    z-index: 99999999;
    padding: 10px;
    font-size: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    }
    .popup-userscript * {
z-index: 10;
}
    .popup-userscript button {
margin: 0 1em;
border: 2px solid white;
background-color: #0008;
color: #fff;
    }
    .popup-userscript.popup-userscript.popup-userscript.popup-userscript.popup-userscript::after {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: calc(var(--timer-pct) * 100%);
    background: #0008;
    content: "";
    }
    `;
    var delay = 3;
    var timeStart = Date.now() / 1000;
    var tid = setTimeout(() => {document.location = "/poway"}, delay * 1000);
    // var tid = setTimeout(() => {console.log("would redirect now")}, delay * 1000);
    document.getElementsByTagName('head')[0].appendChild(style);

    var popup = document.createElement("div");
    popup.classList.add("popup-userscript");
    var msg = document.createElement("div");
    msg.innerHTML = "Redirecting to Poway Unified login page";
    popup.appendChild(msg);
    var btn = document.createElement("button");
    btn.addEventListener("click", () => {
        popup.remove();
        tid && clearTimeout(tid); // debugging: ignore if not defined
    });
    btn.innerHTML = "Cancel";
    popup.appendChild(btn);
    document.body.appendChild(popup);
    // Your code here...
    setInterval(() => {
        popup.style.setProperty('--timer-pct', (Date.now() / 1000 - timeStart) / delay);
    }, 10);
})();

// Hi!
