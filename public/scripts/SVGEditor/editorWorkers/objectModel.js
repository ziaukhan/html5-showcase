( function () {
    "use strict";

    function createSVGCanvas( parentContainerD3, $compile, scope ) {
        var d3SVG = parentContainerD3.append( "svg" ).attr( 'id', "SVGCanvas" );

        var backgroundGD3 = d3SVG.append( "g" ).attr( 'class', "backgroundG" )
            .style( 'transform', "transform: matrix(1, 0, 0, 1, 0, 0);" )
            .attr( 'transform', " matrix(1, 0, 0, 1, 0, 0)" );

        var slideGD3 = backgroundGD3.append( "g" ).attr( 'class', "slideG" );
        backgroundGD3.append( "g" ).attr( 'class', "adonersG" );

        d3SVG.append( "g" ).attr( 'class', "radialMenuAdoner" );


        //slideGD3.append( "rect" ).attr( { x: 1000, y: 50, width: 50, height: 50, fill: "orange" } ).attr( 'class', "rect" );
        //should just append it compile not required
        $compile( frameModel.frameSvg )( scope ).appendTo( parentContainerD3 );

        return d3SVG;
    }

    var frameModel = {
        frameSvg: "<svg version='1.0' id='frameLayer' xmlns='http://www.w3.org/2000/svg' x='0' y='0' viewBox='0 0 1366 768' style='' enable-background='new 0 0 1295.255 677' xml:space='preserve' pointer-events='none'>"
            + "<g transform='translate(60, 45)'>"
            + "<g pointer-events='all'><g class='selectedCreationToolIconsG'></g></g>"
            //+ "<circle id='frameAlignmentCircle' cx='30' cy='36' fill='transparent' r='15' />"
            + "<g>"
            + "<g <!--id='frameAxis'-->>"
            + "</g>"
            + "<g>"
            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' x1='1191.614' y1='671.896' x2='1186.114' y2='671.896'/>"

            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' stroke-dasharray='11.0034,11.0034' x1='1175.111' y1='671.896' x2='102.282' y2='671.896'/>"
            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' x1='96.78' y1='671.896' x2='91.28' y2='671.896'/>"
            + "</g>"
            + "</g>"
            + "<g>"
            + "<polyline fill='none' stroke='#3C3B3C' stroke-width='3' stroke-miterlimit='10' points='59.087,632.252 59.087,671.752  98.641,671.752'/>"
            + "<g>"
            + "<g>"
            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' x1='59.614' y1='642.152' x2='59.614' y2='636.652'/>"

            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' stroke-dasharray='11.151,11.151' x1='59.614' y1='625.501' x2='59.614' y2='51.227'/>"
            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' x1='59.614' y1='45.651' x2='59.614' y2='40.151'/>"
            + "</g>"
            + "</g>"
            + "<g>"
            + "<g>"
            + "<line fill='none' stroke='#3C3B3C ' stroke-miterlimit='10' x1='1238.387' y1='639.651' x2='1238.387' y2='634.151'/>"

            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' stroke-dasharray='11.1509,11.1509' x1='1238.387' y1='623' x2='1238.387' y2='48.727'/>"
            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' x1='1238.387' y1='43.151' x2='1238.387' y2='37.651'/>"
            + "</g>"
            + "</g>"
            + "<g>"
            + "<g>"
            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' x1='1211.614' y1='8.895' x2='1206.114' y2='8.895'/>"

            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' stroke-dasharray='11.0248,11.0248' x1='1195.09' y1='8.895' x2='98.126' y2='8.895'/>"
            + "<line fill='none' stroke='#3C3B3C' stroke-miterlimit='10' x1='92.614' y1='8.895' x2='87.114' y2='8.895'/>"
            + "</g>"
            + "</g>"
            + "<polyline fill='none' stroke='#3C3B3C' stroke-width='3' stroke-miterlimit='10' points='1199.17,672.085 1238.67,672.085 1238.67,632.531'/>"
            + "<polyline fill='none' stroke='#3C3B3C' stroke-width='3' stroke-miterlimit='10' points='1238.363,48.43 1238.363,8.93 1198.81,8.93'/>"
            + "<polyline fill='none' stroke='#3C3B3C' stroke-width='3' stroke-miterlimit='10' points='59.811,47.43 59.811,7.93 99.364,7.93'/>"
            + "<path fill='#3C3B3C' d='M29.642,6.5c-0.047,0-0.092-0.003-0.139-0.003C13.209,6.497,0,19.707,0,36"
            + " c0,16.294,13.209,29.503,29.503,29.503c10.526,0,19.759-5.517,24.981-13.813h0.019c0.278-0.588,1.771-3.368,5.317-4.262V14.74"
            + " v-3.281V6.5H29.642z M29.503,58.352C17.159,58.352,7.152,48.344,7.152,36s10.007-22.351,22.351-22.351"
            + " c12.345,0,22.352,10.007,22.352,22.351S41.848,58.352,29.503,58.352z'/>"
            + "</g>"
            + "</g>"
            + "</svg>"
    };

    util.namespace( "svgEditor.objectModel", {
        createSVGCanvas: createSVGCanvas
    } );

} )();