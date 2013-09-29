( function () {

    "use strict";
    window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

    function initiateVideo(room){


        var localVideo = document.querySelector('#myVideo');
        var remoteVideo = document.querySelector('#hisVideo');

        var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
        var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};
        var media_constraints = {video: {
            mandatory: {
                maxWidth: 800,
                maxHeight: 600
            }
        }};

        var sdpConstraints = {'mandatory': {
            'OfferToReceiveAudio':true,
            'OfferToReceiveVideo':true }};

        var pc = null, localStream, remoteStream, isInitiator = false;

        //var room = null;//prompt("Enter Room");
        if(!room) return;

        window.onbeforeunload = function(e){
            sendMessage('bye');
        }

        //----->> - Socket Listenings - <<------

        window.socket = io.connect();

        if (room !== '') {
            console.log('Create or join room', room);
            socket.emit('create or join', room);
        }

        socket.on('created', function (room){
            console.log('Created room ' + room);
            console.log("You Are Hosting");
            isInitiator = true;
            initiateMedia();
        });

        socket.on('full', function (room){
            console.log('Room ' + room + ' is full');
            alert("Room is Full");
        });

        socket.on('offer', function(desc){
            console.log("Other Peer has offered");
            pc.setRemoteDescription(new RTCSessionDescription(desc));
            if (message.type === 'offer') {
                doAnswer();
            }
        })

        socket.on('join', function (room){
            console.log('Another peer joined the room ' + room);
        });

        socket.on('joined', function (room){
            console.log('You have Joined the Room' + room);
            initiateMedia();
        });

        socket.on('log', function (array){
            console.log.apply(console, array);
        });

        function sendMessage(message){
            console.log('Client sending message: ', message);
            socket.emit('message', message);
        }

        socket.on('message', function (message){
            console.log('Client received message:', message);
            if (message === 'got user media') {
                doCall();
            } else if (message.type === 'offer') {
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            } else if (message.type === 'answer') {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === 'candidate') {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                pc.addIceCandidate(candidate);
            } else if (message === 'bye') {
                handleRemoteHangup();
            }
        });

        ////////////////////////-----------------------////////////////////////////

        function initiateMedia(){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.getUserMedia(media_constraints, setupConnection, handleUserMediaError);

            console.log('Getting user media with constraints', media_constraints);
        }

        function setupConnection(stream){
            console.log('Adding local stream.');
            localVideo.src = window.URL.createObjectURL(stream);
            localStream = stream;
            initiateStream();
        }

        function initiateStream(){

            sendMessage('got user media');

            if(typeof localStream != 'undefined'){
                createPeerConnection();
                pc.addStream(localStream);
                if (location.hostname != "localhost") {
                    //requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
                }
            }
        }


/////////////////////////////////////////////////////////

        function createPeerConnection() {
            try {
                pc = new webkitRTCPeerConnection(pc_config, pc_constraints);
                pc.onicecandidate = handleIceCandidate;
                pc.onaddstream = handleRemoteStreamAdded;
                pc.onremovestream = handleRemoteStreamRemoved;
                console.log('Created RTCPeerConnnection');
            } catch (e) {
                console.log('Failed to create PeerConnection, exception: ' + e.message);
                alert('Cannot create RTCPeerConnection object.');
                return;
            }
        }

        function handleIceCandidate(event) {
            console.log('handleIceCandidate event: ', event);
            if (event.candidate) {
                sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate});
            } else {
                console.log('End of candidates.');
            }
        }

        function doCall() {
            console.log('Sending offer to peer');
            pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
        }

        function doAnswer() {
            console.log('Sending answer to peer.');
            pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
        }

        function setLocalAndSendMessage(sessionDescription) {
            // Set Opus as the preferred codec in SDP if Opus is present.
            sessionDescription.sdp = preferOpus(sessionDescription.sdp);
            pc.setLocalDescription(sessionDescription);
            console.log('setLocalAndSendMessage sending message' , sessionDescription);
            socket.emit("makeoffer", sessionDescription);
        }


        function handleRemoteStreamAdded(event) {
            console.log('Remote stream added.');
            remoteStream = event.stream;
            remoteVideo.src = window.URL.createObjectURL(event.stream);
        }

        function hangup() {
            console.log('Hanging up.');
            stop();
            sendMessage('bye');
        }

        function handleRemoteHangup() {
            console.log('Session terminated.');
            //stop();
            // isInitiator = false;
        }

        function stop() {
            // isAudioMuted = false;
            // isVideoMuted = false;
            pc.close();
            pc = null;
        }

