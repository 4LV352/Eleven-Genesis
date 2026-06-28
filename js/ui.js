(function () {
    "use strict";

    const PRESS_TARGETS = "button, .btn, .icon-action, .row-card, .news-item, .market-card-main, .coach-mini-card, .coach-match-card, .coach-headline-card, .coach-result-card";

    function bindPressFeedback(onTap) {
        document.addEventListener("pointerdown", (event) => {
            const target = event.target.closest(PRESS_TARGETS);
            if (!target || target.disabled || target.classList.contains("is-rippling")) return;

            target.classList.add("is-rippling");
            const rect = target.getBoundingClientRect();
            target.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
            target.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);

            if (typeof onTap === "function") onTap();
            window.setTimeout(() => target.classList.remove("is-rippling"), 520);
        });
    }

    window.EGUI = {
        bindPressFeedback
    };
})();
