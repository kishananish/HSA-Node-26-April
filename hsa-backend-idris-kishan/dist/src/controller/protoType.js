"use strict";

var method = {
    socket: {},
    setSocketObject: function setSocketObject(sock) {
        this.socket = sock;
    },
    getSocketObject: function getSocketObject() {
        return this.socket;
    }
};

module.exports = method;