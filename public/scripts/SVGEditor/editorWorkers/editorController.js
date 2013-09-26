( function () {
    "use strict";

    //----->> - Pointer Controls - <<-----

    function takeControl() {
        svgEditor.d3Svg.on( "mousedown", onMouseSlideDown );
    }
    function removeControl() {
        svgEditor.d3Svg.on( "mousedown", null );
    }

    function onMouseSlideDown() {
        if ( d3.event.button === 0 ) {

            var srcElement = d3.event.srcElement;
            var srcElementD3 = d3.select( srcElement );
            var slideGChild = svgEditor.helper.selectElementByParentClass( srcElement, "slideG" );
            var slideGChildD3 = d3.select( slideGChild );

            var cord = d3.mouse( svgEditor.d3menuG.node() );

            if ( slideGChild ) {

                if ( slideGChildD3.classed( "rect" ) ) {
                    signalsSVG.selected.shapes.rectangle.dispatch( slideGChildD3 );
                } else if ( slideGChildD3.classed( "oval" ) ) {
                    signalsSVG.selected.shapes.oval.dispatch( slideGChildD3 );
                } else if ( slideGChildD3.classed( "triangle" ) ) {
                    signalsSVG.selected.shapes.triangle.dispatch( slideGChildD3 );
                }
            }
            else {
                svgEditor.tools.setAdonerTool( null );
                svgEditor.menu.showMain( cord[0], cord[1] );
            }
        }
    }

    //----->> - View Controls - <<-----

    function setZoomAsync( magnifyFactor ) {


    }



    //----->> - Interface - <<-----

    util.namespace( "svgEditor.controls.keyboard", {
        keyDown: {
            'left': null,
            'right': null,
            'up': null,
            'down': null
        }
    } );

    util.namespace( "svgEditor.view", {
        setZoomAsync: setZoomAsync
    } );

    util.namespace( "svgEditor.controls", {
        takeControl: takeControl,
        removeControl: removeControl
    } );

} )();