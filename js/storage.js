(function () {
    "use strict";

    const Storage = {
        read(key) {
            try {
                const raw = window.localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                return null;
            }
        },

        write(key, value) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                return false;
            }
        },

        has(key) {
            try {
                return Boolean(window.localStorage.getItem(key));
            } catch (error) {
                return false;
            }
        },

        remove(key) {
            try {
                window.localStorage.removeItem(key);
                return true;
            } catch (error) {
                return false;
            }
        }
    };

    window.EGStorage = Storage;
})();
