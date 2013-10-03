( function () {
    "use strict";

    var creationTool = null, adonerTool = null;


    function setCreationTool( tool ) {
        if ( creationTool ) {
            creationTool.dispose();
            svgEditor.controls.takeControl();
        }
        creationTool = tool;
        if ( tool ) {
            svgEditor.controls.removeControl();
            svgEditor.menu.remove();
            creationTool.init();
        }
    }

    function setAdonerTool( tool ) {
        svgEditor.menu.remove();
        if ( adonerTool ) {
            adonerTool.dispose();
            svgEditor.adonersGD3.selectAll( "*" ).remove();
        }
        adonerTool = tool;
        if ( tool ) {
            svgEditor.adonersGD3.selectAll( "*" ).remove();
            adonerTool.init();
        }
    }


    function createButton( imageData, fn, tooltipText, animationFlag ) {

        var g = svgEditor.d3IconG;
        g.selectAll( "*" ).remove();

        //if (tooltipText) {
        //tools.addTooltip(g, tooltipText + " Click to deselect tool.");
        //} else {
        //tools.addTooltip(g, "Click to deselect tool");
        //}

        var visibleCircle = g.append( "circle" ).attr( {
            "class": "toolSelectionPart",
            cx: "29.5",
            cy: "36.5",
            r: "19.5",
            fill: "#3C3C3C"
        } );

        if ( animationFlag ) {
            //tools.playSound("toolSelectionClicked");
            visibleCircle.transition()
                .duration( 2000 )
                .ease( "elastic" )
                .attr( "r", 19.5 );
        }
        g.append( "circle" ).attr( {
            "class": "toolSelectionPartHidden",
            cx: "29.5",
            cy: "36.5",
            r: 35,
            fill: "transparent"
            //opacity: 0.3,
            //fill: "red",
        } );
        g.append( "image" ).attr( {
            "xlink:href": imageData.href,
            x: 29.5 + imageData.x,
            y: 36.5 + imageData.y,
            height: imageData.width,
            width: imageData.height
        } );
        g.on( "pointerdown", function () {
            d3.event.stopPropagation();
            fn();
        } );
    }

    function generateElementID() {
        // always start with a letter (for DOM friendlyness)
        var idstr = String.fromCharCode( Math.floor(( Math.random() * 25 ) + 65 ) );
        do {
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var ascicode = Math.floor(( Math.random() * 42 ) + 48 );
            if ( ascicode < 58 || ascicode > 64 ) {
                // exclude all chars between : (58) and @ (64)
                idstr += String.fromCharCode( ascicode );
            }
        } while ( idstr.length < 8 );


        return ( idstr );
    }

    function calculateMenuLocation( x, y ) {

        var matrix = svgEditor.backgroundGD3.node().getCTM();
        var svg = svgEditor.d3Svg.node();

        var screen = svgEditor.helper.getReverseTranformationPointFromSVG( x, y );
        screen.x -= 80;
        screen.y -= 10;

        var menuRadious = svgEditor.constants.menuRadius;//(135 + 100);
        var pad = 2;

        if ( screen.x > svg.offsetWidth - menuRadious - pad ) {
            screen.x = svg.offsetWidth - menuRadious - pad;
        }
        if ( screen.x < svg.offsetLeft + menuRadious + pad ) {
            screen.x = svg.offsetLeft + menuRadious + pad;
        }

        if ( screen.y > svg.offsetHeight - menuRadious - pad ) {
            screen.y = svg.offsetHeight - menuRadious - pad;
        }
        if ( screen.y < svg.offsetTop + menuRadious + pad ) {
            screen.y = svg.offsetTop + menuRadious + pad;
        }

        var rect = svgEditor.helper.getTranformationPointFromSVG( screen.x, screen.y );

        return { x: rect.x, y: rect.y };
    }

    var creationToolAbstract = window.util.defineClass( function () {

        this.canvasD3 = svgEditor.canvasD3;
        this.d3Svg = svgEditor.d3Svg;
        this.adonersGD3 = svgEditor.adonersGD3;
        this.backgroundGD3 = svgEditor.backgroundGD3;
        this.slideGD3 = svgEditor.slideGD3;
    },
        {
            createButton: createButton,
            generateElementID: generateElementID
        }
    );

    var adonerToolAbstract = window.util.defineClass( function () {

        this.d3Svg = svgEditor.d3Svg;
        this.adonersGD3 = svgEditor.adonersGD3;
    },
        {
            calculateMenuLocation: calculateMenuLocation,
            deleteSelf: function () { },
            cutSelf: function () { },
            copySelf: function () { },
            pasteSelf: function () { }
        }
    );

    util.namespace( "svgEditor.tools", {
        creationToolAbstract: creationToolAbstract,
        adonerToolAbstract: adonerToolAbstract,
        setCreationTool: setCreationTool,
        setAdonerTool: setAdonerTool,
        selectedCreationTool: new util.Accessor( function () { return creationTool; } ),
        selectedAdonerTool: new util.Accessor( function () { return adonerTool; } )
    } );

} )();