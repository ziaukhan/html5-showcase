
( function () {

    var staticPadding = 20;
    var padding = 20;

    var TranformationTool = util.defineClass( function ( objectD3, adonersGroup, d3SVG, isRotate, isScale, isNoBBox, tableAdoners, customPadding ) {
        var that = this;
        padding = customPadding != null ? customPadding : staticPadding / EditorHelper.view.zoomFactor;

        this.d3Svg = d3SVG;
        // this.d3Svg =d3.select("#canvas svg");
        this.objectD3 = objectD3;

        this.tableAdoners = tableAdoners;

        this.adonersGroup = adonersGroup;
        this.adonersGD3 = svgEditor.adonersGD3;
        //this.slideGNode = this.d3Svg.select(".slideG").node()

        this.backgroundGNode = svgEditor.backgroundGD3.node();

        this.pt = svgEditor.constants.pt;

        if ( isNoBBox ) {
            this.objectD3 = d3.select( objectD3.node().parentNode );
            this.objectBoxfunc = function () {
                return { x: Number( objectD3.attr( "x" ) ), y: Number( objectD3.attr( "y" ) ), width: Number( objectD3.attr( "width" ) ), height: Number( objectD3.attr( "height" ) ) }
            }
        } else {
            this.objectBoxfunc = function () {
                return that.objectD3.node().getBBox();
            }
        }

        this.objectNode = this.objectD3.node();
	    svgEditor.helper.focusObject( this.objectNode, this.pt );               //if shape is large then go in birds eye view

        padding = customPadding != null ? customPadding : staticPadding / EditorHelper.view.zoomFactor;
        //this.elementId = this.objectD3.attr( "id" );

        this.drawAdoners();

        this.setMoveHandler();

        this.isRotate = isRotate;           //optional
        if ( this.isRotate ) {
            this.setRotateHandler();
        }

        this.isScale = isScale;             //optional
        if ( this.isScale ) {
            this.setResizeHandler();
        }

        this.angle = 0;
        this.setAngle();


        this.renderAdonerBox();
        this.setMoveShortcut();
    },
    {
        pointSetter: function ( transformer ) { },

        //rotate interface
        onDragRotateStart: function ( angle, midX, midY ) { },
        onDragRotate: function ( angle, midX, midY ) { },
        onDragRotateEnd: function ( angle, midX, midY ) { },

        //Scaling interface
        onDragScaleStart: function ( x, y, width, height ) { },
        onDragScale: function ( x, y, width, height ) { },
        onDragScaleEnd: function ( x, y, width, height ) { },

        onSettingRotate:function(transform){},

        //Move interface
        onDragMoveStart: function () { },
        onDragMove: function ( rotateString, movedRX, movedRY ) { },
        onDragMoveEnd: function ( rotateString, movedRX, movedRY ) { },

        drawAdoners: function () {
            this.rectG = this.adonersGD3.insert( 'g', ":first-child" ).attr( 'class', 'transformationAdoners' );
            this.rectGNode = this.rectG.node();

            this.rect = this.rectG.append( 'rect' ).attr( 'class', 'transformationRect' )
                .style( { 'fill': 'transparent', stroke: '#F8B218', 'stroke-width': '1.5' / EditorHelper.view.zoomFactor, 'stroke-dasharray': '5,2' } );
            this.rectNode = this.rect.node();
        },

        renderAdonerBox: function () {
            var that = this;

            var bounds = this.objectBoxfunc();

            this.rect.attr( {
                'x': bounds.x - padding,
                'y': bounds.y - padding,
                'width': bounds.width + padding * 2,
                'height': bounds.height + padding * 2
            } );

            if ( this.isRotate ) {
                that.pt = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y - padding * 3 );
                //exception here some times
                this.rotateAdoner.attr( { 'cx': that.pt.x, cy: that.pt.y } );
                this.rotateHiddenAdoner.attr( { 'cx': that.pt.x, cy: that.pt.y } );
                this.lineRotate.attr( { x1: that.pt.x, y1: that.pt.y } );
                that.pt = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y - padding );
                this.lineRotate.attr( { x2: that.pt.x, y2: that.pt.y } );
            }
            if ( this.isScale ) {
                var TL = this.rotatedToNormal( bounds.x - padding, bounds.y - padding );
                var L = this.rotatedToNormal( bounds.x - padding, bounds.y + bounds.height / 2 );
                var BL = this.rotatedToNormal( bounds.x - padding, bounds.y + bounds.height + padding );
                var T = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y - padding );
                var B = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y + bounds.height + padding );
                var TR = this.rotatedToNormal( bounds.x + bounds.width + padding, bounds.y - padding );
                var R = this.rotatedToNormal( bounds.x + bounds.width + padding, bounds.y + bounds.height / 2 );
                var BR = this.rotatedToNormal( bounds.x + bounds.width + padding, bounds.y + bounds.height + padding );

                this.resizeAdonerTL.attr( { cx: TL.x, cy: TL.y } );
                this.resizeHiddenAdonerTL.attr( { cx: TL.x, cy: TL.y } );

                this.resizeAdonerL.attr( { cx: L.x, cy: L.y } );
                this.resizeHiddenAdonerL.attr( { cx: L.x, cy: L.y } );

                this.resizeAdonerBL.attr( { cx: BL.x, cy: BL.y } );
                this.resizeHiddenAdonerBL.attr( { cx: BL.x, cy: BL.y } );

                this.resizeAdonerT.attr( { cx: T.x, cy: T.y } );
                this.resizeHiddenAdonerT.attr( { cx: T.x, cy: T.y } );

                this.resizeAdonerB.attr( { cx: B.x, cy: B.y } );
                this.resizeHiddenAdonerB.attr( { cx: B.x, cy: B.y } );

                this.resizeAdonerTR.attr( { cx: TR.x, cy: TR.y } );
                this.resizeHiddenAdonerTR.attr( { cx: TR.x, cy: TR.y } );

                this.resizeAdonerR.attr( { cx: R.x, cy: R.y } );
                this.resizeHiddenAdonerR.attr( { cx: R.x, cy: R.y } );

                this.resizeAdonerBR.attr( { cx: BR.x, cy: BR.y } );
                this.resizeHiddenAdonerBR.attr( { cx: BR.x, cy: BR.y } );
            }
        },
        renderRectBox: function () {
            var bounds = this.objectBoxfunc();

            this.rect.attr( {
                'x': bounds.x - padding,
                'y': bounds.y - padding,
                'width': bounds.width + padding * 2,
                'height': bounds.height + padding * 2
            } );
        },
        renderRotateAdonerBox: function () {
            var that = this;
            var bounds = this.rectNode.getBBox();

            that.pt = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y - padding * 2 );
            this.rotateAdoner.attr( { 'cx': that.pt.x, cy: that.pt.y } );
            this.rotateHiddenAdoner.attr( { 'cx': that.pt.x, cy: that.pt.y } );

            this.lineRotate.attr( { x1: that.pt.x, y1: that.pt.y } );
            that.pt = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y );
            this.lineRotate.attr( { x2: that.pt.x, y2: that.pt.y } );
        },
        renderScaleAdonerBox: function () {
            var bounds = this.rectNode.getBBox();

            var TL = this.rotatedToNormal( bounds.x, bounds.y );
            var L = this.rotatedToNormal( bounds.x, bounds.y + bounds.height / 2 );
            var BL = this.rotatedToNormal( bounds.x, bounds.y + bounds.height );
            var T = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y );
            var B = this.rotatedToNormal( bounds.x + bounds.width / 2, bounds.y + bounds.height );
            var TR = this.rotatedToNormal( bounds.x + bounds.width, bounds.y );
            var R = this.rotatedToNormal( bounds.x + bounds.width, bounds.y + bounds.height / 2 );
            var BR = this.rotatedToNormal( bounds.x + bounds.width, bounds.y + bounds.height );

            this.resizeAdonerTL.attr( { cx: TL.x, cy: TL.y } );
            this.resizeHiddenAdonerTL.attr( { cx: TL.x, cy: TL.y } );

            this.resizeAdonerL.attr( { cx: L.x, cy: L.y } );
            this.resizeHiddenAdonerL.attr( { cx: L.x, cy: L.y } );

            this.resizeAdonerBL.attr( { cx: BL.x, cy: BL.y } );
            this.resizeHiddenAdonerBL.attr( { cx: BL.x, cy: BL.y } );

            this.resizeAdonerT.attr( { cx: T.x, cy: T.y } );
            this.resizeHiddenAdonerT.attr( { cx: T.x, cy: T.y } );

            this.resizeAdonerB.attr( { cx: B.x, cy: B.y } );
            this.resizeHiddenAdonerB.attr( { cx: B.x, cy: B.y } );

            this.resizeAdonerTR.attr( { cx: TR.x, cy: TR.y } );
            this.resizeHiddenAdonerTR.attr( { cx: TR.x, cy: TR.y } );

            this.resizeAdonerR.attr( { cx: R.x, cy: R.y } );
            this.resizeHiddenAdonerR.attr( { cx: R.x, cy: R.y } );

            this.resizeAdonerBR.attr( { cx: BR.x, cy: BR.y } );
            this.resizeHiddenAdonerBR.attr( { cx: BR.x, cy: BR.y } );

        },
        rotatedToNormal: function ( x, y ) {
            this.pt.x = x;
            this.pt.y = y;

            /*if ( !that.rectNode.getTransformToElement( that.rectGNode ) )
             
            {
               // this.rectG = this.d3Svg.select( ".adonersG" ).insert( 'g', ":first-child" ).attr( 'class', 'transformationAdoners' );
                that.rectGNode = d3.select( ".adonersG > .transformationAdoners" ).node();
            }*/
            //try{
                return this.pt.matrixTransform( this.rectNode.getTransformToElement( this.rectGNode ) );
            //} catch ( e ) {
                //d3.selectAll( ".adonersG>*" ).remove();
            //}
            

          
        },
        normalToRotated: function ( x, y ) {
            this.pt.x = x;
            this.pt.y = y;
            return this.pt.matrixTransform( this.rectGNode.getTransformToElement( this.rectNode ) );
        },
        tranformPoints: function ( x, y, source, target ) {
            this.pt.x = x;
            this.pt.y = y;
            //var a = target.getCTM().inverse().multiply( source.getCTM() )
            //var b = source.getTransformToElement( target );
            return this.pt = this.pt.matrixTransform( source.getTransformToElement( target ) );
        },
        normalToRotatedByOrigin: function ( x, y ) {
            var m = this.rectGNode.getTransformToElement( this.rectNode );
            m.e = m.f = 0;
            this.pt.x = x;
            this.pt.y = y;
            return this.pt.matrixTransform( m );
        },
        setAngle: function () {
            var transform = this.objectD3.attr( 'transform' );
            if ( transform ) {
                transform = transform.match( /rotate\(([\d\.\-]*) ([\d\.\-]*) ([\d\.\-]*)\)/ );
                if ( transform ) {
                    this.angle = Number( transform[1] );

                    this.rect.attr( 'transform', transform[0] );
                    this.adonersGroup.attr( 'transform', transform[0] );
                    this.onSettingRotate( transform[0] );
                }
            }
        },
        setMoveShortcut: function () {
            var that = this;

            var dx = 1 / EditorHelper.view.zoomFactor,
                dy = 1 / EditorHelper.view.zoomFactor;
            var dxShft = 20 / EditorHelper.view.zoomFactor,
                dyShft = 20 / EditorHelper.view.zoomFactor;

            svgEditor.controls.keyboard.keyDown = {
                'left': function ( evt ) {
                    if ( evt.shiftKey ) {
                        that.pt = that.normalToRotatedByOrigin( -dxShft, 0 );
                    }
                    else {
                        that.pt = that.normalToRotatedByOrigin( -dx, 0 );
                    }
                    that.pointSetter( function ( x, y ) {
                        return { x: Number( x ) + that.pt.x, y: Number( y ) + that.pt.y, changeX: that.pt.x, changeY: that.pt.y };
                    }, "moveEnd" );
                    that.adonersGroup.selectAll( "circle" )[0].forEach( function ( gPoint ) {
                        gPoint.setAttribute( 'cx', Number( gPoint.getAttribute( 'cx' ) ) + that.pt.x );
                        gPoint.setAttribute( 'cy', Number( gPoint.getAttribute( 'cy' ) ) + that.pt.y );
                    } );
                    if ( that.onDragMove ) {
                        that.onDragMove( that.rotateString, that.movedRX, that.movedRY, that.pt.x, that.pt.y );
                    }
                    that.renderAdonerBox();
                },
                'right': function ( evt ) {
                    if ( evt.shiftKey ) {
                        that.pt = that.normalToRotatedByOrigin( dxShft, 0 );
                    } else {
                        that.pt = that.normalToRotatedByOrigin( dx, 0 );
                    }
                    that.pointSetter( function ( x, y ) {
                        return { x: Number( x ) + that.pt.x, y: Number( y ) + that.pt.y, changeX: that.pt.x, changeY: that.pt.y };
                    }, "moveEnd" );

                    that.adonersGroup.selectAll( "circle" )[0].forEach( function ( gPoint ) {
                        gPoint.setAttribute( 'cx', Number( gPoint.getAttribute( 'cx' ) ) + that.pt.x );
                        gPoint.setAttribute( 'cy', Number( gPoint.getAttribute( 'cy' ) ) + that.pt.y );
                    } );
                    if ( that.onDragMove ) {
                        that.onDragMove( that.rotateString, that.movedRX, that.movedRY, that.pt.x, that.pt.y );
                    }
                    that.renderAdonerBox();
                },
                'up': function ( evt ) {
                    if ( evt.shiftKey ) {
                        that.pt = that.normalToRotatedByOrigin( 0, -dyShft );
                    } else {
                        that.pt = that.normalToRotatedByOrigin( 0, -dy );
                    }
                    that.pointSetter( function ( x, y ) {
                        return { x: Number( x ) + that.pt.x, y: Number( y ) + that.pt.y, changeX: that.pt.x, changeY: that.pt.y };
                    }, "moveEnd" );

                    that.adonersGroup.selectAll( "circle" )[0].forEach( function ( gPoint ) {
                        gPoint.setAttribute( 'cx', Number( gPoint.getAttribute( 'cx' ) ) + that.pt.x );
                        gPoint.setAttribute( 'cy', Number( gPoint.getAttribute( 'cy' ) ) + that.pt.y );
                    } );
                    if ( that.onDragMove ) {
                        that.onDragMove( that.rotateString, that.movedRX, that.movedRY, that.pt.x, that.pt.y );
                    }
                    that.renderAdonerBox();
                },
                'down': function ( evt ) {
                    if ( evt.shiftKey ) {
                        that.pt = that.normalToRotatedByOrigin( 0, dyShft );
                    } else {
                        that.pt = that.normalToRotatedByOrigin( 0, dy );
                    }
                    that.pointSetter( function ( x, y ) {
                        return { x: Number( x ) + that.pt.x, y: Number( y ) + that.pt.y, changeX: that.pt.x, changeY: that.pt.y };
                    }, "moveEnd" );

                    that.adonersGroup.selectAll( "circle" )[0].forEach( function ( gPoint ) {
                        gPoint.setAttribute( 'cx', Number( gPoint.getAttribute( 'cx' ) ) + that.pt.x );
                        gPoint.setAttribute( 'cy', Number( gPoint.getAttribute( 'cy' ) ) + that.pt.y );
                    } );
                    if ( that.onDragMove ) {
                        that.onDragMove( that.rotateString, that.movedRX, that.movedRY, that.pt.x, that.pt.y );
                    }
                    that.renderAdonerBox();
                }
            }
        },
        setMoveHandler: function () {
            var that = this;

            this.movedX = 0; this.movedY = 0;
            this.movedRX = 0; this.movedRY = 0;

            this.moveAdonerDragBehaviour = d3.behavior.drag();
            if ( this.tableAdoners ) {

                var tableAdonersD3 = this.tableAdoners(this.rectG);
                if (tableAdonersD3) {
                    tableAdonersD3.call(this.moveAdonerDragBehaviour);
                }
            }
            else {
                this.rect.call( this.moveAdonerDragBehaviour );
            }

            var oldMouseX = 0;
            var oldMouseY = 0;

            var rr = svgEditor.constants.adonerCircleRadius;

            this.moveAdonerDragBehaviour.on( 'dragstart', dragMoveStart );
            this.moveAdonerDragBehaviour.on( "drag", dragMove );
            this.moveAdonerDragBehaviour.on( 'dragend', dragMoveEnd );


            function dragMoveStart() {

                //widgets.transformationUndo.nodePush(that.objectNode, that.slideGNode, that.elementId, "Object Moved");

                var cord = d3.mouse( that.backgroundGNode );
                oldMouseX = cord[0];
                oldMouseY = cord[1];

                if ( that.onDragMoveStart ) {
                    that.onDragMoveStart();
                }

                that.rectG.selectAll( "line" ).style( "display", "none" );
                that.rectG.selectAll( "circle" ).style( "display", "none" );

                that.adonersGroup.style( "display", "none" );
                that.rotateString = that.rect.attr( "transform" );
                if ( !that.rotateString ) {
                    that.rotateString = '';
                } else {
                    that.rotateString += ' ';
                }
            }

            function dragMove() {

                var cord = d3.mouse( that.backgroundGNode );
                that.pt.x = cord[0];
                that.pt.y = cord[1];

                var dx = Math.round( cord[0] - oldMouseX );
                var dy = Math.round( cord[1] - oldMouseY );

                that.movedX += dx;
                that.movedY += dy;

                oldMouseX = cord[0];
                oldMouseY = cord[1];

                that.pt = that.normalToRotatedByOrigin( dx, dy );

                that.movedRX += that.pt.x;
                that.movedRY += that.pt.y;

                that.onDragMove( that.rotateString, that.movedRX, that.movedRY, that.pt.x, that.pt.y );

                that.rect.attr("transform", that.rotateString + 'translate(' + that.movedRX + ' ' + that.movedRY + ')');
                that.objectD3.attr("transform", that.rotateString + 'translate(' + that.movedRX + ' ' + that.movedRY + ')');

                that.renderRectBox();
            }

            function dragMoveEnd() {
                //onDragMoveEnd place changed

                that.pointSetter( function ( x, y ) {
                    return { x: Number( x ) + that.movedRX, y: Number( y ) + that.movedRY, changeX: that.movedRX, changeY: that.movedRY };
                }, "moveEnd" );

                that.rect.attr( "transform", that.rotateString );
                that.objectD3.attr( "transform", that.rotateString );

                if (that.onDragMoveEnd) {
                    that.onDragMoveEnd(that.rotateString, that.movedRX, that.movedRY, that.movedX, that.movedY);
                }//***** detention


                that.adonersGroup.selectAll( "circle" )[0].forEach( function ( gPoint ) {
                    gPoint.setAttribute( 'cx', Number( gPoint.getAttribute( 'cx' ) ) + that.movedRX );
                    gPoint.setAttribute( 'cy', Number( gPoint.getAttribute( 'cy' ) ) + that.movedRY );
                });

                that.adonersGroup.style( "display", "" );

                that.rectG.selectAll( "line" ).style( "display", "" );
                that.rectG.selectAll( "circle" ).style( "display", "" );

                that.renderAdonerBox();

                that.movedX = 0; that.movedY = 0;
                that.movedRX = 0; that.movedRY = 0;
            }

        },
        setRotateHandler: function () {
            var that = this;

            this.lineRotate = this.rectG.append( 'line' ).attr( { stroke: 'black', 'stroke-width': 2 / EditorHelper.view.zoomFactor } );
            this.rotateAdoner = this.rectG.append( 'circle' ).attr( "r", svgEditor.constants.adonerCircleRadius ).attr( 'class', 'rotateAdonerClass adonerCircle' ).style( 'stroke-width', 1.5 / EditorHelper.view.zoomFactor + "px" );
            this.rotateHiddenAdoner = this.rectG.append( 'circle' ).attr( "r", svgEditor.constants.adonerHiddenCircleRadius ).attr( {
                'class': 'rotateHiddenAdonerClass',
                fill: 'transparent'
            } );
            //var angle = 0;

            this.rotateAdonerDragBehavior = d3.behavior.drag();
            this.rotateHiddenAdoner.call( this.rotateAdonerDragBehavior );

            this.rotateAdonerDragBehavior.on("dragstart", function () {

                /*if (d3.select(that.objectNode.parentNode).classed("resourceItem")) {

                    widgets.transformationUndo.nodePush(that.objectNode.parentNode, that.slideGNode, that.objectNode.parentNode.getAttribute("id"), "Object Moved");

                }
                else {*/
                    //widgets.transformationUndo.nodePush(that.objectNode, that.slideGNode, that.elementId, "Object Rotated");
                //}

                that.rotateAdoner.transition()
                   .duration( 1000 )
                   .ease( "elastic" )
                   .attr( "r", svgEditor.constants.adonerCircleRadius * 1.3 );

                var oldX = Number( that.rect.attr( "x" ) );
                var oldY = Number( that.rect.attr( "y" ) );

                var midRX = oldX + that.rect.attr( 'width' ) / 2;
                var midRY = oldY + that.rect.attr( 'height' ) / 2;

                that.pt = that.tranformPoints( midRX, midRY, that.rectNode, that.rectGNode );
                that.midX = that.pt.x;
                that.midY = that.pt.y;

                that.rect.attr( "transform", 'rotate(' + that.angle + ' ' + that.midX + ' ' + that.midY + ')' );
                that.objectD3.attr( "transform", 'rotate(' + that.angle + ' ' + that.midX + ' ' + that.midY + ')' );

                //if (that.onDragRotateStart) {
                that.onDragRotateStart( that.angle, that.midX, that.midY, function ( x, y ) {

                    that.pt = that.tranformPoints( x, y, that.adonersGroup.node(), that.rectNode );
                    return { x: that.pt.x, y: that.pt.y };
                } );
                //}


                that.adonersGroup.selectAll( "circle" )[0].forEach( function ( gPoint ) {

                    that.pt = that.tranformPoints( gPoint.getAttribute( 'cx' ), gPoint.getAttribute( 'cy' ), that.adonersGroup.node(), that.rectNode );
                    gPoint.setAttribute( 'cx', that.pt.x );
                    gPoint.setAttribute( 'cy', that.pt.y );

                } );


                that.pointSetter( function ( x, y ) {
                    that.pt = that.tranformPoints( x, y, that.adonersGroup.node(), that.rectNode );
                    return { x: that.pt.x, y: that.pt.y };
                }, "rotateStart" );


                that.adonersGroup.attr( "transform", 'rotate(' + that.angle + ' ' + that.midX + ' ' + that.midY + ')' );

                d3.select( that.rectG.node().parentNode.lastChild ).selectAll( "circle" ).style( "display", "none" );

                that.rectG.selectAll( ".resizeAdonerClass" ).style( "display", "none" );
                //that.renderRotateAdonerBox();
                //that.renderAdonerBox();
                that.renderRectBox();
            } )

            this.rotateAdonerDragBehavior.on( "drag", function () {

                var normalCords = d3.mouse( that.backgroundGNode );

                var rotatedMid = that.tranformPoints( that.midX, that.midY, that.rectNode, that.rectGNode )
                var dx = normalCords[0] - rotatedMid.x;
                var dy = normalCords[1] - rotatedMid.y;

                that.angle = Math.round( Math.atan2( dy, dx ) * ( 180 / Math.PI ) ) + 90;

                that.objectD3.attr( "transform", 'rotate(' + that.angle + ' ' + that.midX + ' ' + that.midY + ')' );
                that.rect.attr( "transform", 'rotate(' + that.angle + ' ' + that.midX + ' ' + that.midY + ')' );
                that.adonersGroup.attr( "transform", 'rotate(' + that.angle + ' ' + that.midX + ' ' + that.midY + ')' );

                //if (that.onDragRotate) {
                that.onDragRotate( that.angle, that.midX, that.midY );
                //}
                that.renderRotateAdonerBox(); //that.renderAdonerBox();
            } );

            this.rotateAdonerDragBehavior.on( "dragend", function () {
                //if (that.onDragRotateEnd) {
                that.onDragRotateEnd( that.angle, that.midX, that.midY );
                //}
                that.renderRotateAdonerBox();
                if ( that.isScale ) {
                    that.renderScaleAdonerBox();
                }
                that.rectG.selectAll( ".resizeAdonerClass" ).style( "display", "" );
                d3.select( that.rectG.node().parentNode.lastChild ).selectAll( "circle" ).style( "display", "" );

                that.rotateAdoner.transition()
                   .duration( 1000 )
                   .ease( "elastic" )
                   .attr( "r", svgEditor.constants.adonerCircleRadius );
            } );
        },
        setResizeHandler: function () {
            var that = this;

            //Shared Variables
            var cord;
            var oldMouseX, oldMouseY;
            var x, y, width, height;
            var adonerStrokeWidth = 1.5 / EditorHelper.view.zoomFactor;
            var sizeLimit = padding * 2 + 10/ EditorHelper.view.zoomFactor;

            function dragStart() {
                //widgets.transformationUndo.nodePush( that.objectNode, that.slideGNode, that.elementId, "Object Resize" );
                x = Number( that.rect.attr( 'x' ) );
                y = Number( that.rect.attr( 'y' ) );
                width = Number( that.rect.attr( 'width' ) );
                height = Number( that.rect.attr( 'height' ) );
                that.ratio = width / height;
                //that.ratioName = that.ratio < 1 ? 'width' : 'height';


                //if (that.onDragScaleStart) {
                that.onDragScaleStart( x + padding, y + padding, width - padding * 2, height - padding * 2 );
                //}

                var cord = d3.mouse( that.backgroundGNode );
                oldMouseX = cord[0];
                oldMouseY = cord[1];

                that.rectG.selectAll( "circle" ).style( "display", "none" );
                that.rectG.selectAll( "line" ).style( "display", "none" );
            }

            function dragEnd() {

                //if (that.onDragScaleEnd) {
                that.onDragScaleEnd( x + padding, y + padding, width - padding * 2, height - padding * 2 );
                //}

                if ( that.isRotate ) {
                    that.renderRotateAdonerBox();
                }
                that.renderScaleAdonerBox();

                that.rectG.selectAll( "circle" ).style( "display", "" );
                that.rectG.selectAll( "line" ).style( "display", "" );
            }

            function createScaleDragFunctions( performScale ) {
                //UnShared Variables among functions created
                return {
                    'dragstart': dragStart,
                    'drag': function drag() {
                        cord = d3.mouse( that.backgroundGNode );

                        var dx = Math.round( cord[0] - oldMouseX );
                        var dy = Math.round( cord[1] - oldMouseY );
                        oldMouseX = cord[0];
                        oldMouseY = cord[1];


                        that.pt = that.normalToRotatedByOrigin( dx, dy );
                        performScale( that.pt.x, that.pt.y );

                        //if (that.onDragScale) {
                        //that.onDragScale(x + padding, y + padding, width - padding * 2, height - padding * 2);
                        //}
                        

                        //khurram
                        /*if (width > sizeLimit && height > sizeLimit) {

                            var _response = that.onDragScale(x + padding, y + padding, width - padding * 2, height - padding * 2);

                            if (!_response) {

                                that.rect.attr({

                                    'x': x,
                                    'y': y,
                                    'width': width,
                                    'height': height
                                });
                            }

                        }*/




                        //original code, changed for restricting in bounds (khurram)
                        if ( width > sizeLimit && height > sizeLimit ) {
                            that.rect.attr( {
                                'x': x,
                                'y': y,
                                'width': width,
                                'height': height
                            } );

                            that.onDragScale( x + padding, y + padding, width - padding * 2, height - padding * 2 );
                        }
                    },
                    'dragend': dragEnd
                };
            }
            var handlers = {
                "TL": createScaleDragFunctions( function ( rdx, rdy ) {
                    x += rdx;
                    y += rdy;
                    width -= rdx;
                    height -= rdy;
                } ),
                "L": createScaleDragFunctions( function ( rdx, rdy ) {
                    x += that.pt.x;
                    width -= that.pt.x;
                } ),
                "BL": createScaleDragFunctions( function ( rdx, rdy ) {
                    x += that.pt.x;
                    width -= that.pt.x;
                    height += that.pt.y;
                } ),
                "T": createScaleDragFunctions( function ( rdx, rdy ) {
                    y += that.pt.y;
                    height -= that.pt.y;
                } ),
                "B": createScaleDragFunctions( function ( rdx, rdy ) {
                    height += that.pt.y;
                } ),
                "TR": createScaleDragFunctions( function ( rdx, rdy ) {
                    y += that.pt.y;
                    width += that.pt.x;
                    height -= that.pt.y;
                    //y += that.pt.y;
                    //width += that.pt.x;
                    //height -= that.pt.y;
                } ),
                "R": createScaleDragFunctions( function ( rdx, rdy ) {
                    width += that.pt.x;
                } ),
                "BR": createScaleDragFunctions( function ( rdx, rdy ) {
                    //if ( that.pt.x < that.pt.y ) {
                        width += that.pt.x;
                        height += that.pt.x / that.ratio;
                    //} else {
                        //height += that.pt.y;
                        //width += that.pt.y * that.ratio;
                    //}
                    //width += that.pt.x;
                    //height += that.pt.y;
                } )
            };
            var hiddenAdonerSize = svgEditor.constants.adonerHiddenCircleRadius;
            //Top Left
            this.resizeAdonerTL = this.rectG.append( 'circle' ).attr( 'class', 'resizeTLAdonerClass resizeAdonerClass adonerCircle' ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerTL = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',
                r: hiddenAdonerSize
            } );
            this.resizeAdonerTLDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerTL.call( this.resizeAdonerTLDragBehavior );

            this.resizeAdonerTLDragBehavior.on( "dragstart", handlers["TL"]["dragstart"] );
            this.resizeAdonerTLDragBehavior.on( "drag", handlers["TL"]["drag"] );
            this.resizeAdonerTLDragBehavior.on( "dragend", handlers["TL"]["dragend"] );

            //Left
            this.resizeAdonerL = this.rectG.append( 'circle' ).attr( 'class', 'resizeLAdonerClass resizeAdonerClass adonerCircle' ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerL = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',
                r: hiddenAdonerSize
            } );
            this.resizeAdonerLDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerL.call( this.resizeAdonerLDragBehavior );

            this.resizeAdonerLDragBehavior.on( "dragstart", handlers["L"]["dragstart"] );
            this.resizeAdonerLDragBehavior.on( "drag", handlers["L"]["drag"] );
            this.resizeAdonerLDragBehavior.on( "dragend", handlers["L"]["dragend"] );

            //Bottom Left
            this.resizeAdonerBL = this.rectG.append( 'circle' ).attr( 'class', 'resizeBLAdonerClass resizeAdonerClass adonerCircle' ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerBL = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',
                r: hiddenAdonerSize
            } );
            this.resizeAdonerBLDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerBL.call( this.resizeAdonerBLDragBehavior );

            this.resizeAdonerBLDragBehavior.on( "dragstart", handlers["BL"]["dragstart"] );
            this.resizeAdonerBLDragBehavior.on( "drag", handlers["BL"]["drag"] );
            this.resizeAdonerBLDragBehavior.on( "dragend", handlers["BL"]["dragend"] );

            //Top
            this.resizeAdonerT = this.rectG.append( 'circle' ).attr( 'class', 'resizeTAdonerClass resizeAdonerClass adonerCircle' ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerT = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',
                r: hiddenAdonerSize
            } );
            this.resizeAdonerTDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerT.call( this.resizeAdonerTDragBehavior );

            this.resizeAdonerTDragBehavior.on( "dragstart", handlers["T"]["dragstart"] );
            this.resizeAdonerTDragBehavior.on( "drag", handlers["T"]["drag"] );
            this.resizeAdonerTDragBehavior.on( "dragend", handlers["T"]["dragend"] );

            //Bottom
            this.resizeAdonerB = this.rectG.append( 'circle' ).attr( 'class', 'resizeBAdonerClass resizeAdonerClass adonerCircle' ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerB = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',
                r: hiddenAdonerSize
            } );
            this.resizeAdonerBDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerB.call( this.resizeAdonerBDragBehavior );

            this.resizeAdonerBDragBehavior.on( "dragstart", handlers["B"]["dragstart"] );
            this.resizeAdonerBDragBehavior.on( "drag", handlers["B"]["drag"] );
            this.resizeAdonerBDragBehavior.on( "dragend", handlers["B"]["dragend"] );

            //Top Right
            this.resizeAdonerTR = this.rectG.append( 'circle' ).attr( 'class', 'resizeTRAdonerClass resizeAdonerClass adonerCircle' ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerTR = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',
                r: hiddenAdonerSize
            } );
            this.resizeAdonerTRDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerTR.call( this.resizeAdonerTRDragBehavior );

            this.resizeAdonerTRDragBehavior.on( "dragstart", handlers["TR"]["dragstart"] );
            this.resizeAdonerTRDragBehavior.on( "drag", handlers["TR"]["drag"] );
            this.resizeAdonerTRDragBehavior.on( "dragend", handlers["TR"]["dragend"] );

            //Right
            this.resizeAdonerR = this.rectG.append( 'circle' ).attr( 'class', 'resizeRAdonerClass resizeAdonerClass adonerCircle' ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerR = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',
                r: hiddenAdonerSize
            } );
            this.resizeAdonerRDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerR.call( this.resizeAdonerRDragBehavior );

            this.resizeAdonerRDragBehavior.on( "dragstart", handlers["R"]["dragstart"] );
            this.resizeAdonerRDragBehavior.on( "drag", handlers["R"]["drag"] );
            this.resizeAdonerRDragBehavior.on( "dragend", handlers["R"]["dragend"] );

            //Bottom Right
            this.resizeAdonerBR = this.rectG.append( 'circle' ).attr( 'class', 'resizeBRAdonerClass resizeAdonerClass adonerCircle' ).style( 'fill-opacity', 0.2 ).style( 'stroke', "#F8B218" ).style( 'stroke-width', adonerStrokeWidth + "px" );
            this.resizeHiddenAdonerBR = this.rectG.append( 'circle' ).attr( {
                'class': 'resizeTLAdonerClass resizeAdonerClass',
                fill: 'transparent',                
                r: hiddenAdonerSize
            } );
            this.resizeAdonerBRDragBehavior = d3.behavior.drag();
            this.resizeHiddenAdonerBR.call( this.resizeAdonerBRDragBehavior );
            var rr = svgEditor.constants.adonerCircleRadius;
            this.resizeAdonerBR.transition()
             .duration( 2000 )
             .ease( "elastic" )
             .attr( "r", rr*1  );

            this.resizeAdonerR.transition()
           .duration( 2000 )
           .ease( "elastic" )
           .attr( "r", rr );


            this.resizeAdonerTR.transition()
           .duration( 2000 )
           .ease( "elastic" )
           .attr( "r", rr );


            this.resizeAdonerB.transition()
           .duration( 2000 )
           .ease( "elastic" )
           .attr( "r", rr );

            this.resizeAdonerT.transition()
           .duration( 2000 )
           .ease( "elastic" )
           .attr( "r", rr );

            this.resizeAdonerBL.transition()
          .duration( 2000 )
          .ease( "elastic" )
          .attr( "r", rr );

            this.resizeAdonerL.transition()
          .duration( 2000 )
          .ease( "elastic" )
          .attr( "r", rr );

            this.resizeAdonerTL.transition()
          .duration( 2000 )
          .ease( "elastic" )
          .attr( "r", rr );

            this.resizeAdonerBRDragBehavior.on( "dragstart", handlers["BR"]["dragstart"] );
            this.resizeAdonerBRDragBehavior.on( "drag", handlers["BR"]["drag"] );
            this.resizeAdonerBRDragBehavior.on( "dragend", handlers["BR"]["dragend"] );
        },
        dispose: function () {

            this.rectG.remove();

            svgEditor.controls.keyboard.keyDown = {
                'left': null,
                'right': null,
                'up': null,
                'down': null
            };
        }
    });

	util.namespace( "svgEditor.widgets", {
        TranformationTool: TranformationTool
    } );

} )();