(function(){
    "use strict";

	var elementClass = "rect";

    function onRectCreated(){
        svgEditor.tools.setCreationTool( new RectCreationTool(true) );
    }

    function onRectSelected(rectD3){
        svgEditor.tools.setAdonerTool( new RectAdonerTool(rectD3) );
    }


    //----->> - Creation - <<-----

    var RectCreationTool = util.defineClass(function (creationStartedFlag) {
            this.methodName = "RectCreationTool";
		    this.selectionClass = "RectToolSelected";

            this.creationStartedFlag = creationStartedFlag;
            this.backgroundGNode = this.backgroundGD3.node();
        },
        {
            init: function () {
                this.setHandlers();
                this.canvasD3.classed(this.selectionClass, true);
                if (this.creationStartedFlag) {
                    this.creationStartedFlag = false;
                    this.setToolSelectedIcon();
                    //tools.showHelp("Drag on the canvas to draw the Rectangle. Click on button on the left to get out of the rectangle drawing mode.", "Rectangle Tool Selected:");
                }
            },
            setToolSelectedIcon: function () {
                this.createButton({
                        x: -13,
                        y: -15,
                        width: "32px",
                        height: "32px",
                        href: "img/svgEditor/icons/rect.svg"
                    },
                    function () {
                        svgEditor.tools.setCreationTool(null);
                    },
                    "Rectangle Tool Selected.", this.creationStartedFlag
                );
            },
            setHandlers: function () {
                var that = this;
                var originX, originY;
                var size = svgEditor.constants.initialSize;
                var width;
                var height;
                that.d3Svg.on("mousedown", function () {
                    that.d3Svg.on("mousedown",null);

                    if ( d3.event.button === 0 ) {
                        var cord = d3.mouse(that.backgroundGNode);
                        //var myWidth = size * 2;
                        //var myHeight = size * 2;
                        width = 0;
                        height = 0;
                        that.dumpX = cord[0];
                        that.dumpY = cord[1];
                        that.rectD3 = that.slideGD3.append("rect").attr({
                            id: that.generateElementID(),
                            class: elementClass,
                            "x": cord[0],
                            "y": cord[1],
                            "width": width,
                            "height": width,
                            "fill": "transparent",
                            "stroke-width": "1.5",
                            stroke: "black",
                            'data-x': cord[0],
                            'data-y': cord[1]

                        });
                        originX = cord[0];
                        originY = cord[1];

                        that.d3Svg.on("mousemove", function () {
                            var x1 = originX;
                            var y1 = originY;
                            var cord = d3.mouse( that.backgroundGNode );
                            width = cord[0] - x1;
                            height = cord[1] - y1;

                            if ((cord[0] < x1) && (cord[1] < y1)) {
                                that.rectD3.attr({
                                    x: cord[0],
                                    y: cord[1],
                                    width: -width,
                                    height: -height
                                });
                            }
                            else if (cord[0] < x1) {
                                that.rectD3.attr({
                                    x: cord[0],
                                    width: -width,
                                    height: height
                                });
                            }
                            else if (cord[1] < y1) {
                                that.rectD3.attr({
                                    y: cord[1],
                                    width: width,
                                    height: -height
                                });
                            }
                            else {
                                that.rectD3.attr({
                                    width: width,
                                    height: height
                                });
                            }
                        });
                        that.d3Svg.on("mouseup", function () {
                            width = Math.abs(width);
                            height = Math.abs( height );
                            if ( width < 24 && height < 24 ) {
                                that.rectD3.attr( {
                                    width: size,
                                    height: size
                                } );
                            }

                            that.resetTool();
                            signalsSVG.selected.shapes.rectangle.dispatch(that.rectD3);
                        });
                    }
                });
            },
            removeHandlers: function () {
                this.d3Svg.on("mousemove", null);
                this.d3Svg.on("mouseup", null);
            },
            resetTool: function(){  //custom (init & dispose)
                this.removeHandlers();
                this.init();
            },
            dispose: function () {
                this.removeHandlers();
                this.canvasD3.classed(this.selectionClass, false);
                svgEditor.d3IconG.selectAll("*" ).remove();
            }
        }
    );


    //----->> - Adoners - <<-----

    var RectAdonerTool = util.defineClass( function ( rectD3 ) {
            this.methodName = "RectAdonerTool";
            this.selectionClass = "selectedSVGElement";

            this.rectNode = rectD3.node();
            this.rectD3 = rectD3;
        },
        {
            init: function () {
                //this.setAdoners();
                this.rectD3.classed(this.selectionClass, true);
	            this.layerArrangement = new svgEditor.widgets.LayerArrangementTool(this.rectNode);
	            this.setTransformation();

                var l = this.calculateMenuLocation(this.rectD3.attr("x"), this.rectD3.attr("y"));
                this.setContextMenu(l.x, l.y);
            },
            deleteSelf: function () {
                //EditorHelper.pushUndoCommand(new undoCommands.DeleteUndoCommand(that.rectNode));
                this.rectD3.remove();
	            svgEditor.tools.setAdonerTool(null);
            },
            copySelf: function (that) {
                /*var copy = new CopyRectCommand(that.rectD3);
                EditorHelper.setClipboardCommand(copy);*/
            },
            cutSelf: function (that) {
                /*var cutUndoCommand = new undoCommands.DeleteUndoCommand(that.rectD3.node());
                var cut = new clipboard.CutSVGCommand(that.rectD3, cutUndoCommand, this.pasteSelf.bind(this));
                cutUndoCommand.setAssociatedCutCommand(cut);
                EditorHelper.setClipboardCommand(cut);*/
            },
            pasteSelf: function () {
                //var newNode = this.triangleD3.node().cloneNode(true);
                /*var _canvas = WinJS.Utilities.query("#canvas")[0];
                var parentNode = _canvas.querySelector(".slideG");
                var newRectD3 = d3.select(this.rectD3.node().cloneNode(true));
                parentNode.appendChild(newRectD3.node());
                var points = transformationHelper.getScreenRotatedCenterPoint(newRectD3.node());

                newRectD3.attr("x", points.x).attr("y", points.y);

                return newRectD3.node();*/
            },
	        setTransformation: function () {
		        this.localAdonersG = this.adonersGD3.append('g').attr('class', 'rectLocalAdoners');

		        this.transformTool = new svgEditor.widgets.TranformationTool(this.rectD3, this.localAdonersG, this.d3Svg, true/*Rotate Flag*/, true/*Scale Flag*/);

		        this.transformTool.pointSetter = (function (transformer) {

			        var point1 = transformer(this.rectD3.attr("x"), this.rectD3.attr("y"));

			        this.rectD3.attr("x", point1.x);
                    this.rectD3.attr("y", point1.y);
		        }).bind(this);

		        this.transformTool.onDragScale = (function (x, y, width, height) {
                    this.rectD3.attr("x", x);
                    this.rectD3.attr("y", y);
                    this.rectD3.attr("width", width);
                    this.rectD3.attr("height", height);
		        }).bind(this);
	        },
	        setContextMenu: function (x2, y2) {
		        var radialMenu = new svgEditor.menu.RadialMenu( x2, y2, this.createMenuData(), "rectmenu", null, null,
			        this.menuSelector.bind(this), this.menuHighlighter.bind(this));

		        radialMenu.render();
	        },
            createMenuData: function () {
	            return [
                    {
                        img: {
                            src: "img/svgEditor/icons/strokeColor.svg", width: "40", height: "40", centeroidTranslate: [-15, -15]
                        },
                        childMenu: svgEditor.menu.ColorMenu.createColorMenuData("strokeSelection")
                    },
                    {
                        img: {
                            src: "img/svgEditor/icons/fill.svg", width: "40", height: "40", centeroidTranslate: [-15, -15]
                        },
                        childMenu: svgEditor.menu.ColorMenu.createColorMenuData("fillSelection")
                    },
                    {

                        img: {
                            src: "img/svgEditor/icons/stroke.svg", width: "32", height: "32", centeroidTranslate: [-10, -15]
                        },
                        childMenu: svgEditor.menu.strokeWidthMenu.createStrokeWidthMenuData("strokeWidthSelection")
                    },

	                this.layerArrangement.createArrangementMenuData("layerArrangements"),

                    {
                        img: {
                            src: "img/svgEditor/icons/delete.svg", width: "34", height: "34", centeroidTranslate: [-15, -20]
                        },
                        name: "delete"
                    }
                ];
            },
	        menuSelector: function (d) {


                if ( d.data.groupName === "strokeSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.rectD3.node(), that.d3Svg.select( ".slideG" ).node(), that.rectD3.attr( "id" ) );

                    this.rectD3.attr("stroke", d.data.menuColor);
                } if ( d.data.groupName === "fillSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.rectD3.node(), that.d3Svg.select( ".slideG" ).node(), that.rectD3.attr( "id" ) );

                    this.rectD3.attr("fill", d.data.menuColor);
                }
                else if ( d.data.groupName === "strokeWidthSelection" ) {

                    //undo code
                    //widgets.transformationUndo.nodePush( that.rectD3.node(), that.d3Svg.select( ".slideG" ).node(), that.rectD3.attr( "id" ) );

                    var num;
                    if (d.data.strokeWidth === "+") {
                        num = (parseFloat(this.rectD3.attr("stroke-width")) + 1);
                    }
                    else if (d.data.strokeWidth === "-") {
                        num = ((parseFloat(this.rectD3.attr("stroke-width")) - 1) >= 0) ? (parseFloat(this.rectD3.attr("stroke-width")) - 1) : 0;
                    }
                    else{
                        num = d.data.strokeWidth;
                    }

                    this.rectD3.attr("stroke-width", num);
                    if(!this.rectD3.attr("stroke")){
                        this.rectD3.attr("stroke", "black");
                    }
                }
                else if (d.data.name === "delete") {
                    this.deleteSelf();
                }
                this.layerArrangement.menuClickHandler(d.data);
	        },
	        menuHighlighter: function (d) {

		        if (d.data.groupName === "strokeSelection") {
			        var fillVal = this.rectD3.attr("stroke");
			        if (!fillVal) {
				        fillVal = "transparent";
			        }
			        return fillVal.toLowerCase() === d.data.menuColor.toLowerCase();

		        }
		        else if (d.data.groupName === "fillSelection") {
			        var fillVal = this.rectD3.attr("fill");
			        if (!fillVal) {
				        fillVal = "transparent";
			        }
			        return fillVal.toLowerCase() === d.data.menuColor.toLowerCase();

		        }
		        else if (d.data.groupName === "strokeWidthSelection") {
		            return this.rectD3.attr("stroke-width") == d.data.strokeWidth;

		        }
		        return false;
	        },
            removeHandlers: function () {
                this.rectD3.on("MSPointerDown.drag", null);
                this.rectD3.on("MSPointerDown", null);
            },
            dispose: function () {
	            this.rectD3.classed(this.selectionClass, false);
                this.localAdonersG.remove();
                //this.removeHandlers();
	            this.transformTool.dispose();
                //svgEditor.d3IconG.selectAll("*" ).remove();
            }
        }
    );


    RectCreationTool.inherit(svgEditor.tools.creationToolAbstract);
    RectAdonerTool.inherit(svgEditor.tools.adonerToolAbstract);

    util.namespace("svgEditor.tools",{
        //RectCreationTool: RectCreationTool,
        onRectCreated: onRectCreated,
        onRectSelected: onRectSelected
    });

})();