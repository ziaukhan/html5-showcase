( function () {

    sampleApp.directive( 'ucShapesEditor', function ( $compile /* dependencies */ ) {

        return {
            restrict: 'E',
            scope: false,
            link: function ( scope, element, attrs ) {
                element.html( "" );

                var d3Svg = svgEditor.objectModel.createSVGCanvas( d3.select( element[0] ), $compile, scope );

                //element.html('').append( $compile( "<SVG width='500' height='500' xmlns='http://www.w3.org/2000/svg' version='1.1'><rec x=400 y=100 width=50 height=50 fill='orange'></rec></SVG>" )( scope ) )

                //----->> - Bindings - <<-----
                svgEditor.controls.takeControl();
                window.onresize = syncSVGSize.bind( d3.select( element[0] ).selectAll( "#frameLayer, #SVGCanvas" ) );
                window.onresize( null );
                //*** - Bindings - ***END***

                //----->> - Show Menu First Time - <<-----
                //$timeout( function () {
                    svgEditor.menu.showMain( svgEditor.constants.menuRadius + 5, svgEditor.constants.menuRadius + 5 );

                    try{
                        if(createEventObject){
                            //console.log("yes")
                            var event = new createEventObject('mouseup', { 'detail': "to Expand Menu for First time" });
                            svgEditor.d3menuG.select(".radialMenuCenterSpot").node().dispatchEvent(event);
                        }
                    } catch(e){  //got IE
                        if(Event){
                            var event = document.createEvent('HTMLEvents');    // create event
                            event.initEvent('mouseup', true, true );     // name event
                            event.data = { 'detail': "to Expand Menu for First time" };
                            svgEditor.d3menuG.select(".radialMenuCenterSpot").node().dispatchEvent(event);
                        }
                    }
                //} );
            }
        };
    } );

    function syncSVGSize() {
        this.attr( 'width', window.innerWidth - 40 + "px" );
        this.attr( 'height', ( window.innerHeight > 320 ? window.innerHeight : 320 ) - 138 + "px" );
    }

} )();