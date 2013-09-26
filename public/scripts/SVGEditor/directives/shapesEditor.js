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
            }
        };
    } );

    function syncSVGSize() {
        this.attr( 'width', window.innerWidth - 40 + "px" );
        this.attr( 'height', ( window.innerHeight > 320 ? window.innerHeight : 320 ) - 138 + "px" );
    }

} )();