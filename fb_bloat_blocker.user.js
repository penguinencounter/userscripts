// ==UserScript==
// @name         Facebook Bloat Blocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove "suggested" items and other crap from your Facebook feed.
// @author       PenguinEncounter
// @match        *://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    // dynamic refresh rate config
    const MIN_REFRESH_RATE = 50;
    const MAX_REFRESH_RATE = 500;
    const REFRESH_STEP_DOWN_FACTOR = -50;
    const REFRESH_STEP_UP_FACTOR = 25;
    let refreshRate = 100;
    // selectors
    const POST_CLASS = 'a8c37x1j';
    const GROUP_POST_CLASS = 'sjgh65i0';
    const FAKE_SPONSORED = 'ldCl';
    const ALL_SPONSORED1 = 'div.ib11zyx6';
    // fb shenanigans
    const SPONSORED = /^(?!.*([denpr]).*\1)(?!(.*o){3})(?!(.*s){3})[sponsored]*$/i
    console.info('%cFacebook Bloat Blocker initialized.', 'font-size: 3em; color: #00ff00;')
    // Your code here...
    function hideAndDestroy(target) {
        if (target.style.display !== 'none') {
            target.style.display = 'none' // to avoid breakage, don't delete immediately
            setTimeout(() => target.remove(), 100)
            return true
        }
        return false
    }
    function removeBySpanText(spanEl, filter, postTarget) {
        if (spanEl.innerHTML.toLowerCase().includes(filter)) {
            let post = spanEl.closest(postTarget)
            return hideAndDestroy(post)
        }
        return false
    }

    function decodeSponsored1() {
        let targets = []
        document.querySelectorAll(ALL_SPONSORED1).forEach(e => {
            if (e.childElementCount !== 0) return
            if (targets.includes(e.parentElement)) return
            targets.push(e.parentElement)
        })

        targets.forEach(cE => {
            let builder = '';
            for (let part of cE.children) {
                if (part.classList.contains(FAKE_SPONSORED)) continue
                builder += part.innerHTML
            }
            if (SPONSORED.test(builder)) {
                let post = cE.closest('div.'+POST_CLASS)
                console.log('deleting sponsored post:')
                console.log(post)
                hideAndDestroy(post)
            }
        })
    }
    window.fbbb = {
        dsTest: decodeSponsored1
    }
    function main() {
        let matches = 0
        let total = 0
        document.querySelectorAll(`div.${POST_CLASS} span`).forEach(e => {
            removeBySpanText(e, 'suggested for you', `div.${POST_CLASS}`) && matches++
            removeBySpanText(e, 'reels and short videos', `div.${POST_CLASS}`) && matches++
        })
        total += matches
        matches !== 0 && console.log(`Homepage: Bloat removed: ${matches}`);
        matches = 0
        document.querySelectorAll(`div.${GROUP_POST_CLASS} span`).forEach(e => {
            removeBySpanText(e, 'suggested post', `div.${GROUP_POST_CLASS}`) && matches++
            removeBySpanText(e, 'because you viewed a similar group', `div.${GROUP_POST_CLASS}`) && matches++
        })
        total += matches
        matches !== 0 && console.log(`Groups: Bloat removed: ${matches}`);
        decodeSponsored1()
        let previousRefreshRate = refreshRate
        if (total === 0) {
            refreshRate += REFRESH_STEP_UP_FACTOR
            if (refreshRate > MAX_REFRESH_RATE) {
                refreshRate = MAX_REFRESH_RATE
            }
        } else {
            refreshRate += REFRESH_STEP_DOWN_FACTOR
            if (refreshRate < MIN_REFRESH_RATE) {
                refreshRate = MIN_REFRESH_RATE
            }
        }
        if (previousRefreshRate !== refreshRate) {
            console.debug(`Refresh rate: ${previousRefreshRate} => ${refreshRate} (ms)`)
        }
        setTimeout(main, refreshRate);
    }
    setTimeout(main, refreshRate);
})();
