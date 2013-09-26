( function () {
    "use strict"

    var that, groupNameGlobal = "layerArrangements";

    var LayerArrangementTool = util.defineClass( function ( targetNode ) {
        that = this;
        this.targetNode = targetNode;
        this.parentNode = targetNode.parentNode;
    },
    {
        sendToBack: function ( targetNode, parent ) {
            if ( targetNode && parent ) {

                //MSApp.execUnsafeLocalFunction( function () {
                    that.targetNode = parent.insertBefore( targetNode, parent.firstChild );
                //} );
            }
        },
        bringToFront: function ( targetNode, parent ) {
            if ( targetNode && parent ) {

                //MSApp.execUnsafeLocalFunction( function () {
                    that.targetNode = parent.appendChild( targetNode );
                //} );
            }
        },
        sendBackward: function ( targetNode, parent ) {
            if ( targetNode && parent ) {

                //MSApp.execUnsafeLocalFunction( function () {
                    that.targetNode = parent.insertBefore( targetNode, targetNode.previousSibling || parent.firstChild );
                //} );
            }

        },
        bringForward: function ( targetNode, parent ) {
            if ( targetNode && parent && targetNode.nextSibling ) {

                //MSApp.execUnsafeLocalFunction( function () {
                    that.targetNode = parent.insertBefore( targetNode, targetNode.nextSibling.nextSibling );
                //} );
            }
        },
        createArrangementMenuData: function ( groupName ) {
            groupNameGlobal = groupName;

            return {

                img: {
                    src: "img/svgEditor/icons/arrange.svg", width: "40", height: "40", centeroidTranslate: [-12, -20]
                },
                childMenu: [{
                    img: {
                        src: "img/svgEditor/icons/layerBringtoforward.svg", width: "40", height: "40", centeroidTranslate: [-15, -20]
                    },
                    handler: function () {
                        that.bringToFront( that.targetNode, that.parentNode );
                    },
                    groupName: groupName
                },
                {
                    img: {
                        src: "img/svgEditor/icons/layerSendtoback.svg", width: "40", height: "40", centeroidTranslate: [-15, -25]
                    },
                    handler: function () {
                        that.sendToBack( that.targetNode, that.parentNode );
                    },
                    groupName: groupName
                },
                {
                    img: {
                        src: "img/svgEditor/icons/layerBackward.svg", width: "48", height: "48", centeroidTranslate: [-15, -20]
                    },
                    handler: function () {
                        that.sendBackward( that.targetNode, that.parentNode );
                    },
                    groupName: groupName
                },
                {
                    img: {
                        src: "img/svgEditor/icons/layerForward.svg", width: "40", height: "40", centeroidTranslate: [-15, -20]
                    },
                    handler: function () {
                        that.bringForward( that.targetNode, that.parentNode );
                    },
                    groupName: groupName
                }]
            };
        },
        menuClickHandler: function ( menuData ) {
            if ( menuData.groupName === groupNameGlobal ) {
                menuData.handler();
            } else {
                return false;
            }
            return true;
        }
    },
    {} );

	util.namespace( "svgEditor.widgets", {
        LayerArrangementTool: LayerArrangementTool
    } );

} )();