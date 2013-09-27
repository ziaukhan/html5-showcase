

function setMaterialProperties(element, changer) {
    if (element.material.materials) {
        element.material.materials = element.material.materials.map(changer);
    } else {
        element.material = changer(element.material);
    }
}



function getIntersects( event, objects ) {

    var ray = new THREE.Raycaster();
    var  projector = new THREE.Projector();
    var camera = pNext3d.viewPort.getCamera();

    var domElement = document.querySelector( "#canvas canvas" );

    if (domElement) {

        var vector = new THREE.Vector3(
            (event.layerX / domElement.offsetWidth) * 2 - 1,
            -(event.layerY / domElement.offsetHeight) * 2 + 1,
            0.5
        );

        projector.unprojectVector(vector, camera);

        ray.set(camera.position, vector.sub(camera.position).normalize());

        //if ( object instanceof Array ) {

        return ray.intersectObjects(objects, true);

        //}
    } else
        return null;


    //return ray.intersectObject( object, true );
}

function lookAtObject( currentObject, face ) {
    var camera = pNext3d.viewPort.getCamera();
    currentObject.geometry.computeBoundingBox();
    var oWidth = Math.abs( currentObject.geometry.boundingBox.max.x - currentObject.geometry.boundingBox.min.x ) * currentObject.scale.x,
        oHeight = Math.abs( currentObject.geometry.boundingBox.max.y - currentObject.geometry.boundingBox.min.y ) * currentObject.scale.y;
    if ( oWidth > oHeight ) {
        var perpendicular = oWidth + ( 100 * ( 768 / 1366 ) ) * currentObject.scale.x;
    } else {
        var perpendicular = oHeight + 100 * currentObject.scale.y;
    }
    //var oWidth = Math.abs( currentObject.geometry.boundingBox.max.x - currentObject.geometry.boundingBox.min.x ) * currentObject.scale.x;
    //var oHeight = Math.abs(( currentObject.geometry.boundingBox.max.y - currentObject.geometry.boundingBox.min.y ) * currentObject.scale.y );
    //var perpendicular = Math.max( oWidth, oHeight )+100 * currentObject.scale.y;
    var base = Math.round( perpendicular / Math.tan(( camera.fov ) * Math.PI / 180 ) );

    var objectMatrix = currentObject.matrix.clone();
    objectMatrix.setPosition( new THREE.Vector3( 0, 0, 0 ) );

    return pNext3d.animations.onCameraTargetedMoved(
            currentObject.position.clone().add( objectMatrix.multiplyVector3( new THREE.Vector3( base * face.vertexNormals[0].x, base * face.vertexNormals[0].y, base * face.vertexNormals[0].z ) ) ),
            currentObject.position ).then( function () {
            var camera = pNext3d.viewPort.getCamera();
            //camera.rotation.z = currentObject.rotation.z;   // need to sync with textured text
        } );
}

function colorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};















sampleApp.factory('service3dHelpers', function () {

    return {

        setMaterialProperties : function (element, changer) {

            if (element.material.materials) {
                element.material.materials = element.material.materials.map(changer);
            } else {
                element.material = changer(element.material);
            }


        } ,

        lookAtObject:function(currentObject, face ){

            var camera = pNext3d.viewPort.getCamera();
            currentObject.geometry.computeBoundingBox();
            var oWidth = Math.abs( currentObject.geometry.boundingBox.max.x - currentObject.geometry.boundingBox.min.x ) * currentObject.scale.x,
                oHeight = Math.abs( currentObject.geometry.boundingBox.max.y - currentObject.geometry.boundingBox.min.y ) * currentObject.scale.y;
            if ( oWidth > oHeight ) {
                var perpendicular = oWidth + ( 100 * ( 768 / 1366 ) ) * currentObject.scale.x;
            } else {
                var perpendicular = oHeight + 100 * currentObject.scale.y;
            }
            //var oWidth = Math.abs( currentObject.geometry.boundingBox.max.x - currentObject.geometry.boundingBox.min.x ) * currentObject.scale.x;
            //var oHeight = Math.abs(( currentObject.geometry.boundingBox.max.y - currentObject.geometry.boundingBox.min.y ) * currentObject.scale.y );
            //var perpendicular = Math.max( oWidth, oHeight )+100 * currentObject.scale.y;
            var base = Math.round( perpendicular / Math.tan(( camera.fov ) * Math.PI / 180 ) );

            var objectMatrix = currentObject.matrix.clone();
            objectMatrix.setPosition( new THREE.Vector3( 0, 0, 0 ) );

            return pNext3d.animations.onCameraTargetedMoved(
                    currentObject.position.clone().add( objectMatrix.multiplyVector3( new THREE.Vector3( base * face.vertexNormals[0].x, base * face.vertexNormals[0].y, base * face.vertexNormals[0].z ) ) ),
                    currentObject.position ).then( function () {
                    var camera = pNext3d.viewPort.getCamera();
                    //camera.rotation.z = currentObject.rotation.z;   // need to sync with textured text
                } );

        },

        colorLuminance:function(hex, lum){

            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;
            // convert to decimal and change luminosity
            var rgb = "", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }
            return rgb;


        }




    }
});