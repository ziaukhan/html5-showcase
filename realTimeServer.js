(function(){
    exports.initialize = function(io, socket ){

        function log(){
            var array = [">>> Message from server: "];
            for (var i = 0; i < arguments.length; i++) {
                array.push(arguments[i]);
            }
            socket.emit('log', array);
        }

        socket.on('message', function (message) {
            log('Got message: ', message);
            // For a real app, should be room only (not broadcast)
            socket.broadcast.emit('message', message);
        });

        socket.on('create or join', function (room) {
            var numClients = io.sockets.clients(room).length;

            log('Room ' + room + ' has ' + numClients + ' client(s)');
            log('Request to create or join room', room);

            if (numClients == 0){
                socket.join(room);
                socket.emit('created', room);
            } else if (numClients == 1) {
                io.sockets.in(room).emit('join', room);
                socket.join(room);
                socket.emit('joined', room);
            } else { // max two clients
                socket.emit('full', room);
            }
            socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
            socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

        });

    }
})();
