(function () {
    "use strict";

    const MENU_SCREENS = ["menu", "menuSettings", "menuCredits", "clubSelect"];

    function animateScreen(root) {
        if (!root) return;
        root.classList.remove("screen-transition");
        void root.offsetWidth;
        root.classList.add("screen-transition");
    }

    function isCareerScreen(state) {
        return Boolean(state && state.club && !MENU_SCREENS.includes(state.currentScreen));
    }

    function setActiveNav(screen) {
        document.querySelectorAll(".nav-button").forEach((button) => {
            button.classList.toggle("active", button.dataset.screen === screen);
        });
    }

    window.EGNavigation = {
        MENU_SCREENS,
        animateScreen,
        isCareerScreen,
        setActiveNav
    };
})();
