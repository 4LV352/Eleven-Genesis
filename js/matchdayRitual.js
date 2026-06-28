(function () {
    "use strict";

    function getElements() {
        return {
            overlay: document.getElementById("tension-overlay"),
            minute: document.getElementById("tension-minute"),
            type: document.getElementById("tension-type"),
            headline: document.getElementById("tension-headline"),
            narrative: document.getElementById("tension-narrative"),
            continueButton: document.getElementById("btn-continue")
        };
    }

    var typingTimer = null;
    var isOpen = false;

    function clearTyping() {
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
    }

    function typeWriter(element, text, speed) {
        clearTyping();
        if (!element) return;
        var safeText = String(text || "");
        var index = 0;
        element.textContent = "";

        function typeNext() {
            if (index >= safeText.length) {
                typingTimer = null;
                return;
            }
            element.textContent += safeText.charAt(index);
            index += 1;
            typingTimer = setTimeout(typeNext, speed || 18);
        }

        typeNext();
    }

    function normalizeState(context) {
        var value = String(context || "").toLowerCase();
        if (["vitoria", "virada", "heroi", "euforia", "goleada-favor"].indexOf(value) >= 0) return "state-euphoria";
        if (["derrota", "goleada-contra", "crise", "expulsao", "lesao"].indexOf(value) >= 0) return "state-danger";
        return "state-tension";
    }

    function closeRitual() {
        var els = getElements();
        if (!els.overlay) return;
        clearTyping();
        els.overlay.classList.remove("active");
        isOpen = false;
        setTimeout(function () {
            els.overlay.classList.add("hidden");
            els.overlay.classList.remove("state-euphoria", "state-danger", "state-tension");
        }, 260);
        if (window.EventBus) window.EventBus.emit("RITUAL_COMPLETE");
    }

    function triggerClutchMoment(data) {
        var els = getElements();
        if (!els.overlay || !els.headline || !els.narrative || !els.minute || !els.type) return;

        clearTyping();
        els.overlay.classList.remove("state-euphoria", "state-danger", "state-tension");
        els.overlay.classList.add(normalizeState(data && data.context));

        els.minute.textContent = data && data.minute ? String(data.minute) + "'" : "90+'";
        els.type.textContent = data && data.type ? String(data.type) : "MOMENTO DECISIVO";
        els.headline.textContent = data && data.headline ? String(data.headline) : "O JOGO GANHOU ALMA";
        els.narrative.textContent = "";

        els.overlay.classList.remove("hidden");
        void els.overlay.offsetWidth;
        els.overlay.classList.add("active");
        isOpen = true;

        typeWriter(els.narrative, data && data.narrative ? data.narrative : "A rodada trouxe um daqueles momentos que fazem a torcida prender a respiração.", 16);
    }

    function bind() {
        var els = getElements();
        if (els.continueButton) {
            els.continueButton.addEventListener("click", closeRitual);
        }
        document.addEventListener("keydown", function (event) {
            if (isOpen && (event.key === "Escape" || event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                closeRitual();
            }
        });
        if (window.EventBus) {
            window.EventBus.on("LARGE_EVENT", triggerClutchMoment);
        }
        window.MatchdayRitual = {
            trigger: triggerClutchMoment,
            close: closeRitual
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bind);
    } else {
        bind();
    }
}());
