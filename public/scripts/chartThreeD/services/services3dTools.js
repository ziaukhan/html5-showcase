

sampleApp.factory('service3dTools', function () {

    var grid = [];
    var max; var running = 0;
    var dynamicHeight = { y: 1 };
    THREE.LeftAlign = 1;
    THREE.CenterAlign = 0;
    THREE.RightAlign = -1;
    THREE.TopAlign = -1;
    THREE.BottomAlign = 1;


    function drawGrBarChart(data,labels,groups) {
        var groupedBar = new THREE.Object3D();
        var tempArray = [];
        for (var x = 0; x < data.length; x++) {
            tempArray.push(Math.max.apply(null, data[x]))
        }
        var gBarChartMesh = new THREE.Object3D();
        max = Math.max.apply(null, tempArray);
        var plane = new THREE.Mesh(
            new THREE.CubeGeometry(data.length*100 + 50, 20, data[0].length*100 + 50),
            new THREE.MeshPhongMaterial({ color: 0xffd761 }));
        plane.position.y = 10;
        plane.receiveShadow = true;
        plane.doubleSided = true;
        plane.name = 'Plane';
        groupedBar.add(plane);
        gBarChartMesh.add(groupedBar);
        var cage = drawCageAndGlass(groupedBar, data);
        groupedBar.add(cage);
        dynamicHeight.y = 1;
        var x_drawn = false;
        var length = { x: data.length, y:  data[0].length};
        for (var y = 0; y < length.y; y++) {
            var title = createText2D(labels[y]);
            title.position.x = (-(data.length * 100) / 2);
            //(-(length.x - 1) / 2) * 100;
            title.position.z = -(y - (length.y - 1) / 2) * 100;
            title.position.y = 50;
            groupedBar.add(title);

            for (var x = 0; x < length.x; x++) {
                grid[running] = [];
                if (x_drawn === false) {
                    var c = String.fromCharCode(x + 65);
                    var label = createText2D(groups[x]);
                    label.position.x = (x - (length.x - 1) / 2) * 100 - 25;
                    label.position.z = -(-1 - (length.y - 1) / 2) * 55;
                    label.position.y = 25;
                    groupedBar.add(label);
                }
                grid[running].height = data[x][y]/max * 200;
                gBarChartMesh.add(drawBar(y, x, length, grid[running].height, groupedBar, max,data[x][y]));
                running++;
            }
            x_drawn = true;
        }

        gBarChartMesh.name = "groupBarChart";

        gBarChartMesh.scale.x = 1.5;
        gBarChartMesh.scale.y = 1.5;
        gBarChartMesh.scale.z = 1.5;


        gBarChartMesh.position.y -=100;

        return gBarChartMesh;
    }




    function generateParentDataTypes() {
        return [{
            name: "Group",
            type: function (val) { return val; } //no checking
        }];
    }

    function generateChildDataTypes() {
        return [{
            name: "Name",
            type: function (val) { return val; } //no checking,
        }, {
            name: "Frequency",
            type: function (val) { return Number(val) > 0 || val === "0"; }
        }];
    }

    function convertDataFormat(panelData) {
        var dataArr = [];
        var labels = {};
        var labelsArr = [];
        var groupArr = [];
        dataArr = dataArr.concat(panelData.map(function (p) {
            var cArr = p.children ? p.children.map(function (c) {
                labels[c["name"]] = true;
                return Number(c["frequency"]);
            }) : [];
            groupArr.push(p["group"]);
            return cArr;
        }));
        for (var i in labels) {
            labelsArr.push(i);
        }
        return { data: dataArr, labels: labelsArr, groupArr: groupArr };
    }



    function drawBar(y, x, length, height, groupedBar,max,originalValue) {
        var mat = new THREE.MeshPhongMaterial({
            ambient: 0x000000,
            color: 0xFFAA55,
            specular: 0x999999,
            shininess: 100,
            shading: THREE.SmoothShading,
            opacity: 0.8,
            transparent: true
        });

        var color = new THREE.Color();
        color.setHSL((1 - height / max) / 2, 0.7, 0.7);
        mat.color.setHSL((1 - originalValue / max) / 2, 1, 0.5);

        grid[running].geo = new THREE.CubeGeometry(50, height, 50);
        grid[running].geo.dynamic = true;
        grid[running].geo.verticesNeedUpdate = true;
        grid[running].baseColor = color.getHSL();

        var frequency = createText2D(originalValue);
        frequency.position.x = (x - (length.x - 1) / 2) * 100 - 5;
        frequency.position.z = -(y - (length.y - 1) / 2) * 100;
        frequency.position.y = height + 25;
        //frequency.rotation.y = Math.PI / 4;
        groupedBar.add(frequency);

        var mesh = new THREE.Mesh(grid[running].geo, mat);
        mesh.position.x = (x - (length.x - 1) / 2) * 100;
        mesh.position.y = height / 2 + 20;
        mesh.position.z = -(y - (length.y - 1) / 2) * 100;
        mesh.castShadow = mesh.receiveShadow = true;
        mesh.name = grid[running].name = running;
        grid[running].done = false;
        groupedBar.add(mesh);
        return groupedBar;
    }



    function drawCageAndGlass(groupedBar,data) {

        var gridBox = new THREE.Object3D();
        var axisXsize = data[0].length * 100 + 50;
        var axisYsize = 245;
        var axisZsize = data.length * 100 + 50;
        var cylinderGeometry1 = new THREE.CylinderGeometry(1, 1, axisXsize, 32, 1, false);
        var cylinderGeometry2 = new THREE.CylinderGeometry(1, 1, axisYsize, 32, 1, false);
        var cylinderGeometry3 = new THREE.CylinderGeometry(1, 1, axisZsize, 32, 1, false);
        var axisMaterial = new THREE.MeshPhongMaterial({
            ambient: 0x000000,
            color: 0xffbf7a,
            specular: 0x999999,
            shininess: 100,
            shading: THREE.SmoothShading,
            opacity: 1,
            transparent: true
        });
        for (var i = -1; i <= 1; i += 2) {
            //if (i != 0) {
            for (var j = -1; j <= 1; j += 2) {

                //if (j != 0) {
                var axesX = new THREE.Mesh(cylinderGeometry1, axisMaterial);
                axesX.rotation.x = 1.57;
                var axesY = new THREE.Mesh(cylinderGeometry2, axisMaterial);
                var axesZ = new THREE.Mesh(cylinderGeometry3, axisMaterial);
                axesZ.rotation.z = 1.57;

                gridBox.add(axesX);
                gridBox.add(axesY);
                gridBox.add(axesZ);

                axesX.position.x = i * axisZsize / 2;
                axesX.position.y = j * axisYsize / 2;

                axesY.position.x = i * axisZsize / 2;
                axesY.position.z = j * axisXsize / 2;

                axesZ.position.y = i * axisYsize / 2;
                axesZ.position.z = j * axisXsize / 2;
            }
            //}
            //}

        }
        gridBox.position.y = axisYsize / 2;

        var backGroundGlass = new THREE.Object3D();
        var glassMat = new THREE.MeshPhongMaterial({
            ambient: 0x000000,
            color: 0xd1e3ff,
            specular: 0x999999,
            shininess: 100,
            shading: THREE.SmoothShading,
            opacity: 0.3,
            transparent: true
        });
        var glassGeo1 = new THREE.CubeGeometry(data.length * 100 + 50, 245, 2, 1, 1, 1);
        var glassGeo2 = new THREE.CubeGeometry(2, 245, data[0].length * 100 + 50, 1, 1, 1);
        var glassGeo3 = new THREE.CubeGeometry(data.length * 100 + 50, 2, data[0].length * 100 + 50, 1, 1, 1);
        var BackGlassMesh = new THREE.Mesh(glassGeo1, glassMat);
        BackGlassMesh.position.z = -(data[0].length * 100 + 50)/2;
        backGroundGlass.add(BackGlassMesh);

        var sideGlassR = new THREE.Mesh(glassGeo2, glassMat);
        sideGlassR.position.x = (data.length * 100 + 50) / 2;

        var sideGlassL = new THREE.Mesh(glassGeo2, glassMat);
        sideGlassL.position.x = -(data.length * 100 + 50) / 2;
        var upperGlass = new THREE.Mesh(glassGeo3, glassMat);
        upperGlass.position.y = 245 /2;
        backGroundGlass.add(upperGlass);
        backGroundGlass.add(sideGlassR);
        backGroundGlass.add(sideGlassL);
        gridBox.add(backGroundGlass);
        return gridBox;

    }



    function createText2D(text, color, font, size, segW, segH) {
        var material = new THREE.MeshPhongMaterial({
            //ambient: 0x000000,
            color: "#000",
            shading: THREE.SmoothShading,
            opacity: 1
            //transparent: true
        });

        var textData = {
            size: 10,
            height: 2,
            curveSegments: 3,
            font: "helvetiker",
            //weight: "bold",
            style: "normal",
            stroke: 0xfff,

            bevelEnabled: false
        };
        var geometry = new THREE.TextGeometry(text, textData);
        geometry.data = textData;
        geometry.data.textContent = text;
        var labelobj = new THREE.Mesh(geometry, material);
        return labelobj;
    }





    return {


        getGroupedBarChart : function (dataArray) {

           var csvData = convertDataFormat(dataArray);
            return drawGrBarChart(csvData.data, csvData.labels, csvData.groupArr);
        }
    }
});