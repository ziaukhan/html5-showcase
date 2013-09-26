( function () {
    "use strict";

    function getMenuRadius() {
        if ( window.navigator.msMaxTouchPoints ) {
            // touch device
            if ( window.screen.width >= 1920 ) {
                return 160;     //160;
            }
            else if ( window.screen.width >= 1366 ) {
                return 170;      //170;
            }
            else {
                return 150;      //150;
            }
        }
        return 125;  // for non-touch device
    }

    window.EditorHelper = { view: { zoomFactor: 1 } };      //temp

    util.namespace( "svgEditor.constants", {
        menuRadius: new util.Accessor( function () {
            return getMenuRadius();
        } ),
        adonerCircleRadius: new util.Accessor( function () {
            return 10 /*/ EditorHelper.view.zoomFactor*/;
        } ),
        adonerHiddenCircleRadius: new util.Accessor( function () {
            return 10 /*/ EditorHelper.view.zoomFactor*/;
        } ),
        adonerRectPad: new util.Accessor( function () {
            return 20;
        } ),
        initialSize: new util.Accessor( function () {
            return 80;
        } ),
        pt: new util.Accessor( function () {
            return document.querySelector( ".svg_editor uc-shapes-editor #SVGCanvas" ).createSVGPoint();
        } )
    } );

    util.namespace( "svgEditor.viewConstants", {
        zoomOutLimit: new util.Accessor( function () {
            return getMenuRadius();
        } )
    } );


    util.namespace( "svgEditor", {
        canvasD3: new util.Accessor( function () {
            return d3.select( ".svg_editor uc-shapes-editor" );
        } ),
        d3Svg: new util.Accessor( function () {
            return d3.select( ".svg_editor #SVGCanvas" );
        } ),
        backgroundGD3: new util.Accessor( function () {
            return d3.select( ".svg_editor #SVGCanvas .backgroundG" );
        } ),
        slideGD3:  new util.Accessor( function () {
            return d3.select( ".svg_editor #SVGCanvas .slideG" );
        } ),
        adonersGD3: new util.Accessor( function () {
            return d3.select( ".svg_editor #SVGCanvas .adonersG" );
        } ),
        d3IconG: new util.Accessor( function () {
            return d3.select( ".svg_editor #frameLayer .selectedCreationToolIconsG" );
        } ),
        d3menuG: new util.Accessor( function () {
            return d3.select( ".svg_editor #SVGCanvas .radialMenuAdoner" );
        } )
    } );
} )();