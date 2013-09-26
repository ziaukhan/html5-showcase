( function () {

    "use strict";

    function selectElementByParentClass( node, parentClassName ) {
        if ( node.tagName === "DIV" ) {
            return null;
        } else {
            if ( d3.select( node.parentNode ).classed( parentClassName ) || node.parentNode.getAttribute( 'data-type' ) == "group" ) {
                return node;
            }
            else {
                return selectElementByParentClass( node.parentNode, parentClassName );
            }
        }
    }


    function focusObject( objectNode, svgPoint ) {
        var objectBox = objectNode.getBBox();
        var bMat = objectNode.getCTM();
        bMat.e = bMat.f = 0;
        svgPoint.x = objectBox.width;
        svgPoint.y = objectBox.height;
        svgPoint = svgPoint.matrixTransform( bMat );

        var width = Math.abs( svgPoint.x ) + svgEditor.constants.adonerRectPad * 2 + 140;
        var height = Math.abs( svgPoint.y ) + svgEditor.constants.adonerRectPad * 2 + 80;
        var widthPercent = svgEditor.canvasD3.node().offsetWidth / width - 0.02;
        var heightPercent = svgEditor.canvasD3.node().offsetHeight / height - 0.02;

        if ( widthPercent < 1 || heightPercent < 1 ) {
            var magnifyFactor = Math.floor(( Math.min( widthPercent, heightPercent ) * 100 * EditorHelper.view.zoomFactor ) / 5 ) * 5 - 5;
            if ( magnifyFactor <= 0.1 ) {
                magnifyFactor = svgEditor.viewConstants.zoomOutLimit;
            }
            svgEditor.view.setZoomAsync( magnifyFactor );
        }
    }

    util.namespace( "svgEditor.helper", {
        selectElementByParentClass: selectElementByParentClass,
        focusObject: focusObject
    } );

} )();