( function () {
    "use strict";

    function removeMenu() {
        d3.selectAll( ".svg_editor #SVGCanvas .radialMenuAdoner *" ).remove();
    }

    function showMainMenu( x, y ) {
        removeMenu();

        /*if ( x < svgEditor.constants.menuRadius ) {
            x = svgEditor.constants.menuRadius + 5;
        }

        if ( y < svgEditor.constants.menuRadius ) {
            y = svgEditor.constants.menuRadius + 5;
        }*/

        var radialMenu = new svgEditor.menu.RadialMenu( x, y, createMainMenuData(), "mainmenu", null, null, mainMenuSelector, mainMenuHighlighter );
        radialMenu.render();

        return radialMenu;
    }

    function createMainMenuData() {
        return [
            {
                toggleName: "rectangle",
                img: {
                    src: "img/svgEditor/icons/rect.svg", width: "40", height: "40", centeroidTranslate: [-15, -15]
                }
            },
            {
                toggleName: "oval",
                img: {
                    src: "img/svgEditor/icons/oval.svg", width: "40", height: "40", centeroidTranslate: [-15, -15]
                }
            },
            {
                toggleName: "triangle",
                img: {
                    src: "img/svgEditor/icons/triangle.svg", width: "40", height: "40", centeroidTranslate: [-15, -15]
                }
            }
        ];
    }

    function mainMenuSelector( d ) {
        if ( d.data.toggleName == "rectangle" ) {
            signalsSVG.created.shapes.rectangle.dispatch();
        } else if ( d.data.toggleName == "oval" ) {
            signalsSVG.created.shapes.oval.dispatch();
        } else if ( d.data.toggleName == "triangle" ) {
            signalsSVG.created.shapes.triangle.dispatch();
        }
    }

    function mainMenuHighlighter() {

    }

    util.namespace( "svgEditor.menu", {
        remove: removeMenu,
        showMain: showMainMenu
    } );

} )();