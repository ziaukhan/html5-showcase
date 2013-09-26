( function () {
    "use strict";

    var elementClass = "triangle";

    function onTriangleCreated() {
        svgEditor.tools.setCreationTool( new TriangleCreationTool( true ) );
    }

    function onTriangleSelected( triangleD3 ) {
        svgEditor.tools.setAdonerTool( new TriangleAdonerTool( triangleD3 ) );
    }


    //----->> - Creation - <<-----

    var TriangleCreationTool = util.defineClass( function ( creationStartedFlag ) {
        this.methodName = "TriangleCreationTool";
        this.selectionClass = "TriangleToolSelected";

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
                    href: "img/svgEditor/icons/triangle.svg"
                },
                    function () {
                        svgEditor.tools.setCreationTool( null );
                    },
                    "Triangle Tool Selected.", this.creationStartedFlag
                );
            },
            setHandlers: function () {
                var that = this;
                var size = svgEditor.constants.initialSize;
                var originX, originY;
                var diffWidth, diffHeight;

                that.d3Svg.on( "mousedown", function () {
                    that.d3Svg.on( "mousedown", null );

                    if ( d3.event.button === 0 ) {
                        var cord = d3.mouse( that.backgroundGNode );

                        that.dumpX = cord[0];
                        that.dumpY = cord[1];

                        that.triangleD3 = that.slideGD3.append( "polygon" ).attr( {
                            id: that.generateElementID(),
                            'class': elementClass,
                            'stroke-width': 1.5,
                            'stroke': "black",
                            'fill': "transparent"
                        } );

                        originX = cord[0];
                        originY = cord[1];
                        diffWidth = 0;
                        diffHeight = 0;

                        that.d3Svg.on( "mousemove", function () {

                            var cord = d3.mouse( that.backgroundGNode );
                            var x1 = originX;
                            var y1 = originY;
                            diffHeight = Math.abs( cord[0] - originX );
                            diffWidth = Math.abs( cord[1] - originY );

                            var diff = cord[0] - originX;
                            var x2 = x1 - diff;

                            that.triangleD3.attr( {
                                "points": x1 + "," + y1 + " " + cord[0] + "," + cord[1] + " " + x2 + "," + cord[1]
                            } );

                        } );

                        that.d3Svg.on( "mouseup", function () {
                            if ( diffWidth < 24 && diffHeight < 24 ) {
                                that.triangleD3.attr( {
                                    "points": originX + "," + originY + " " + ( originX + size ) + "," + ( originY + size ) + " " + ( originX - size ) + "," + ( originY + size )
                                } );
                            }

                            that.resetTool();
                            signalsSVG.selected.shapes.triangle.dispatch( that.triangleD3 );
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

    var TriangleAdonerTool = util.defineClass( function ( triangleD3 ) {
        this.methodName = "TriangleAdonerTool";
        this.selectionClass = "selectedSVGElement";

        this.triangleNode = triangleD3.node();
        this.triangleD3 = triangleD3;
    },
        {
            init: function () {
                //this.setAdoners();
                this.triangleD3.classed( this.selectionClass, true );
                this.layerArrangement = new svgEditor.widgets.LayerArrangementTool( this.triangleNode );
                this.setTransformation();

                var l = this.calculateMenuLocation( this.triangleD3.attr( "x" ), this.triangleD3.attr( "y" ) );
                this.setContextMenu( l.x, l.y );
            },
            deleteSelf: function () {
                //EditorHelper.pushUndoCommand(new undoCommands.DeleteUndoCommand(that.triangleNode));
                this.triangleD3.remove();
                svgEditor.tools.setAdonerTool( null );
            },
            copySelf: function ( that ) {
                /*var copy = new CopyRectCommand(that.triangleD3);
                 EditorHelper.setClipboardCommand(copy);*/
            },
            cutSelf: function ( that ) {
                /*var cutUndoCommand = new undoCommands.DeleteUndoCommand(that.triangleD3.node());
                 var cut = new clipboard.CutSVGCommand(that.triangleD3, cutUndoCommand, this.pasteSelf.bind(this));
                 cutUndoCommand.setAssociatedCutCommand(cut);
                 EditorHelper.setClipboardCommand(cut);*/
            },
            pasteSelf: function () {
                //var newNode = this.triangleD3.node().cloneNode(true);
                /*var _canvas = WinJS.Utilities.query("#canvas")[0];
                 var parentNode = _canvas.querySelector(".slideG");
                 var newRectD3 = d3.select(this.triangleD3.node().cloneNode(true));
                 parentNode.appendChild(newRectD3.node());
                 var points = transformationHelper.getScreenRotatedCenterPoint(newRectD3.node());

                 newRectD3.attr("x", points.x).attr("y", points.y);

                 return newRectD3.node();*/
            },
            setTransformation: function () {
                this.localAdonersG = this.adonersGD3.append( 'g' ).attr( 'class', 'triangleLocalAdoners' );

                this.transformTool = new svgEditor.widgets.TranformationTool( this.triangleD3, this.localAdonersG, this.d3Svg, true/*Rotate Flag*/, true/*Scale Flag*/ );

                this.transformTool.pointSetter = ( function ( transformer ) {

                    var x1 = this.triangleD3.attr( "points" ).split( " " )[0].split( "," )[0];
                    var y1 = this.triangleD3.attr( "points" ).split( " " )[0].split( "," )[1];
                    var x2 = this.triangleD3.attr( "points" ).split( " " )[1].split( "," )[0];
                    var y2 = this.triangleD3.attr( "points" ).split( " " )[1].split( "," )[1];
                    var x3 = this.triangleD3.attr( "points" ).split( " " )[2].split( "," )[0];
                    var y3 = this.triangleD3.attr( "points" ).split( " " )[2].split( "," )[1];
                    var point1 = transformer( x1, y1 );
                    var point2 = transformer( x2, y2 );
                    var point3 = transformer( x3, y3 );

                    this.triangleD3.attr( {
                        "points": point1.x + "," + point1.y + " " + point2.x + "," + point2.y + " " + point3.x + "," + point3.y
                    } );
                } ).bind( this );

                this.transformTool.onDragScale = ( function ( x, y, width, height ) {

                    var x1 = x + width / 2;
                    var y1 = y;

                    var x2 = x;
                    var y2 = y + height;

                    var x3 = x + width;
                    var y3 = y + height;

                    this.triangleD3.attr( {
                        "points": x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3
                    } );
                } ).bind( this );
            },
            setContextMenu: function ( x2, y2 ) {
                var radialMenu = new svgEditor.menu.RadialMenu( x2, y2, this.createMenuData(), "trianglemenu", null, null,
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
                    //widgets.transformationUndo.nodePush( that.triangleD3.node(), that.d3Svg.select( ".slideG" ).node(), that.triangleD3.attr( "id" ) );

                    this.triangleD3.attr( "stroke", d.data.menuColor );
                } if ( d.data.groupName === "fillSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.triangleD3.node(), that.d3Svg.select( ".slideG" ).node(), that.triangleD3.attr( "id" ) );

                    this.triangleD3.attr( "fill", d.data.menuColor );
                }
                else if ( d.data.groupName === "strokeWidthSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.triangleD3.node(), that.d3Svg.select( ".slideG" ).node(), that.triangleD3.attr( "id" ) );

                    var num;
                    if ( d.data.strokeWidth === "+" ) {
                        num = ( parseFloat( this.triangleD3.attr( "stroke-width" ) ) + 1 );
                    }
                    else if ( d.data.strokeWidth === "-" ) {
                        num = ( ( parseFloat( this.triangleD3.attr( "stroke-width" ) ) - 1 ) >= 0 ) ? ( parseFloat( this.triangleD3.attr( "stroke-width" ) ) - 1 ) : 0;
                    }
                    else {
                        num = d.data.strokeWidth;
                    }

                    this.triangleD3.attr( "stroke-width", num );
                    if ( !this.triangleD3.attr( "stroke" ) ) {
                        this.triangleD3.attr( "stroke", "black" );
                    }
                }
                else if ( d.data.name === "delete" ) {
                    this.deleteSelf();
                }
                this.layerArrangement.menuClickHandler( d.data );
            },
            menuHighlighter: function ( d ) {

                if ( d.data.groupName === "strokeSelection" ) {
                    var fillVal = this.triangleD3.attr( "stroke" );
                    if ( !fillVal ) {
                        fillVal = "transparent";
                    }
                    return fillVal.toLowerCase() === d.data.menuColor.toLowerCase();

                }
                else if ( d.data.groupName === "fillSelection" ) {
                    var fillVal = this.triangleD3.attr( "fill" );
                    if ( !fillVal ) {
                        fillVal = "transparent";
                    }
                    return fillVal.toLowerCase() === d.data.menuColor.toLowerCase();

                }
                else if ( d.data.groupName === "strokeWidthSelection" ) {
                    return this.triangleD3.attr( "stroke-width" ) == d.data.strokeWidth;

                }
                return false;
            },
            removeHandlers: function () {
                this.triangleD3.on( "MSPointerDown.drag", null );
                this.triangleD3.on( "MSPointerDown", null );
            },
            dispose: function () {
                this.triangleD3.classed( this.selectionClass, false );
                this.localAdonersG.remove();
                //this.removeHandlers();
                this.transformTool.dispose();
                //svgEditor.d3IconG.selectAll("*" ).remove();
            }
        }
    );


    TriangleCreationTool.inherit( svgEditor.tools.creationToolAbstract );
    TriangleAdonerTool.inherit( svgEditor.tools.adonerToolAbstract );

    util.namespace( "svgEditor.tools", {
        onTriangleCreated: onTriangleCreated,
        onTriangleSelected: onTriangleSelected
    } );

} )();