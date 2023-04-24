const method = {    
    socket: {},    
    setSocketObject: function (sock) {        
        this.socket = sock;
    },
    getSocketObject: function () {
        return this.socket;
    }
};

module.exports = method;
