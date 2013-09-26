( function () {

    "use strict";

    var signals = {
        created: {
            shapes: {
                rectangle: new Signal( null ),
                oval: new Signal( null ),
                triangle: new Signal( null )
            }
        },
        selected: {
            shapes: {
                rectangle: new Signal( "rectD3" ),
                oval: new Signal( "ovalD3" ),
                triangle: new Signal( "triangle" )
            }
        }
    };


    function initSignals() {

        signalsSVG.created.shapes.rectangle.add( svgEditor.tools.onRectCreated );
        signalsSVG.created.shapes.oval.add( svgEditor.tools.onOvalCreated );
        signalsSVG.created.shapes.triangle.add( svgEditor.tools.onTriangleCreated );

        signalsSVG.selected.shapes.rectangle.add( svgEditor.tools.onRectSelected );
        signalsSVG.selected.shapes.oval.add( svgEditor.tools.onOvalSelected );
        signalsSVG.selected.shapes.triangle.add( svgEditor.tools.onTriangleSelected );
    }

    signals.init = initSignals;

    util.namespace( "signalsSVG", signals );

} )();