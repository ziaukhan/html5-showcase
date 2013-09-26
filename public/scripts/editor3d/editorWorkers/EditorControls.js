/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.EditorControls = function ( object, domElement, canvas ) {

	domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	// internals

	var scope = this;
	var vector = new THREE.Vector3();

	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	var center = new THREE.Vector3();
	var normalMatrix = new THREE.Matrix3();

	// events

	var changeEvent = { type: 'change' };

	this.focus = function ( target ) {

		center.getPositionFromMatrix( target.matrixWorld );
		object.lookAt( center );

		scope.dispatchEvent( changeEvent );

	};

	this.pan = function ( distance ) {

		normalMatrix.getNormalMatrix( object.matrix );

		distance.applyMatrix3( normalMatrix );
		distance.multiplyScalar( vector.copy( center ).sub( object.position ).length() * 0.001 );

		object.position.add( distance );
		center.add( distance );

		scope.dispatchEvent( changeEvent );

	};

	this.zoom = function ( distance ) {

		normalMatrix.getNormalMatrix( object.matrix );

		distance.applyMatrix3( normalMatrix );
		distance.multiplyScalar( vector.copy( center ).sub( object.position ).length() * 0.001 );

	    object.position.add( distance );
		//pNext3d.animations.moveCameraAsync( object.position.clone().add( distance ), 100 );     //cusom addition

		scope.dispatchEvent( changeEvent );

	};

	this.rotate = function ( delta ) {

		vector.copy( object.position ).sub( center );

		var theta = Math.atan2( vector.x, vector.z );
		var phi = Math.atan2( Math.sqrt( vector.x * vector.x + vector.z * vector.z ), vector.y );

		theta += delta.x;
		phi += delta.y;

		var EPS = 0.000001;

		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = vector.length();

		vector.x = radius * Math.sin( phi ) * Math.sin( theta );
		vector.y = radius * Math.cos( phi );
		vector.z = radius * Math.sin( phi ) * Math.cos( theta );

		object.position.copy( center ).add( vector );

		object.lookAt( center );

		scope.dispatchEvent( changeEvent );

	};

	this.removeAllEvents = function () {
	    //---- custom change :::
	    canvas.addEventListener( 'pointerdown', onMouseDown, false );

        //khurram
	    //signals3d.editorControlEvents.MSPointerDown.remove( onMouseDown );
	    //----******************

	    domElement.addEventListener( 'mousewheel', onMouseWheel, false );

	    canvas.removeEventListener( 'pointermove', onMouseMove, false );
        document.removeEventListener( 'pointerup', onMouseUp, false );

	    state = STATE.NONE;
	};

	// mouse
	var mousePrevPosition;
	function onMouseDown( event ) {

        if(event.target.nodeName =="CANVAS"){


		if ( scope.enabled === false ) return;

		//event.preventDefault();
		mousePrevPosition = [event.clientX, event.clientY];

		if ( event.button === 0 ) {

			state = STATE.ROTATE;

		} else if ( event.button === 1 ) {

			state = STATE.ZOOM;

		} else if ( event.button === 2 ) {

			state = STATE.PAN;

		}

		canvas.addEventListener( 'pointermove', onMouseMove, false );
            document.addEventListener( 'pointerup', onMouseUp, false );

	}

    }
	function onMouseMove( event ) {





		if ( scope.enabled === false ) return;

		//event.preventDefault();

		var movementX = event.movementY || event.webkitMovementX || event.mozMovementX || event.oMovementX;
		var movementY = event.movementY || event.webkitMovementY || event.mozMovementY || event.oMovementY;

		movementX = movementX || ( event.clientX - mousePrevPosition[0] ) || 0;
		movementY = movementY || ( event.clientY - mousePrevPosition[1] ) || 0;
		mousePrevPosition = [event.clientX, event.clientY];

		if ( state === STATE.ROTATE ) {

			scope.rotate( new THREE.Vector3( - movementX * 0.005, - movementY * 0.005, 0 ) );

		} else if ( state === STATE.ZOOM ) {
		    console.log( movementY );
			scope.zoom( new THREE.Vector3( 0, 0, movementY ) );

		} else if ( state === STATE.PAN ) {

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}


	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		canvas.removeEventListener( 'pointermove', onMouseMove, false );
        document.removeEventListener( 'pointerup', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = - event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = event.detail * 10;

		}

		scope.zoom( new THREE.Vector3( 0, 0, delta ) );

       event.stopPropagation();
        event.preventDefault();
	}

    //domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

    //---- custom change :::
	//domElement.addEventListener( 'MSPointerDown', onMouseDown, false );

    //khurram
   //signals3d.editorControlEvents.MSPointerDown.add( onMouseDown );
    //----******************

    canvas.addEventListener( 'pointerdown', onMouseDown, false );
	domElement.addEventListener( 'mousewheel', onMouseWheel, false );


    canvas.addEventListener("pointerenter", function(e){
        window.getSelection().removeAllRanges();
    });



    //window.getSelection().removeAllRanges();

	domElement.focus()
	/*domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	// touch

	var touch = new THREE.Vector3();
	var prevTouch = new THREE.Vector3();
	var prevDistance = null;

	function touchStart( event ) {

		if ( scope.enabled === false ) return;

		var touches = event.touches;

		switch ( touches.length ) {

			case 2:
				var dx = touches[ 0 ].pageX - touches[ 1 ].pageX;
				var dy = touches[ 0 ].pageY - touches[ 1 ].pageY;
				prevDistance = Math.sqrt( dx * dx + dy * dy );
				break;

		}

		prevTouch.set( touches[ 0 ].pageX, touches[ 0 ].pageY, 0 );

	}

	function touchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var touches = event.touches;

		touch.set( touches[ 0 ].pageX, touches[ 0 ].pageY, 0 );

		switch ( touches.length ) {

			case 1:
				scope.rotate( touch.sub( prevTouch ).multiplyScalar( - 0.005 ) );
				break;

			case 2:
				var dx = touches[ 0 ].pageX - touches[ 1 ].pageX;
				var dy = touches[ 0 ].pageY - touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );
				scope.zoom( new THREE.Vector3( 0, 0, prevDistance - distance ) );
				prevDistance = distance;
				break;

			case 3:
				scope.pan( touch.sub( prevTouch ).setX( - touch.x ) );
				break;

		}

		prevTouch.set( touches[ 0 ].pageX, touches[ 0 ].pageY, 0 );

	}

	domElement.addEventListener( 'touchstart', touchStart, false );
	domElement.addEventListener( 'touchmove', touchMove, false );*/

};

//THREE.EditorControls.prototype = Object.create( THREE.EventDispatcher.prototype );


