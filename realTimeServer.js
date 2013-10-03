(function(){
    exports.initialize = function(io, socket ){

        var room = null;
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
            socket.broadcast.to(room).emit('message', message);
        });

        socket.on('create or join', function (_room) {
            var numClients = io.sockets.clients(_room).length;

            log('Room ' + _room + ' has ' + numClients + ' client(s)');
            log('Request to create or join room: ', _room);

            if (numClients == 0){
                room = _room;

                socket.join(room);
                socket.emit('created', room);
            } else if (numClients == 1) {
                room = _room;

                io.sockets.in(room).emit('join', room);
                socket.join(room);
                socket.emit('joined', room);
            } else { // max two clients
                socket.emit('full', _room);
            }
            socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
            socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

        });

        socket.on('makeoffer',function(desc){
            socket.broadcast.to(room).emit('message', desc);
        });

        socket.on('disconnect', function () {
            socket.broadcast.to(room).emit('bye', null);
            socket.leave(room);
        });

        socket.on('tellbye', function () {
            socket.broadcast.to(room).emit('bye', null);
            socket.leave(room);
        });

    }
})();
