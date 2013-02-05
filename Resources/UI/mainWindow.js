var self = Ti.UI.currentWindow;
Ti.include('/util/functions.js');

// the header of the app
var headerView = Ti.UI.createView({
	width : Ti.UI.FILL,
	height : 70,
	backgroundColor : '#12202A',
	top : 0,
	left : 0
});

var logo = Ti.UI.createImageView({
	image : '/appicon.png',
	width : 64,
	height : 64,
	top : 3,
	right : 10,
	bottom : 3

});

headerView.add(logo);

var mainView = require('full').imagesGallery();

Titanium.App.addEventListener('refresh', function(e) {

	Ti.App.fireEvent('show_indicator');
	self.remove(mainView);
	mainView = null;

	if (e.url !== undefined) {
		mainView = require('full').imagesGallery({
			url : e.url
		});
	} else {
		mainView = require('full').imagesGallery();
	}

	self.add(mainView);
});

// the footer of the app
var footerView = Ti.UI.createView({
	width : Ti.UI.FILL,
	height : 30,
	backgroundColor : '#12202A',
	bottom : 0,
	left : 0
});

var copyRight = Ti.UI.createLabel({
	text : L('app_copyright'),
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE,
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	top : 5,
	left : 10,
	color : '#fff',
	shadowColor : "#999",
	shadowOffset : {
		x : 0,
		y : 1
	}
});

var lastupdate = Ti.UI.createLabel({
	text : L('app_lastupdate') + ' ' + formatDate(),
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE,
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	top : 5,
	right : 10,
	color : '#fff',
	shadowColor : "#999",
	shadowOffset : {
		x : 0,
		y : 1
	}
});

footerView.add(copyRight);
footerView.add(lastupdate);
//end of the app
self.add(headerView);
self.add(mainView);
self.add(footerView);

//creating the menu
var activity = Ti.Android.currentActivity;
self.activity.onCreateOptionsMenu = require('menu').applicationMenu;

self.addEventListener('open', function() {
	if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
		alert(L('app_no_internet'));
		var act = Ti.Android.currentActivity;
		act.finish();
	}
});