///////////////////////////////////////////

        function requestTurn(turn_url) {
            var turnExists = false;
            for (var i in pc_config.iceServers) {
                if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
                    turnExists = true;
                    //turnReady = true;
                    break;
                }
            }
            if (!turnExists) {
                console.log('Getting TURN server from ', turn_url);
                // No TURN server. Get one from computeengineondemand.appspot.com:
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(){
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var turnServer = JSON.parse(xhr.responseText);
                        console.log('Got TURN server: ', turnServer);
                        pc_config.iceServers.push({
                            'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
                            'credential': turnServer.password
                        });
                        //turnReady = true;
                    }
                };
                xhr.open('GET', turn_url, true);
                xhr.send();
            }
        }

// Set Opus as the default audio codec if it's present.
        function preferOpus(sdp) {
            var sdpLines = sdp.split('\r\n');
            var mLineIndex;
            // Search for m line.
            for (var i = 0; i < sdpLines.length; i++) {
                if (sdpLines[i].search('m=audio') !== -1) {
                    mLineIndex = i;
                    break;
                }
            }
            if (mLineIndex === null) {
                return sdp;
            }

            // If Opus is available, set it as the default in m line.
            for (i = 0; i < sdpLines.length; i++) {
                if (sdpLines[i].search('opus/48000') !== -1) {
                    var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                    if (opusPayload) {
                        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
                    }
                    break;
                }
            }

            // Remove CN in m line and sdp.
            sdpLines = removeCN(sdpLines, mLineIndex);

            sdp = sdpLines.join('\r\n');
            return sdp;
        }

        function extractSdp(sdpLine, pattern) {
            var result = sdpLine.match(pattern);
            return result && result.length === 2 ? result[1] : null;
        }

// Set the selected codec to the first in m line.
        function setDefaultCodec(mLine, payload) {
            var elements = mLine.split(' ');
            var newLine = [];
            var index = 0;
            for (var i = 0; i < elements.length; i++) {
                if (index === 3) { // Format of media starts from the fourth.
                    newLine[index++] = payload; // Put target payload to the first.
                }
                if (elements[i] !== payload) {
                    newLine[index++] = elements[i];
                }
            }
            return newLine.join(' ');
        }

// Strip CN from sdp before CN constraints is ready.
        function removeCN(sdpLines, mLineIndex) {
            var mLineElements = sdpLines[mLineIndex].split(' ');
            // Scan from end for the convenience of removing an item.
            for (var i = sdpLines.length-1; i >= 0; i--) {
                var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
                if (payload) {
                    var cnPos = mLineElements.indexOf(payload);
                    if (cnPos !== -1) {
                        // Remove CN payload from m line.
                        mLineElements.splice(cnPos, 1);
                    }
                    // Remove CN line in sdp
                    sdpLines.splice(i, 1);
                }
            }

            sdpLines[mLineIndex] = mLineElements.join(' ');
            return sdpLines;
        }

        function handleUserMediaError(error){
            console.log('Your Device Connection Failed ', error);
            alert('Your Device Connection Failed');
        }

        function handleRemoteStreamRemoved(event) {
            alert('Remote stream removed. Event: ');
        }

        function handleCreateOfferError(event){
            console.log('createOffer() error: ', e);
        }
    }


    util.namespace( "realTime.streaming", {
        initiateVideo: initiateVideo
    } );
})();