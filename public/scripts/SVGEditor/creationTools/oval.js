( function () {
    "use strict";

    var elementClass = "oval";

    function onOvalCreated() {
        svgEditor.tools.setCreationTool( new OvalCreationTool( true ) );
    }

    function onOvalSelected( ovalD3 ) {
        svgEditor.tools.setAdonerTool( new OvalAdonerTool( ovalD3 ) );
    }


    //----->> - Creation - <<-----

    var OvalCreationTool = util.defineClass( function ( creationStartedFlag ) {
        this.methodName = "OvalCreationTool";
        this.selectionClass = "OvalToolSelected";

        this.creationStartedFlag = creationStartedFlag;
        this.backgroundGNode = this.backgroundGD3.node();
    },
        {
            init: function () {
                this.setHandlers();
                this.canvasD3.classed( this.selectionClass, true );
                if ( this.creationStartedFlag ) {
                    this.creationStartedFlag = false;
                    this.setToolSelectedIcon();
                    //tools.showHelp("Drag on the canvas to draw the Rectangle. Click on button on the left to get out of the rectangle drawing mode.", "Rectangle Tool Selected:");
                }
            },
            setToolSelectedIcon: function () {
                this.createButton( {
                    x: -13,
                    y: -15,
                    width: "32px",
                    height: "32px",
                    href: "img/svgEditor/icons/oval.svg"
                },
                    function () {
                        svgEditor.tools.setCreationTool( null );
                    },
                    "Oval Tool Selected.", this.creationStartedFlag
                );
            },
            setHandlers: function () {
                var that = this;
                var size = svgEditor.constants.initialSize;
                var dynamicRadiusX;
                var dynamicRadiusY;
                that.d3Svg.on( "mousedown", function () {
                    that.d3Svg.on( "mousedown", null );

                    if ( d3.event.button === 0 ) {
                        var cord = d3.mouse( that.backgroundGNode );

                        that.dumpX = cord[0];
                        that.dumpY = cord[1];


                        that.ovalD3 = that.slideGD3.append( "ellipse" ).attr( {
                            id: that.generateElementID(),
                            'class': elementClass,
                            'cx': cord[0],
                            'cy': cord[1],
                            'stroke-width': 1.5,
                            'stroke': "black",
                            'fill': "transparent"
                        } );

                        dynamicRadiusX = 0;
                        dynamicRadiusY = 0;

                        that.d3Svg.on( "mousemove", function () {

                            var cord = d3.mouse( that.backgroundGNode );
                            dynamicRadiusX = Math.abs( cord[0] - that.dumpX );
                            dynamicRadiusY = Math.abs( cord[1] - that.dumpY );

                            that.ovalD3.attr( {
                                rx: dynamicRadiusX,
                                ry: dynamicRadiusY
                            } );

                        } );

                        that.d3Svg.on( "mouseup", function () {
                            if ( dynamicRadiusX < 12 || dynamicRadiusY < 12 ) {
                                that.ovalD3.attr( {
                                    rx: size,
                                    ry: size
                                } );
                            }

                            that.resetTool();
                            signalsSVG.selected.shapes.oval.dispatch( that.ovalD3 );
                        } );
                    }
                } );
            },
            removeHandlers: function () {
                this.d3Svg.on( "mousemove", null );
                this.d3Svg.on( "mouseup", null );
            },
            resetTool: function () {  //custom (init & dispose)
                this.removeHandlers();
                this.init();
            },
            dispose: function () {
                this.removeHandlers();
                this.canvasD3.classed( this.selectionClass, false );
                svgEditor.d3IconG.selectAll( "*" ).remove();
            }
        }
    );


    //----->> - Adoners - <<-----

    var OvalAdonerTool = util.defineClass( function ( ovalD3 ) {
        this.methodName = "OvalAdonerTool";
        this.selectionClass = "selectedSVGElement";

        this.ovalNode = ovalD3.node();
        this.ovalD3 = ovalD3;
    },
        {
            init: function () {
                //this.setAdoners();
                this.ovalD3.classed( this.selectionClass, true );
                this.layerArrangement = new svgEditor.widgets.LayerArrangementTool( this.ovalNode );
                this.setTransformation();

                var l = this.calculateMenuLocation( this.ovalD3.attr( "x" ), this.ovalD3.attr( "y" ) );
                this.setContextMenu( l.x, l.y );
            },
            deleteSelf: function () {
                //EditorHelper.pushUndoCommand(new undoCommands.DeleteUndoCommand(that.ovalNode));
                this.ovalD3.remove();
                svgEditor.tools.setAdonerTool( null );
            },
            copySelf: function ( that ) {
                /*var copy = new CopyRectCommand(that.ovalD3);
                 EditorHelper.setClipboardCommand(copy);*/
            },
            cutSelf: function ( that ) {
                /*var cutUndoCommand = new undoCommands.DeleteUndoCommand(that.ovalD3.node());
                 var cut = new clipboard.CutSVGCommand(that.ovalD3, cutUndoCommand, this.pasteSelf.bind(this));
                 cutUndoCommand.setAssociatedCutCommand(cut);
                 EditorHelper.setClipboardCommand(cut);*/
            },
            pasteSelf: function () {
                //var newNode = this.triangleD3.node().cloneNode(true);
                /*var _canvas = WinJS.Utilities.query("#canvas")[0];
                 var parentNode = _canvas.querySelector(".slideG");
                 var newRectD3 = d3.select(this.ovalD3.node().cloneNode(true));
                 parentNode.appendChild(newRectD3.node());
                 var points = transformationHelper.getScreenRotatedCenterPoint(newRectD3.node());

                 newRectD3.attr("x", points.x).attr("y", points.y);

                 return newRectD3.node();*/
            },
            setTransformation: function () {
                this.localAdonersG = this.adonersGD3.append( 'g' ).attr( 'class', 'ovalLocalAdoners' );

                this.transformTool = new svgEditor.widgets.TranformationTool( this.ovalD3, this.localAdonersG, this.d3Svg, true/*Rotate Flag*/, true/*Scale Flag*/ );

                this.transformTool.pointSetter = ( function ( transformer ) {

                    var point1 = transformer( this.ovalD3.attr( "cx" ), this.ovalD3.attr( "cy" ) );

                    this.ovalD3.attr( "cx", point1.x );
                    this.ovalD3.attr( "cy", point1.y );
                } ).bind( this );

                this.transformTool.onDragScale = ( function ( x, y, width, height ) {
                    this.ovalD3.attr( "cx", x + width / 2 );
                    this.ovalD3.attr( "cy", y + height / 2 );
                    this.ovalD3.attr( "rx", width / 2 );
                    this.ovalD3.attr( "ry", height / 2 );
                } ).bind( this );
            },
            setContextMenu: function ( x2, y2 ) {
                var radialMenu = new svgEditor.menu.RadialMenu( x2, y2, this.createMenuData(), "ovalmenu", null, null,
                    this.menuSelector.bind( this ), this.menuHighlighter.bind( this ) );

                radialMenu.render();
            },
            createMenuData: function () {
                return [
                    {
                        img: {
                            src: "img/svgEditor/icons/strokeColor.svg", width: "40", height: "40", centeroidTranslate: [-15, -15]
                        },
                        childMenu: svgEditor.menu.ColorMenu.createColorMenuData( "strokeSelection" )
                    },
                    {
                        img: {
                            src: "img/svgEditor/icons/fill.svg", width: "40", height: "40", centeroidTranslate: [-15, -15]
                        },
                        childMenu: svgEditor.menu.ColorMenu.createColorMenuData( "fillSelection" )
                    },
                    {

                        img: {
                            src: "img/svgEditor/icons/stroke.svg", width: "32", height: "32", centeroidTranslate: [-10, -15]
                        },
                        childMenu: svgEditor.menu.strokeWidthMenu.createStrokeWidthMenuData( "strokeWidthSelection" )
                    },

                    this.layerArrangement.createArrangementMenuData( "layerArrangements" ),

                    {
                        img: {
                            src: "img/svgEditor/icons/delete.svg", width: "34", height: "34", centeroidTranslate: [-15, -20]
                        },
                        name: "delete"
                    }
                ];
            },
            menuSelector: function ( d ) {


                if ( d.data.groupName === "strokeSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.ovalD3.node(), that.d3Svg.select( ".slideG" ).node(), that.ovalD3.attr( "id" ) );

                    this.ovalD3.attr( "stroke", d.data.menuColor );
                } if ( d.data.groupName === "fillSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.ovalD3.node(), that.d3Svg.select( ".slideG" ).node(), that.ovalD3.attr( "id" ) );

                    this.ovalD3.attr( "fill", d.data.menuColor );
                }
                else if ( d.data.groupName === "strokeWidthSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.ovalD3.node(), that.d3Svg.select( ".slideG" ).node(), that.ovalD3.attr( "id" ) );

                    var num;
                    if ( d.data.strokeWidth === "+" ) {
                        num = ( parseFloat( this.ovalD3.attr( "stroke-width" ) ) + 1 );
                    }
                    else if ( d.data.strokeWidth === "-" ) {
                        num = ( ( parseFloat( this.ovalD3.attr( "stroke-width" ) ) - 1 ) >= 0 ) ? ( parseFloat( this.ovalD3.attr( "stroke-width" ) ) - 1 ) : 0;
                    }
                    else {
                        num = d.data.strokeWidth;
                    }

                    this.ovalD3.attr( "stroke-width", num );
                    if ( !this.ovalD3.attr( "stroke" ) ) {
                        this.ovalD3.attr( "stroke", "black" );
                    }
                }
                else if ( d.data.name === "delete" ) {
                    this.deleteSelf();
                }
                this.layerArrangement.menuClickHandler( d.data );
            },
            menuHighlighter: function ( d ) {

                if ( d.data.groupName === "strokeSelection" ) {
                    var fillVal = this.ovalD3.attr( "stroke" );
                    if ( !fillVal ) {
                        fillVal = "transparent";
                    }
                    return fillVal.toLowerCase() === d.data.menuColor.toLowerCase();

                }
                else if ( d.data.groupName === "fillSelection" ) {
                    var fillVal = this.ovalD3.attr( "fill" );
                    if ( !fillVal ) {
                        fillVal = "transparent";
                    }
                    return fillVal.toLowerCase() === d.data.menuColor.toLowerCase();

                }
                else if ( d.data.groupName === "strokeWidthSelection" ) {
                    return this.ovalD3.attr( "stroke-width" ) == d.data.strokeWidth;

                }
                return false;
            },
            removeHandlers: function () {
                this.ovalD3.on( "MSPointerDown.drag", null );
                this.ovalD3.on( "MSPointerDown", null );
            },
            dispose: function () {
                this.ovalD3.classed( this.selectionClass, false );
                this.localAdonersG.remove();
                //this.removeHandlers();
                this.transformTool.dispose();
                //svgEditor.d3IconG.selectAll("*" ).remove();
            }
        }
    );


    OvalCreationTool.inherit( svgEditor.tools.creationToolAbstract );
    OvalAdonerTool.inherit( svgEditor.tools.adonerToolAbstract );

    util.namespace( "svgEditor.tools", {
        onOvalCreated: onOvalCreated,
        onOvalSelected: onOvalSelected
    } );

} )();