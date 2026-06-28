(function () {
    "use strict";

    function EventBus() {
        this.listeners = {};
    }

    EventBus.prototype.on = function (event, callback) {
        if (!event || typeof callback !== "function") return function () {};
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        var self = this;
        return function unsubscribe() {
            self.off(event, callback);
        };
    };

    EventBus.prototype.off = function (event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(function (listener) {
            return listener !== callback;
        });
    };

    EventBus.prototype.emit = function (event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].slice().forEach(function (callback) {
            try {
                callback(data);
            } catch (error) {
                return null;
            }
        });
    };

    window.EventBus = window.EventBus || new EventBus();
}());
