(function () {
    "use strict";

    setTimeout(function(){
        var data = [
            {
                toggleName: "rectangle",
                img: {
                    src: "img/svgEditor/icons/rect.svg", width: "40", height: "40", centeroidTranslate: [-10, -15]
                }
            }
        ]
        var radialMenu = new RadialMenu( d3.select( ".svg_editor #SVGCanvas .radialMenuAdoner" ), 150, 150, 125, data, "mainmenu", null, null, function ( d, evt ) {}, function(){});
        radialMenu.render();
    },2000);

    var RadialMenu = WinJS.Class.define(function (d3SvgContainer, cx, cy, radius, menuData, menuID, mainCenterSpot, theme, menuSelectedFn, groupSelectionBindingFn, stateManager) {

            if (window.navigator.msMaxTouchPoints) {
                // touch device
                if (window.screen.width >= 1920) {
                    radius = 160;
                }
                else if (window.screen.width >= 1366) {
                    radius = 170;
                }
                else {
                    radius = 150;
                }
            }
            else {
                // non-touch device
                radius = 135;
            }

            //radius = (1920 / window.screen.width ) * 125;

            this.d3Svg = d3SvgContainer;
            this.cx = cx;
            this.cy = cy;
            this.menuData = menuData;
            this.menuID = menuID;
            var that = this;
            this.menuDragged = false;

            if (mainCenterSpot) {
                this.mainCenterSpot = mainCenterSpot;
            }
            else {
                this.mainCenterSpot = {
                    img: { src: "img/svgEditor/icons/menuFirst.svg", width: "50", height: "50", translate: [-27, -25] },
                    /*previousMenu: {
                     img: { src: "img/svgEditor/icons/menuPrevious.svg", width: "30", height: "30", translate: [-15, -15] },

                     }*/
                    events: {
                        "drag": function ( radialMenu ) {
                            //console.log( "Radial >>> Drag " );
                            if ( !radialMenu.expandedFlag) {
                                //console.log( " Radial X >>>>> " + d3.event.x );
                                //console.log( " Radial Y >>>>> " + d3.event.y );

                                radialMenu.updateLocation( d3.event.x, d3.event.y, true );
                                that.menuDragged = true;
                            }
                        },
                        "dragend": function ( d ) {
                            //console.log( "Radial >>> Drag end" );
                            if ( that.menuDragged ) {//d3.event.sourceEvent.x > 40 || d3.event.sourceEvent.y > 40 ) {
                                //tools.playSound( "mainMenuClicked" );
                                that.draw( menuData );
                                that.expandedFlag = true;
                                var previousTransform = that.mainG.attr( "transform" );
                                var nextTransform = previousTransform + " " + "rotate(-90)" + " " + "scale(.05)";
                                var finalTansform = previousTransform + " " + "rotate(0)" + " " + "scale(1)";
                                that.mainG.attr( "opacity", 1 ).attr( "transform", nextTransform ).transition().duration( 500 ).attr( "opacity", 1 ).attr( "transform", finalTansform ).each( "start", function () {
                                    that.allowClick = false;
                                } ).each( "end", function () {
                                        that.allowClick = true;
                                    } );
                            }
                            //d3.event.sourceEvent.stopPropagation();

                            //d3.event.sourceEvent.preventDefault();
                            //}

                        },
                        "dragstart": function ( d ) {
                            //console.log( "Radial >>> Drag start" );
                            that.menuDragged = false;
                        }
                    }
                };
            }

            this.menuSelectedFn = menuSelectedFn ? menuSelectedFn : null;
            this.stateManager = stateManager;
            this.groupSelectionBindingFn = groupSelectionBindingFn;
            this.expandedFlag = false;
            this.outerRadius = typeof radius == "number" ? radius : 125;
            this.innerRadius = this.outerRadius * .85;
            this.angleSepration = .02;
            this.centerSpot = this.outerRadius * .40;
            this.allowClick = true;
            if (typeof radius == "object") {
                this.outerRadius = radius.menuRadius ? radius.menuRadius : 125;
                this.innerRadius = radius.menuItemRadius ? radius.menuItemRadius : this.outerRadius * .85;
                this.centerSpot = radius.centerSpotRadius ? radius.centerSpotRadius : this.outerRadius * .40;
            }

            if (theme) {
                this.theme = theme;
            } else {
                //this.theme = { outerEdgeWithChildMenuFill: "darkblue", outerEdgeWithoutChildMenuFill: "lightblue", menuItemFill: "white", menuItemPathFill: "black", menuItemTextFill: "back", centerSpotFill: "blue", centerSpotPathFill: "black", centerSpotTextFill: "black" };
                this.theme = {
                    outerEdgeWithChildMenuFill: "#F8B218", outerEdgeWithoutChildMenuFill: "#3C3D3D", menuItemFill: "#3C3D3D", menuItemPathFill: "white",
                    menuItemTextFill: "#F0EFEF", centerSpotFill: "transparent", centerSpotPathFill: "#3C3D3D", centerSpotTextFill: "#F0EFEF"
                };
            }
        },
        {
            render: function () {
                this.mainG = this.d3Svg.append("g")
                    .attr("transform", "translate(" + this.cx + "," + this.cy + ")")
                    .attr("id", this.menuID);
                this.drawMainCircle(this.menuData);
            },

            transition: function () {
                var previousTransform = this.mainG.attr("transform");
                var nextTransform = previousTransform + " " + "rotate(-90)" + " " + "scale(.05)";
                var finalTansform = previousTransform + " " + "rotate(0)" + " " + "scale(1)";
                this.mainG.attr("opacity", 0).attr("transform", nextTransform).transition().duration(1500).delay(
                    function (d) {
                        return Math.floor((Math.random() * 1000) + 1000);
                    }).ease("bounce").attr("opacity", 1).attr("transform", finalTansform);
            },

            clear: function () {
                d3.select("#" + this.menuID).remove();
            },
            clearChildren: function () {
                d3.select("#" + this.menuID).selectAll("*").remove();
            },

            contract: function () {
                this.clearChildren();
                this.drawMainCircle(this.menuData);
                this.expandedFlag = false;
            },

            updateLocation: function (x, y, valueProvidedInDelta) {

                var transform = this.mainG.attr("transform");
                var translate = transform.slice(0, transform.indexOf(")") + 1);
                if (valueProvidedInDelta) {
                    x += parseFloat(translate.slice(translate.indexOf("(") + 1, translate.indexOf(" ")));
                    y += parseFloat(translate.slice(translate.indexOf(" ") + 1, translate.indexOf(")")));
                    //var xx = parseFloat(translate.slice(translate.indexOf("(") + 1, translate.indexOf(" ")));
                    //var yy = parseFloat(translate.slice(translate.indexOf(" ") + 1, translate.indexOf(")")));
                }
                this.mainG.attr("transform", transform.replace(translate, "translate(" + (x) + "," + (y) + ")"));
            },

            calculateDistance: function ( x, y, valueProvidedInDelta ) {

                var transform = this.mainG.attr( "transform" );
                var translate = transform.slice( 0, transform.indexOf( ")" ) + 1 );
                var xOld = -1;
                var yOld = -1;

                if ( valueProvidedInDelta ) {
                    xOld = parseFloat( translate.slice( translate.indexOf( "(" ) + 1, translate.indexOf( " " ) ) );
                    yOld = parseFloat( translate.slice( translate.indexOf( " " ) + 1, translate.indexOf( ")" ) ) );
                }




            },

            updateCenterSpotText: function (text) {
                if (this.mainCenterSpot.label && this.mainCenterSpot.label.text) {
                    this.mainCenterSpot.label.text = text;
                    d3.select(".radialMenuCenterSpot text").text(this.mainCenterSpot.label.text);
                }

            },

            getCenterSportObject: function () {
                return this.mainG;
                //return d3.select("#" + this.menuID +" .radialMenuCenterSpot");
            },

            getCurrentTransform: function () {
                return this.mainG.attr("transform");
            },

            relocateTransition: function (x, y, duration, delay) {
                var transform = this.mainG.attr("transform");
                var translate = transform.slice(0, transform.indexOf(")") + 1);
                this.mainG.transition().duration(duration).delay(delay).attr("transform", transform.replace(translate, "translate(" + x + "," + y + ")"));
            },

            drawMainCircle: function (menuData) {
                var that = this;

                var centerSpotEvent = that.mainCenterSpot.events && that.mainCenterSpot.events.drag ? "pointerup" : "pointerdown";


                var centerSpotG = this.mainG.append("g").on(centerSpotEvent, function () {//zia code changed
                    //console.log( "Radia >>>>> Yes on mouse up" );
                    var evt = d3.event;//zia code added
                    //evt.stopPropagation();////zia code added

                    evt.preventDefault(); //Zohaib Edit

                    if ( that.allowClick && !that.menuDragged ) {



                        if ( menuData.parentMenu ) {//child, means go back
                            that.clearChildren();
                            that.drawMainCircle( menuData.parentMenu );
                            that.draw( menuData.parentMenu );

                        } else {//for root
                            if ( that.expandedFlag ) {//contract

                                /** var previousTransform = "translate(" + that.cx + "," + that.cy + ")";
                                 var nextTransform = previousTransform + " " + "rotate(-10)" + " " + "scale(1)";
                                 var finalTansform = previousTransform + " " + "rotate(20)" + " " + "scale(1)";
                                 that.mainG.transition().duration(750).attr("transform", finalTansform);
                                 d3.timer(function () {**/
                                that.clearChildren();
                                //that.mainG.attr("transform", previousTransform);
                                that.drawMainCircle( menuData );
                                that.expandedFlag = false;

                                //}, 750);
                            } else {//expand
                                //tools.playSound( "mainMenuClicked" );

                                if ( that.mainCenterSpot && that.mainCenterSpot.events && that.mainCenterSpot.events.click ) {
                                    that.mainCenterSpot.events.click( d );
                                }

                                that.draw(menuData);

                                //if (that.stateManager)
                                //{
                                //    that.stateManager.setupStates(menuData);
                                //}

                                that.expandedFlag = true;
                                var previousTransform = that.mainG.attr( "transform" );
                                var nextTransform = previousTransform + " " + "rotate(-90)" + " " + "scale(.05)";
                                var finalTansform = previousTransform + " " + "rotate(0)" + " " + "scale(1)";
                                that.mainG.attr( "opacity", 1 ).attr( "transform", nextTransform ).transition().duration( 500 ).attr( "opacity", 1 ).attr( "transform", finalTansform ).each( "start", function () {
                                    that.allowClick = false;
                                } ).each( "end", function () {
                                        that.allowClick = true;
                                    } );
                            }
                        }
                    }
                    else {
                        that.menuDragged = false;
                    }


                }).classed("radialMenuCenterSpot", true);//zia code added

                if (that.mainCenterSpot && that.mainCenterSpot.events) {

                    for (var m in that.mainCenterSpot.events) {
                        if (m !== "click" && m !== "drag" && typeof that.mainCenterSpot.events[m] == "function" && that.mainCenterSpot.events.hasOwnProperty(m)) {
                            centerSpotG.on(m, that.mainCenterSpot.events[m]);
                        }
                    }

                    if (that.mainCenterSpot.events.drag) {
                        var dragEvent = d3.behavior.drag()
                            //.origin(Object)
                            //.on("drag", that.mainCenterSpot.events.drag)
                            .on("drag", function (d) {
                                that.mainCenterSpot.events.drag(that);
                            })

                            .on("dragstart", function (d) {
                                that.mainCenterSpot.events.dragstart ? that.mainCenterSpot.events.dragstart(d) : null;

                            })
                            .on("dragend", function (d) {
                                that.mainCenterSpot.events.dragend ? that.mainCenterSpot.events.dragend(d) : null;
                            });
                        centerSpotG.call(dragEvent);
                    }
                }

                centerSpotG.datum(that.mainG.datum());

                centerSpotG.append("circle").attr({
                    "r": this.centerSpot * 0.5,
                    "fill": "transparent"
                    //"fill": that.mainCenterSpot.fill ? that.mainCenterSpot.fill : that.theme.centerSpotFill

                });

                if (menuData.parentMenu) {


                    if (this.mainCenterSpot.previousMenu) {
                        if (this.mainCenterSpot.previousMenu.img) {
                            centerSpotG.append("image")
                                .attr("xlink:href", function (d) {
                                    return that.mainCenterSpot.previousMenu.img.src ? that.mainCenterSpot.previousMenu.img.src : "";
                                })
                                .attr("width", function (d) {
                                    return that.mainCenterSpot.previousMenu.img.width ? that.mainCenterSpot.previousMenu.img.width : "";
                                })
                                .attr("height", function (d) {
                                    return that.mainCenterSpot.previousMenu.img.height ? that.mainCenterSpot.previousMenu.img.height : "";
                                })
                                .attr("transform", function (d) {
                                    var translate = "translate(" + t0 + ")";
                                    var rotate = "";
                                    if (that.mainCenterSpot.previousMenu.img) {
                                        if (that.mainCenterSpot.previousMenu.img.translate) {
                                            var t0 = [];
                                            t0[0] = that.mainCenterSpot.previousMenu.img.translate[0];
                                            t0[1] = that.mainCenterSpot.previousMenu.img.translate[1];
                                            translate = "translate(" + t0 + ")";
                                        }
                                        rotate = that.mainCenterSpot.previousMenu.img.rotate ? "rotate (" + that.mainCenterSpot.previousMenu .img.rotate + ")" : "";

                                    }
                                    return translate + " " + rotate;
                                });
                        }

                    }
                    else {
                        var img = { src: "img/svgEditor/icons/menuPrevious.svg", width: "40", height: "40", translate: [-20, -20] };

                        centerSpotG.append("image")
                            .attr("xlink:href", function (d) {
                                return img.src;
                            })
                            .attr("width", function (d) {
                                return img.width;
                            })
                            .attr("height", function (d) {
                                return img.height;
                            })
                            .attr("transform", function (d) {
                                var translate = "translate(" + t0 + ")";
                                var rotate = "";

                                if (img.translate) {
                                    var t0 = [];
                                    t0[0] = img.translate[0];
                                    t0[1] = img.translate[1];
                                    translate = "translate(" + t0 + ")";
                                }
                                rotate = img.rotate ? "rotate (" + img.rotate + ")" : "";


                                return translate + " " + rotate;
                            });
                        /* var symbol1 = "M20.834,8.037L9.641,14.5c-1.43,0.824-1.43,2.175,0,3l11.193,6.463c1.429,0.826,2.598,0.15,2.598-1.5V9.537C23.432,7.887,22.263,7.211,20.834,8.037z";
                         centerSpotG.append("path").attr({
                         "d": symbol1,
                         "fill": that.mainCenterSpot.backArrowFill ? that.mainCenterSpot.backArrowFill : that.theme.centerSpotPathFill

                         }).attr("transform", "translate(" + -16.834 + "," + -16.037 + ")");*/
                    }
                }
                else {//main node (root)


                    if (this.mainCenterSpot.img) {
                        centerSpotG.append("image")
                            .attr("xlink:href", function (d) {
                                return that.mainCenterSpot.img.src ? that.mainCenterSpot.img.src : "";
                            })
                            .attr("width", function (d) {
                                return that.mainCenterSpot.img.width ? that.mainCenterSpot.img.width : "";
                            })
                            .attr("height", function (d) {
                                return that.mainCenterSpot.img.height ? that.mainCenterSpot.img.height : "";
                            })
                            .attr("transform", function (d) {
                                var translate = "translate(" + t0 + ")";
                                var rotate = "";
                                if (that.mainCenterSpot.img) {
                                    if (that.mainCenterSpot.img.translate) {
                                        var t0 = [];
                                        t0[0] = that.mainCenterSpot.img.translate[0];
                                        t0[1] = that.mainCenterSpot.img.translate[1];
                                        translate = "translate(" + t0 + ")";
                                    }
                                    rotate = that.mainCenterSpot.img.rotate ? "rotate (" + that.mainCenterSpot.img.rotate + ")" : "";

                                }
                                return translate + " " + rotate;
                            });

                    }

                    if (this.mainCenterSpot.symbol) {

                        centerSpotG.append("path")
                            .attr("transform", function (d) {
                                var translate = "";
                                var rotate = "";
                                var scale = "";

                                if (that.mainCenterSpot.symbol) {
                                    if (that.mainCenterSpot.symbol.translate) {
                                        var t = [];
                                        t[0] = that.mainCenterSpot.symbol.translate[0];
                                        t[1] = that.mainCenterSpot.symbol.translate[1];
                                        translate = "translate(" + t + ")";
                                    }
                                    rotate = that.mainCenterSpot.symbol.rotate ? "rotate (" + that.mainCenterSpot.symbol.rotate + ")" : "";
                                    scale = that.mainCenterSpot.symbol.scale ? "scale (" + that.mainCenterSpot.symbol.scale + ")" : "";
                                }
                                return translate + " " + rotate + " " + scale;
                            })
                            .attr("d", function (d) {
                                //var s = d.data.symbol.path;
                                if (that.mainCenterSpot.symbol && that.mainCenterSpot.symbol.path) {
                                    return that.mainCenterSpot.symbol.path;
                                }
                                else {
                                    return "";
                                }

                            })
                            .attr("fill", function (d) {
                                return that.mainCenterSpot.symbol && that.mainCenterSpot.symbol.fill ? that.mainCenterSpot.symbol.fill : that.theme.centerSpotPathFill;
                            });;

                    }
                    if (this.mainCenterSpot.label) {
                        centerSpotG.append("text")
                            .attr("transform", function (d) {
                                var translate = "";
                                var rotate = "";
                                if (that.mainCenterSpot.label) {
                                    if (that.mainCenterSpot.label.translate) {
                                        var t = [];
                                        t[0] = that.mainCenterSpot.label.translate[0];
                                        t[1] = that.mainCenterSpot.label.translate[1];
                                        translate = "translate(" + t + ")";
                                    }
                                    rotate = that.mainCenterSpot.label.rotate ? "rotate (" + that.mainCenterSpot.label.rotate + ")" : "";

                                }
                                return translate + " " + rotate;
                            })
                            .attr("dy", ".35em")
                            .style("text-anchor", "middle")
                            .text(function (d) { return that.mainCenterSpot.label && that.mainCenterSpot.label.text ? that.mainCenterSpot.label.text : ""; })
                            .attr("font-size", function (d) {
                                if (that.mainCenterSpot.label && that.mainCenterSpot.label.fontSize) {
                                    return that.mainCenterSpot.label.fontSize;
                                }
                                else {
                                    return 16;
                                }
                            })
                            .attr("fill", function (d) {
                                return that.mainCenterSpot.label && that.mainCenterSpot.label.fill ? that.mainCenterSpot.label.fill : that.theme.centerSpotTextFill;
                            });

                    }


                }

            },
            createEmptyNodes: function (menuData) {
                if (menuData.length < 4) {
                    for (var i = menuData.length ; i < 3; i++) {
                        menuData[i] = {};
                        menuData[i].selectionHandler = function (d) {
                            //console.log("Index Pressed: " + index1);
                        };
                    }
                }
            },

            draw: function ( menuData ) {
                var that = this;

                if ( menuData[0].type != "clock" ) {   // --code added for clock functionality
                    this.createEmptyNodes( menuData );
                }
                //*************************** Outer Edge Menu ***************************
                var pie = d3.layout.pie()
                    .value( function ( d ) {
                        return RadialMenu.angle;
                    } ).sort( null );


                var arc = d3.svg.arc()
                    .innerRadius( that.innerRadius )
                    .outerRadius( that.outerRadius );



                var a = pie( menuData );

                a.forEach( function ( d, i ) {
                    d.endAngle -= that.angleSepration;
                } );

                // --code added for clock functionality
                if ( menuData[0].type == "clock" ) {
                    a[0].endAngle += that.angleSepration;
                }
                // ********

                var g = this.mainG.selectAll( ".arc" )
                    .data( a )
                    .enter()
                    .append( "g" )
                    .attr( "id", function ( d, i ) {
                        return "outerArcG_" + i;
                    } )
                    .on( "pointerdown", function ( d ) {//zia code changed

                        var evt = d3.event;//zia code added
                        evt.stopPropagation();////zia code added
                        if ( d.data.childMenu ) {
                            d3.select( this ).select( "path" ).attr( "transform", function ( d ) {

                                return "scale(" + ( 1.05 ) + ")"

                            } );
                            d3.select( this ).select( "polygon" ).attr( "transform", function ( d ) {
                                var oldT = d3.select( this ).attr( "transform" );
                                return oldT + " scale(" + ( 1.6 ) + ")";

                            } );
                            d3.select( "#innerArcG_" + this.getAttribute( "id" ).split( "_" )[1] ).attr( "transform", function ( d ) {

                                return "scale(" + ( 1.05 ) + ")"

                            } );
                        }
                        setTimeout( function () {
                            if ( d.data.childMenu ) {
                                //d.data.selectionHandler();
                                d.data.childMenu.parentMenu = menuData;
                                that.clearChildren();
                                that.drawMainCircle( d.data.childMenu );
                                that.draw( d.data.childMenu );
                            }
                        }, 200 );
                    } ).classed( "outerArc", true );//zia code added

                var path = g.append( "path" )
                    .attr( "fill", function ( d, i ) {
                        if ( d.data.childMenu || d.data.type == "clock" ) {// --2nd condition added for clock functionality
                            return that.theme.outerEdgeWithChildMenuFill;
                        }
                        else {
                            return that.theme.outerEdgeWithoutChildMenuFill;
                        }
                        //return d.data.menuColor;
                    } )
                    .attr( "d", arc );

                //// new code

                g.append( "polygon" )
                    .each( function ( d ) {
                        d.textAngle = ( d.startAngle + d.endAngle ) / 2;

                    } )
                    .attr( "transform", function ( d ) {

                        return "rotate(" + ( d.textAngle * 180 / Math.PI - 90 ) + ")"
                            + "translate(" + ( that.innerRadius - 3 ) + ")";

                    } )
                    .attr( "fill", function ( d ) {
                        return "#F2F2F2";
                    } )
                    //.attr("points", "10,-6.5 10,3.5 19,-1.5");
                    .attr( "points", function ( d ) {
                        if ( d.data.childMenu ) {
                            return "10,-6.5 10,3.5 17,-1.5";
                        }
                        else {
                            return "";
                        }
                    } );



                //// new code end




                //********************************************************************************************
                var pie2 = d3.layout.pie()
                    .value( function ( d ) {
                        return RadialMenu.angle;
                    } ).sort( null );


                var arc2 = d3.svg.arc()
                    .innerRadius( that.centerSpot )
                    .outerRadius( that.innerRadius - 2 );

                var mainG2 = this.mainG.append( "g" ).classed( "innerArc", true );//zia code added
                //.attr("transform", "translate(" + this.cx + "," + this.cy + ")");

                var a2 = pie( menuData );

                a2.forEach( function ( d, i ) {
                    d.endAngle -= that.angleSepration;
                } );



                var g2 = mainG2.selectAll( ".arc" )
                    .data( a2 )
                    .enter()
                    .append( "g" )
                    .attr( "id", function ( d, i ) {
                        return "innerArcG_" + i;
                    } );


                // --code added for clock functionality
                if ( menuData[0].type == "clock" ) {
                    arc2.innerRadius( that.centerSpot - 5 ).outerRadius( that.innerRadius );
                    //a2[0].endAngle = Math.PI * 1.7;
                    a2[0].endAngle += that.angleSepration;
                    a2[0].data.menuColor = "white";
                }
                // ********

                else {
                    g2.on( "pointerdown", function ( d ) {//zia code added


                        var _nodeClicked = d3.event.srcElement.parentNode.parentNode.getAttribute("class").toString();

                        var itsState = null;


                        d3.select("#outerArcG_" + this.getAttribute("id").split("_")[1]).attr("transform", function (d) {

                            return "scale(" + (1.05) + ")"

                        });
                        d3.select("#innerArcG_" + this.getAttribute("id").split("_")[1]).attr("transform", function (d) {

                            return "scale(" + (1.05) + ")"

                        });


                        var evt = d3.event;//zia code added
                        evt.stopPropagation();////zia code added
                        evt.preventDefault();      //code added by saad
                        var pointerThat = this;


                        //var runAnimation = true;


                        //    if (that.stateManager)
                        //    {
                        //        itsState = that.stateManager.stateCheck(d.data, _nodeClicked);
                        //    }

                        //    if (itsState)
                        //        {
                        //        if (itsState.shouldProceed) {

                        //            _AnimateClickedItem(this);

                        //        } else {
                        //            //d3.select(".radialMenuAdoner #contextMenu").remove();
                        //            return;
                        //        }

                        //    } else {

                        //        _AnimateClickedItem(this);

                        //    }

                        setTimeout( function () {
                            if ( d.data.childMenu ) {
                                //d.data.selectionHandler();
                                if ( d.data.selectionHandler ) {
                                    d.data.selectionHandler( d );
                                }
                                else {     //moved the code by saad
                                    //d.data.childMenu.parentMenu = menuData;
                                    //that.clearChildren();
                                    //that.drawMainCircle( d.data.childMenu );
                                    //that.draw( d.data.childMenu );
                                }
                                d.data.childMenu.parentMenu = menuData;
                                that.clearChildren();
                                that.drawMainCircle( d.data.childMenu );
                                that.draw(d.data.childMenu);
                                //if (that.stateManager)
                                //{
                                //    that.stateManager.setupStates(d.data.childMenu, _nodeClicked);
                                //}
                            }
                            else {
                                //tools.playSound( "toolSelectionClicked" );
                                if ( d.data.selectionHandler ) {
                                    d.data.selectionHandler( d );
                                    if ( d.data.groupName ) {
                                        that.clearChildren();
                                        that.drawMainCircle( menuData );
                                        that.draw( menuData );
                                    }
                                }
                                else if ( that.menuSelectedFn ) {
                                    that.menuSelectedFn(d, evt, _nodeClicked);
                                    if ( d.data.groupName ) {
                                        that.clearChildren();
                                        that.drawMainCircle( menuData );
                                        that.draw( menuData );
                                    }
                                }
                            }

                            d3.select( "#outerArcG_" + pointerThat.getAttribute( "id" ).split( "_" )[1] ).attr( "transform", function ( d ) {

                                return "scale(" + ( 1 ) + ")"

                            } );
                            d3.select( "#innerArcG_" + pointerThat.getAttribute( "id" ).split( "_" )[1] ).attr( "transform", function ( d ) {

                                return "scale(" + ( 1 ) + ")"

                            } );
                        }, 200 );

                    } );
                }


                var path2 = g2.append( "path" )
                    .attr( "fill", function ( d, i ) {
                        /**
                         if (d.data.childMenu) {
                        return "lightblue";
                    }
                         else {
                        return "darkblue";
                    }**/
                        return d.data.menuColor ? d.data.menuColor : that.theme.menuItemFill;
                    } )
                    .attr( "d", arc2 )
                    .attr( "stroke-width", function ( d ) {
                        if ( d.data.groupName ) {
                            if ( that.groupSelectionBindingFn( d ) ) {
                                return 1.5;
                            }
                            else {
                                return 0;
                            }
                        }
                    } )
                    .attr( "stroke", function ( d ) {
                        if ( d.data.groupName ) {
                            if ( that.groupSelectionBindingFn( d ) ) {
                                if ( d.data.menuColor && d.data.menuColor.toLowerCase() === "black" ) {
                                    return "blue";
                                }
                                return "black";
                            }
                            else {
                                return "white";
                            }
                        }
                    } );

                g2.append( "image" )
                    .attr( "xlink:href", function ( d ) {
                        return d.data.img && d.data.img.src ? d.data.img.src : "";
                    } )
                    .attr( "width", function ( d ) {
                        return d.data.img && d.data.img.width ? d.data.img.width : "";
                    } )
                    .attr( "height", function ( d ) {
                        return d.data.img && d.data.img.height ? d.data.img.height : "";
                    } )
                    .attr( "transform", function ( d ) {
                        var t0 = arc2.centroid( d );
                        var translate = "translate(" + t0 + ")";
                        var rotate = "";
                        if ( d.data.img ) {
                            if ( d.data.img.centeroidTranslate ) {
                                t0[0] += d.data.img.centeroidTranslate[0];
                                t0[1] += d.data.img.centeroidTranslate[1];
                                translate = "translate(" + t0 + ")";
                            }
                            rotate = d.data.img.rotate ? "rotate (" + d.data.img.rotate + ")" : "";

                        }
                        return translate + " " + rotate;
                    } );

                g2.append( "text" )
                    .attr( "transform", function ( d ) {
                        var t0 = arc2.centroid( d );
                        var translate = "translate(" + t0 + ")";
                        var rotate = "";
                        if ( d.data.label ) {
                            if ( d.data.label.centeroidTranslate ) {
                                t0[0] += d.data.label.centeroidTranslate[0];
                                t0[1] += d.data.label.centeroidTranslate[1];
                                translate = "translate(" + t0 + ")";
                            }
                            rotate = d.data.label.rotate ? "rotate (" + d.data.label.rotate + ")" : "";

                        }
                        return translate + " " + rotate;
                    } )
                    .attr( "dy", ".35em" )
                    .style( "text-anchor", "middle" )
                    .text( function ( d ) { return d.data.label && d.data.label.text ? d.data.label.text : ""; } )
                    .attr( "font-size", function ( d ) {
                        if ( d.data.label && d.data.label.fontSize ) {
                            return d.data.label.fontSize;
                        }
                        else {
                            return 16;
                        }
                    } )
                    .attr( "fill", function ( d ) {
                        return d.data.label && d.data.label.fill ? d.data.label.fill : that.theme.menuItemTextFill;
                    } );

                g2.append( "path" )
                    .attr( "transform", function ( d ) {
                        var translate = "";
                        var rotate = "";
                        var scale = "";
                        var t = arc2.centroid( d );
                        if ( d.data.symbol ) {
                            if ( d.data.symbol.centeroidTranslate ) {
                                t[0] += d.data.symbol.centeroidTranslate[0];
                                t[1] += d.data.symbol.centeroidTranslate[1];
                                translate = "translate(" + t + ")";
                            }
                            rotate = d.data.symbol.rotate ? "rotate (" + d.data.symbol.rotate + ")" : "";
                            scale = d.data.symbol.scale ? "scale (" + d.data.symbol.scale + ")" : "";
                        }
                        return translate + " " + rotate + " " + scale;
                    } )
                    .attr( "d", function ( d ) {
                        //var s = d.data.symbol.path;
                        if ( d.data.symbol && d.data.symbol.path ) {
                            return d.data.symbol.path;
                        }
                        else {
                            return "";
                        }

                    } )
                    .attr( "fill", function ( d ) {
                        return d.data.symbol && d.data.symbol.fill ? d.data.symbol.fill : that.theme.menuItemPathFill;
                    } );


                // --code added for clock functionality
                var totalAngleRad = 360 * Math.PI / 180;
                var totalAngleDegree = 360;
                if ( menuData[0].type == "clock" ) {
                    ( function createSelectionArrow( points, peakValue, onChangeCallBack, onDragStartCallBack ) {
                        points = points.sort( function ( a, b ) { if ( a > b ) { return 1; } else { return -1; } } );



                        var yellowMarkRadius = arc2.innerRadius()() + 25;
                        var r = arc2.outerRadius()() - 16;
                        var theta = totalAngleRad;
                        var pieTheta = theta / ( points.length );
                        theta = Math.PI / 2;

                        points.forEach( function ( pointValue, i ) {
                            g2.append( "rect" )
                                .attr( 'transform', "rotate(" + ( -theta * 180 / Math.PI ) + ")" )
                                .attr( {
                                    'x': yellowMarkRadius,
                                    'y': -1,
                                    'width': 10,
                                    'height': 2,
                                    'fill': that.theme.outerEdgeWithChildMenuFill
                                } );

                            var x = r * Math.cos( theta );
                            var y = -r * Math.sin( theta ) + 5;
                            g2.append( "text" )
                                .attr( 'transform', "translate(" + x + " " + y + ")" )
                                .attr( 'text-anchor', "middle" )
                                .style( {
                                    'font-weight': "500",
                                    'font-size': "12px"
                                } )
                                .text( pointValue );

                            theta -= pieTheta;
                        } );

                        //********* selection Arrow *******


                        var menuSelectorPointer = g2.append( "image" )
                            .attr( "xlink:href", "img/svgEditor/icons/menuSelectionArrow.svg" )
                            .attr( {
                                'x': 50,
                                'y': -12.5,
                                'width': 38,
                                'height': 25,
                            } )
                            .attr( "transform", "rotate(-90)" );

                        var pieThetaDegree = totalAngleDegree / points.length;
                        var menuSelectionRotateDragBehaviour = d3.behavior.drag();
                        var endThetaDegree = totalAngleDegree - pieThetaDegree * 0.2;
                        menuSelectorPointer.call( menuSelectionRotateDragBehaviour );

                        var frontLock = false, backLock = false, previousAngleValue, deltaAngle, lockAngle;

                        var tickPiesData = [];
                        var tickArc = d3.svg.arc()
                            .innerRadius( 20 )
                            .outerRadius( that.centerSpot - 10 );

                        menuSelectionRotateDragBehaviour.on( "dragstart", function () {
                            //previousAngleValue = d3.mouse( g2.node() );
                            var cords = d3.mouse( g2.node() );
                            var angle = Math.round( Math.atan2( cords[1], cords[0] ) * ( 180 / Math.PI ) );
                            var valueAngle = angle + 90 >= 0 ? angle + 90 : 360 + angle + 90;
                            previousAngleValue = valueAngle;
                            frontLock = false;
                            backLock = false;
                            if ( onDragStartCallBack ) {
                                onDragStartCallBack();
                            }
                        });
                        if ( !menuData[0].infinite ) {
                            menuSelectionRotateDragBehaviour.on( "drag", function ( evt ) {

                                var cords = d3.mouse( g2.node() );
                                var angle = Math.round( Math.atan2( cords[1], cords[0] ) * ( 180 / Math.PI ) );
                                var valueAngle = angle + 90 >= 0 ? angle + 90 : 360 + angle + 90;

                                var deltaAngle = valueAngle - previousAngleValue;
                                previousAngleValue = valueAngle;

                                if ( Math.abs( deltaAngle ) > 180 ) {
                                    deltaAngle = deltaAngle > 0 ? deltaAngle - 360 : deltaAngle + 360;
                                }
                                if ( deltaAngle > 0 ) {
                                    if ( lockAngle == Math.floor( valueAngle / 5 ) * 5 ) {
                                        backLock = false;
                                    } else if ( backLock ) {
                                        return;
                                    } else if ( valueAngle >= endThetaDegree || ( valueAngle < 45 && previousAngleValue >= ( totalAngleDegree - 45 ) ) ) {
                                        lockAngle = endThetaDegree;
                                        frontLock = true;
                                        backLock = false;
                                    }
                                    //console.log( "positive " );
                                    if ( frontLock ) return;
                                } else if ( deltaAngle < 0 ) {

                                    if ( Math.ceil( lockAngle / 5 ) * 5 == Math.ceil( valueAngle / 5 ) * 5 ) {
                                        frontLock = false;
                                    } else if ( frontLock ) {
                                        return;
                                    } else if ( valueAngle < 1 || ( valueAngle > ( totalAngleDegree - 45 ) && ( previousAngleValue < 45 || previousAngleValue > ( totalAngleDegree - 10 ) ) ) ) {
                                        lockAngle = 0;
                                        backLock = true;
                                        frontLock = false;
                                    }
                                    //console.log( "negative " );
                                    if ( backLock ) return;
                                } else {
                                    if ( frontLock || backLock ) return;
                                }

                                //console.log( "prev: " + previousAngleValue + ", angle:" + valueAngle );


                                menuSelectorPointer.attr( "transform", "rotate(" + angle + ")" );
                                if ( !onChangeCallBack ) return;

                                var currentIndex = valueAngle / pieThetaDegree;
                                var minValue = points[Math.floor( currentIndex )];
                                var maxValue = points[Math.ceil( currentIndex )];
                                if ( !minValue ) {
                                    onChangeCallBack( points[0] );
                                }
                                else if ( maxValue ) {
                                    var value = minValue + ( maxValue - minValue ) * ( currentIndex - Math.floor( currentIndex ) );
                                    onChangeCallBack( value );
                                }
                                else if ( peakValue ) {
                                    var value = minValue + ( peakValue - minValue ) * ( currentIndex - Math.floor( currentIndex ) ) / 0.8;
                                    onChangeCallBack( value );
                                    if ( !value ) {
                                        return;
                                    }
                                }
                                else {
                                    onChangeCallBack( minValue );
                                }
                                //console.log( "extra: " + ( currentIndex - Math.floor( currentIndex ) || 1 ) + ", total:" + value );
                                //console.log( "currentIndex: " + currentIndex + ", act:" + ( currentIndex - Math.floor( currentIndex ) ) );
                                //console.log( "angle:" + valueAngle + ", low: " + value1 + ", high: " + value2 );
                            } );
                        }
                        else {
                            menuData[0].clockTicks = menuData[0].clockTicks || 0;
                            menuData[0].maxClockTicks = menuData[0].maxClockTicks || 16;

                            menuSelectionRotateDragBehaviour.on( "drag", function () {

                                var cords = d3.mouse( g2.node() );
                                var angle = Math.round( Math.atan2( cords[1], cords[0] ) * ( 180 / Math.PI ) );
                                menuSelectorPointer.attr( "transform", "rotate(" + angle + ")" );
                                if ( !onChangeCallBack ) return;

                                var valueAngle = angle + 90 > 0 ? angle + 90 : 360 + angle + 90;
                                if ( previousAngleValue > 315 && valueAngle < 45 ) {
                                    if ( menuData[0].clockTicks < menuData[0].maxClockTicks ) {
                                        menuData[0].clockTicks++;
                                        tickPiesData.push( {
                                            endAngle: menuData[0].clockTicks * Math.PI / 8 - 0.05,
                                            startAngle: ( menuData[0].clockTicks - 1 ) * Math.PI / 8
                                        } );
                                        drawMultiplierTickTimer( g2.select( "g.multiplierTickTimer" ), tickPiesData );
                                        //frontLock = false;
                                    } else {
                                        frontLock = true;
                                    }
                                } else if ( valueAngle > 315 && previousAngleValue < 45 ) {
                                    if ( menuData[0].clockTicks > 0 ) {
                                        menuData[0].clockTicks--;
                                        tickPiesData.pop();
                                        drawMultiplierTickTimer( g2.select( "g.multiplierTickTimer" ), tickPiesData );
                                        //backLock = false;
                                    } else {
                                        //backLock = true;
                                    }
                                }
                                previousAngleValue = valueAngle;

                                //if ( backLock || frontLock ) return;
                                var currentIndex = valueAngle / pieThetaDegree;

                                var minValue = points[Math.floor( currentIndex )];
                                var maxValue = points[Math.ceil( currentIndex )];
                                if ( !minValue ) {
                                    onChangeCallBack( points[0], menuData[0].clockTicks );
                                }
                                else if ( maxValue ) {
                                    var value = minValue + ( maxValue - minValue ) * ( currentIndex - Math.floor( currentIndex ) );
                                    onChangeCallBack( value, menuData[0].clockTicks );
                                }
                                else if ( peakValue ) {
                                    var value = minValue + ( peakValue - minValue ) * ( currentIndex - Math.floor( currentIndex ) );
                                    onChangeCallBack( value, menuData[0].clockTicks );
                                    if ( !value ) {
                                        return;
                                    }
                                }
                                else {
                                    onChangeCallBack( minValue, menuData[0].clockTicks );
                                }
                            } );


                        }

                        //******* showing value on clock *******

                        var selectedValue = that.groupSelectionBindingFn( a2[0] );

                        if ( selectedValue ) {
                            selectedValue = selectedValue > points[points.length - 1] ? points[points.length - 1] : selectedValue;
                            if ( selectedValue >= points[0] ) {
                                var lowValue = calculateLowHighLimits( selectedValue, points );
                                var highValue = points[lowValue.lowIndex + 1] || points[points.length - 1];// || peakValue;
                                if ( highValue ) {
                                    var lowAngle = lowValue.lowIndex * pieThetaDegree;
                                    var percentage = ( selectedValue - lowValue.low ) / ( ( highValue - lowValue.low ) || 1 );
                                    var selectedAngle = lowAngle + pieThetaDegree * percentage - 90;
                                    menuSelectorPointer.attr( "transform", "rotate(" + selectedAngle + ")" );
                                } else {
                                    menuSelectorPointer.attr( "transform", "rotate(" + ( lowValue.lowIndex * pieThetaDegree - 90 ) + ")" );
                                }
                            }
                            else {
                                menuSelectorPointer.attr( "transform", "rotate(-90)" );
                            }

                            if ( menuData[0].infinite ) {


                                for ( var i = 1; i <= menuData[0].clockTicks; i++ ) {
                                    //console.log( i * 22.5 );
                                    tickPiesData.push( {
                                        endAngle: i * Math.PI / 8 - 0.05,
                                        startAngle: ( i - 1 ) * Math.PI / 8
                                    } );
                                }

                                drawMultiplierTickTimer( g2.append( "g" ).attr( 'class', "multiplierTickTimer" ), tickPiesData );
                            }
                        }

                        function calculateLowHighLimits( value, points ) {
                            for ( var i = 0; i < points.length; i++ ) {
                                if ( value < points[i] ) {
                                    return { low: points[i - 1], lowIndex: i - 1 };
                                }
                            }
                            return { low: points[points.length - 1], lowIndex: points.length - 1 };
                        }

                        function drawMultiplierTickTimer( gD3, data ) {
                            var piePathsD3 = gD3.selectAll( "path" ).data( data )

                            piePathsD3.enter().append( "path" )
                                .attr( "transform", function ( d ) {
                                } )
                                .attr( "d", tickArc )
                                .attr( "fill", that.theme.outerEdgeWithChildMenuFill );
                            //.attr( "fill", "rgb(0, 160, 221)" );
                            piePathsD3.exit().remove();
                        }

                    } )( a2[0].data.points, a2[0].data.peakValue, a2[0].data.onChangeHandler, a2[0].data.onDragStartHandler );

                }
                // ********

                //************************ Center Selection ***************************



                //**********************************************************************
            }
        },

        {

            itsName: function (item) {

                var _nameFromImage = item.querySelector("image").getAttribute("href").split('.')[0].split('/')[3]
                var _nameFromText = item.querySelector("text").textContent;


                return _nameFromImage ? _nameFromImage:_nameFromText;
            },

            alterState: function (itemName, node, opacity) {

                var _parent = document.querySelector(".radialMenuAdoner ." + node);

                if (_parent != null)
                    _parent = _parent.childNodes;
                else
                    return;

                for (var i = 0; i < _parent.length; i++) {

                    if (RadialMenu.itsName(_parent[i]) != itemName) {
                        _parent[i].style.opacity = opacity;
                    }

                }

                // if (!_currentState)
                // {
                //     node.parentNode.setAttribute("state", "disabled");
                //     _changeStyle(0.5);

                // }else if (_currentState == "disabled")
                //{
                //     node.parentNode.setAttribute("state", "enabled");
                //     _changeStyle(1);
                // } else if (_currentState == "enabled")
                // {

                //     node.parentNode.setAttribute("state", "disabled");
                //    _changeStyle(0.5);


                //}


            },

            angle: 45,
            createTestData2: function () {
                //var diamond = d3.svg.symbol().type("cross");
                var symbol1 = "M20.834,8.037L9.641,14.5c-1.43,0.824-1.43,2.175,0,3l11.193,6.463c1.429,0.826,2.598,0.15,2.598-1.5V9.537C23.432,7.887,22.263,7.211,20.834,8.037z";

                var data = [
                    {
                        label: { text: "add0", centeroidTranslate: [1, 1], fontSize: 14, fill: "red", rotate: "30 20,40" }, symbol: { path: symbol1, centeroidTranslate: [1, 1], fill: "blue", rotate: "12 20,40", scale: "2" }
                    },
                    { img: { src: "/images/oval.png", width: "30", height: "30", centeroidTranslate: [-10, -10], rotate: "30 20,40" } }


                ];//8

                return data;
            },
            createTestData: function () {
                var data = [{}, {}, {}, {}, {}, {}, {}, {}];//8

                var color = d3.scale.category20();
                var color2 = d3.scale.category10();

                data.forEach(function (d, i) {
                    //d.angle = 45;
                    d.label = {};
                    d.label.text = "t" + i;
                    var index = i;
                    /* d.selectionHandler = function (d) {
                     //console.log("Index Pressed: " + index);
                     };*/
                    d.menuColor = color(i);
                    if (i == 0) {
                        var childMenu = [{}, {}, {}, {}, {}, {}, {}, {}];
                        childMenu.forEach(function (d1, i1) {
                            //d1.angle = 45;
                            d1.label = {};
                            d1.label.text = "p" + i1;
                            var index1 = i1;
                            /*d1.selectionHandler = function (d) {
                             //console.log("Index Pressed: " + index1);
                             };*/
                            d1.menuColor = color2(i);
                            if (i1 == 0) {
                                var childMenu2 = [{}, {}, {}, {}, {}, {}, {}, {}];
                                childMenu2.forEach(function (d1, i1) {
                                    //d1.angle = 45;
                                    d1.label = {};
                                    d1.label.text = "z" + i1;
                                    var index1 = i1;
                                    /*d1.selectionHandler = function () {
                                     console.log("Index Pressed: " + index1);
                                     };*/
                                    /*d1.menuColor = color2(i);*/
                                    /* if (i1 == 0) {
                                     var childMenu = [{}, {}, {}, {}, {}, {}, {}, {}];
                                     d.childMenu = childMenu;
                                     }*/
                                });
                                d1.childMenu = childMenu2;
                            }
                        });



                        d.childMenu = childMenu;
                    }
                });

                return data;
            }
        }
    );

})();