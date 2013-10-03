( function () {

    "use strict";
    window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

    function initiateVideo(room){


        var localVideo = document.querySelector('#myVideo');
        var remoteVideo = document.querySelector('#hisVideo');

        var partnerWaitingInfo = { msg: 'Tell Your Partner to Join this Room!'};

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

        var pc = null, localStream, remoteStream;

        //var room = null;//prompt("Enter Room");
        if(!room) return;

        window.onbeforeunload = function(e){
            hangup();
        }

        //----->> - Socket Listenings - <<------

        window.socket = io.connect();

        if (room) {
            console.log('Requested for a room: ', room);
            socket.emit('create or join', room);
        }

        socket.on('created', function (room){
            realTime.view.changeRoomText(room);
            console.log('Created room ' + room);
            console.log("--- You Are Hosting ---");
            realTime.view.makeAlert({ type: 'success', msg: 'Created Room \"' + room + "\""}, 3000);
            realTime.view.makeAlert(partnerWaitingInfo, null);
            //isInitiator = true;
            initiateMedia();
        });

        socket.on('full', function (room){
            console.log('Room ' + room + ' is full');
            realTime.view.makeAlert({ type: 'error', msg: 'Room: \"'+ room + '\" is Full, Try Another!'}, null);
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
            realTime.view.removeAlert(partnerWaitingInfo);
            realTime.view.makeAlert({ type: 'success', msg: 'Some One Joined your Room \"' + room + "\""}, 3000);
        });

        socket.on('joined', function (room){
            console.log('--- You have Joined the Room: ' + room+" ---");
            realTime.view.changeRoomText(room);
            realTime.view.makeAlert({ type: 'success', msg: 'Joined the Room \"' + room + "\""}, 3000);
            initiateMedia();
        });

        socket.on('log', function (array){
            console.log.apply(console, array);
        });

        socket.on('bye', function (){
            handleRemoteHangup();
        });

        function sendMessage(message){
            console.log('Client sending message: ', message);
            socket.emit('message', message);
        }

        socket.on('message', function (message){
            console.log('Client received message:', message);
            if (message === 'got user media') {
                realTime.view.changeHisVideoText("Connecting....");
                doCall();
            } else if (message.type === 'offer') {
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            } else if (message.type === 'answer') {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === 'candidate') {
                console.log("candidate")
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                pc.addIceCandidate(candidate);
            }
        });

        ////////////////////////-----------------------////////////////////////////

        function initiateMedia(){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.getUserMedia(media_constraints, setupConnection, handleUserMediaError);
            createPeerConnection();

            console.log('Getting user media with constraints', media_constraints);
            realTime.view.changeMyVideoText("Loading Camera....");
            realTime.view.changeHisVideoText("no one connected");
        }

        function setupConnection(stream){
            console.log('Adding local stream.');
            realTime.view.changeMyVideoText(null);
            localVideo.src = window.URL.createObjectURL(stream);
            localStream = stream;
            initiateStream();
        }

        function initiateStream(){

            sendMessage('got user media');

            if(typeof localStream != 'undefined'){
                pc.addStream(localStream);
                //if (location.hostname != "localhost") {
                    //requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
                //}
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
            realTime.view.changeHisVideoText(null);
            remoteStream = event.stream;
            remoteVideo.src = window.URL.createObjectURL(event.stream);
        }

        function hangup() {
            console.log('Hanging up.');
            pc.removeStream(localStream);
            stop();
            socket.emit('tellbye');
            //sendMessage('bye');
        }

        function handleRemoteHangup() {
            if(remoteStream){
                console.log('Session terminated.');
                realTime.view.makeAlert({ type: 'error', msg: 'Person has Left the Room, Remote stream removed'},5000);
                realTime.view.changeHisVideoText("no one connected");
                pc.removeStream(remoteStream);
                remoteVideo.src = "";
                remoteStream = null;
            }
        }

        function stop() {
            // isAudioMuted = false;
            // isVideoMuted = false;
            pc.close();
            pc = null;
        }
        function handleUserMediaError(error){
            initiateStream();
            realTime.view.changeMyVideoText("No Camera");
            console.log('Your Device Connection Failed ', error);
            realTime.view.makeAlert({ type: 'error', msg: 'Your Device Connection Failed, check Video Icon on top right'}, null);
            realTime.view.changeMyVideoText("no camera");
            realTime.view.changeHisVideoText("no one connected");
        }

        function handleRemoteStreamRemoved(event) {
            realTime.view.makeAlert({ type: 'error', msg: 'Person Lefts the Room, Remote stream removed'},5000);
            realTime.view.changeHisVideoText("no one connected");
        }

        function handleCreateOfferError(event){
            realTime.view.makeAlert({ type: 'error', msg: 'SomeThing Wrong!'}, null);
            console.log('createOffer() error: ', e);
        }

///////////////////////////////////////////

        /*function requestTurn(turn_url) {
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
        }*/
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

    }


    util.namespace( "realTime.streaming", {
        initiateVideo: initiateVideo
    } );
})();