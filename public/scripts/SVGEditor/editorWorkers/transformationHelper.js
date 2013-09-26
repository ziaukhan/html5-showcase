( function () {
    "use strict";

    function drawCircleOnScreen( x, y, color, radius ) {
        var adonersGD3 = d3.select( "#canvas .adonersG" );
        adonersGD3.append( "circle" ).attr( {
            fill: color,
            cx: x,
            cy: y,
            r: radius || 20,
            opacity: "0.5"
        } );
    }

    function drawAlignmentCirclesOnScreen() {
        /*test code*/
        var point = getScreenTopLeft();
        drawCircleOnScreen( point.x, point.y, "red" );

        point = getScreenTopRight();
        drawCircleOnScreen( point.x, point.y, "Green" );

        point = getScreenCenterPoint();
        drawCircleOnScreen( point.x, point.y, "Blue" );

        point = getScreenBottomLeft();
        drawCircleOnScreen( point.x, point.y, "yellow" );

        point = getScreenBottomRight();
        drawCircleOnScreen( point.x, point.y, "aqua" );
        /*-----*/
    }

    function getTranformationPoint( x, y ) {        //reference: http://jsfiddle.net/DgMDV/
        //give a screen point and get the point relative to background rectangle point
        var backgroundG = document.querySelector( ".svg_editor uc-shapes-editor .backgroundG" );

        var pt = svgEditor.constants.pt;

        var mat = backgroundG.getScreenCTM();//changed from backgroundG to svg
        var matInv = mat.inverse();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform( matInv );
    }

    function getTransformationFromNode( node, x, y ) {
        var pt = svgEditor.constants.pt;

        var mat = node.getCTM();//changed from backgroundG to svg
        var matInv = mat.inverse();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform( matInv );

    }

    function getReverseTransformationFromNode( node, x, y ) {
        var pt = svgEditor.constants.pt;

        var mat = node.getCTM();//changed from backgroundG to svg
        //var matInv = mat.inverse();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform( mat );

    }

    function getReverseTranformationPoint( x, y ) {        //reference: http://jsfiddle.net/DgMDV/
        //give a background rectangle point and get the point relative to screen point
        var backgroundG = document.querySelector( "uc-shapes-editor .backgroundG" );

        var pt = svgEditor.constants.pt;
        var mat = backgroundG.getScreenCTM();//changed from backgroundG to svg
        //var matInv = mat;
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform( mat );
    }

    function getTranformationPointFromSVG( x, y ) {        //reference: http://jsfiddle.net/DgMDV/
        //give a screen point and get the point relative to background rectangle point
        var svg = document.querySelector( "uc-shapes-editor #SVGCanvas" );

        var pt = svgEditor.constants.pt;
        var mat = svg.getScreenCTM();//changed from backgroundG to svg
        var matInv = mat.inverse();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform( matInv );
    }

    function getReverseTranformationPointFromSVG( x, y ) {        //reference: http://jsfiddle.net/DgMDV/
        //give a background rectangle point and get the point relative to screen point
        var svg = document.querySelector( "uc-shapes-editor #SVGCanvas" );

        var pt = svgEditor.constants.pt;
        var mat = svg.getScreenCTM();//changed from backgroundG to svg
        //var matInv = mat;
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform( mat );
    }

    function getScreenTopLeft() {

        return getTranformationPoint( 0, 0 );
    }

    function getScreenTopRight() {

        return getTranformationPoint( window.innerWidth, 0 );
    }

    function getScreenCenterPoint() {
        return getTranformationPoint( window.innerWidth / 2, window.innerHeight / 2 );
    }

    function getScreenRotatedCenterPoint( node ) {

        return getTransformationFromNode( node, window.innerWidth / 2, window.innerHeight / 2 );
    }

    function getScreenBottomLeft() {

        return getTranformationPoint( 0, window.innerHeight );
    }

    function getScreenBottomRight() {

        return getTranformationPoint( window.innerWidth, window.innerHeight );
    }

    function transformBackgroundGToMenuG( x, y ) {

        var svg = document.querySelector( ".svg_editor svg" );
        var pt = svg.createSVGPoint();
        var backgroundG = document.querySelector( ".svg_editor uc-shapes-editor .backgroundG" );
        var menuG = document.querySelector( ".svg_editor #SVGCanvas .radialMenuAdoner" );
        var mat = backgroundG.getTransformToElement( menuG );

        pt.x = x;
        pt.y = y;
        return pt.matrixTransform( backgroundG.getTransformToElement( menuG ) );
    }

    util.namespace( "svgEditor.helper", {
        drawCircleOnScreen: drawCircleOnScreen,
        drawAlignmentCirclesOnScreen: drawAlignmentCirclesOnScreen,

        /*getScreenTopLeft: getScreenTopLeft,
		getScreenTopRight: getScreenTopRight,
		getScreenCenterPoint: getScreenCenterPoint,
		getScreenBottomLeft: getScreenBottomLeft,
		getScreenBottomRight: getScreenBottomRight,*/

        /*getTranformationPoint: getTranformationPoint,
		getReverseTranformationPoint: getReverseTranformationPoint,

		getTransformationFromNode: getTransformationFromNode,
		getReverseTransformationFromNode: getReverseTransformationFromNode,*/

        getTranformationPointFromSVG: getTranformationPointFromSVG,
        getReverseTranformationPointFromSVG: getReverseTranformationPointFromSVG
        /*getScreenRotatedCenterPoint:getScreenRotatedCenterPoint,
		transformBackgroundGToMenuG: transformBackgroundGToMenuG*/

    } );

} )();