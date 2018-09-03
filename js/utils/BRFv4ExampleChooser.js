(function() {
	"use strict";

	if(typeof QuickSettings === "undefined") return;

	var urlMap 	= {

		"+++ basic - face detection +++":						null,



		



		"+++ advanced - face tracking +++":						null,

		"advanced - face tracking - blink detection":			"js/examples/face_tracking/blink_detection.js",
    "advanced - face tracking - blink detection center":			"js/examples/face_tracking/blink_detection_center.js",
		"MODEL1":			"js/examples/face_tracking/ThreeJS_example1.js",
		"MODEL2": "js/examples/face_tracking/ThreeJS_example2.js",

		"advanced - face tracking - face texture overlay":		["assets/brfv4_face_textures.js", "js/examples/face_tracking/face_texture_overlay.js"],
		"advanced - face tracking - face swap (two faces)":		"js/examples/face_tracking/face_swap_two_faces.js"
	};
	var labels = [];
	for (var key in urlMap) { labels.push(key); } // Fill in the labels.

	function onExampleLoaded() {
		brfv4Example.reinit();
	}

	var _isFirstSelect = true;
	function onExampleChosen(data) {

		if(_isFirstSelect) return;

		var url = urlMap[data.value];

		if(url) {
			if(typeof url === "string") {
				brfv4Example.loader.loadExample([url], onExampleLoaded);
			} else {
				brfv4Example.loader.loadExample(url, onExampleLoaded);
			}
		} else {
			if(data.index >= 0) {
				brfv4Example.gui.exampleChooser.setValuesFromJSON({ "_example": data.index + 1});
			}
		}
	}

	if(!brfv4Example.gui.exampleChooser) {

		QuickSettings.useExtStyleSheet();



		brfv4Example.gui.exampleChooser = QuickSettings.create(
			
		)

		brfv4Example.gui.exampleChooser = QuickSettings.create(
			2, 2, "MODEL CHOOSER", brfv4Example.dom.createDiv("_settingsRight"))
			.setWidth(250)
			.addDropDown("_example", labels, onExampleChosen)
			.hideTitle("_example")
			.setValuesFromJSON({ "_example": 6}); // "basic - face tracking - track single face"

		_isFirstSelect = false;
	}
})();