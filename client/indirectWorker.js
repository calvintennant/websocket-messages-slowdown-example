queue = [];
onmessage = function(e) {
    var connectStr = 'connect';
    var connectPort = null;
    if (e.data.indexOf(connectStr) === 0) {
        connectPort = e.data.slice(connectStr.length);
        connect(connectPort);
    } else if (e.data === 'provide' && queue.length) {
        postMessage(JSON.stringify(queue));
        queue = [];
    }
};

function connect(_socketPort) {
    var socket = new WebSocket('ws://localhost:' + _socketPort);

    socket.onmessage = function(socketMessage) {
        var message = socketMessage.data;
        if (message[2] === '|' && message.length === 5) {
            queue.push(message);
        }
    };

    socket.onopen = function() {
        postMessage(JSON.stringify(queue));
        queue = [];
        socket.send('ping');
    };
}


