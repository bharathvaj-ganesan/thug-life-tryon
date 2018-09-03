(function exampleCode() {
	'use strict';

	var numFacesToTrack = 1; // Set the number of faces to detect and track.

	brfv4Example.initCurrentExample = function(brfManager, resolution, draw) {
		brfManager.init(resolution, resolution, brfv4Example.appId);
		brfManager.setNumFacesToTrack(numFacesToTrack);

		// Relax starting conditions to eventually find more faces.

		var maxFaceSize = resolution.height;

		if (resolution.width < resolution.height) {
			maxFaceSize = resolution.width;
		}

		brfManager.setFaceDetectionParams(maxFaceSize * 0.2, maxFaceSize * 1.0, 12, 8);
		brfManager.setFaceTrackingStartParams(maxFaceSize * 0.2, maxFaceSize * 1.0, 32, 35, 32);
		brfManager.setFaceTrackingResetParams(maxFaceSize * 0.15, maxFaceSize * 1.0, 40, 55, 32);

		// Load all image masks for quick switching.

		prepareImages(draw);

		// Add a click event to cycle through the image overlays.

		// draw.clickArea.addEventListener('click', onClicked);
		// draw.clickArea.mouseEnabled = true;
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {
		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(), false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(), false, 2.0, 0xffd200, 1.0);

		// Get all faces. The default setup only tracks one face.

		var faces = brfManager.getFaces();

		// If no face was tracked: hide the image overlays.

		var face = faces[0]; // get face
		var baseNode0 = _baseNodes[0]; // get image container
		var baseNode1 = _baseNodes[1]; // get image container
		if (face.state === brfv4.BRFState.FACE_TRACKING_START || face.state === brfv4.BRFState.FACE_TRACKING) {
			// Face Tracking results: 68 facial feature points.

			// draw.drawTriangles(face.vertices, face.triangles, false, 1.0, 0x00a0ff, 0.4);
			// draw.drawVertices(face.vertices, 2.0, false, 0x00a0ff, 0.4);

			// Set position to be nose top and calculate rotation.

			// console.log(`X: ${face.rotationX} Y: ${face.rotationY} Z: ${face.rotationZ}`);

			baseNode0.x = face.points[27].x;
			baseNode0.y = face.points[27].y;
			baseNode1.x = face.points[59].x;
			baseNode1.y = face.points[59].y;
			baseNode0.scaleX = (face.scale / 480) * (1 - toDegree(Math.abs(face.rotationY)) / 110.0);
			baseNode0.scaleY = (face.scale / 480) * (1 - toDegree(Math.abs(face.rotationX)) / 110.0);
			baseNode0.rotation = toDegree(face.rotationZ);

			baseNode0.alpha = 1.0;
			baseNode1.scaleX = (face.scale / 480) * (1 - toDegree(Math.abs(face.rotationY)) / 110.0);
			baseNode1.scaleY = (face.scale / 480) * (1 - toDegree(Math.abs(face.rotationX)) / 110.0);
			baseNode1.rotation = toDegree(face.rotationZ);

			baseNode1.alpha = 1.0;
			// console.log(`X: ${face.rotationX} Y: ${face.rotationY} Z: ${face.rotationZ}`);
		} else {
			baseNode0.alpha = 0.0;
			baseNode1.alpha = 0.0;
		}
	};

	function addImageToNode(bitmap, index) {
		bitmap.scaleX = _imageScales[index];
		bitmap.scaleY = _imageScales[index];

		bitmap.x = -parseInt(bitmap.getBounds().width * bitmap.scaleX * 0.5);
		bitmap.y = -parseInt(bitmap.getBounds().height * bitmap.scaleY * 0.45);

		_baseNodes[index].addChild(bitmap);
	}

	function prepareImages(draw) {
		// draw.imageContainer.removeAllChildren();

		var i = 0;
		var l = 0;

		for (i = 0, l = 2; i < l; i++) {
			var baseNode = new createjs.Container();
			draw.imageContainer.addChild(baseNode);
			_baseNodes.push(baseNode);
		}
		_images[0] = new createjs.Bitmap(_imageURLs[0]);
		_images[1] = new createjs.Bitmap(_imageURLs[1]);

		_images[0].image.onload = function() {
			addImageToNode(_images[0], 0);
		};
		_images[1].image.onload = function() {
			addImageToNode(_images[1], 1);
		};
	}

	var _imageURLs = ['assets/thug_glass.png', 'assets/cig.png'];
	var _imageScales = [0.6, 1];

	var _images = [];
	var _image = null;

	var _baseNodes = [];

	var toDegree = function(x) {
		return (x * 180.0) / Math.PI;
	};
	console.log(`DEgree : ${toDegree}`);

	brfv4Example.dom.updateHeadline(
		'BRFv4 - advanced - face tracking - PNG/mask image overlay.\n' + 'Click to cycle through images.'
	);

	brfv4Example.dom.updateCodeSnippet(exampleCode + '');
})();
