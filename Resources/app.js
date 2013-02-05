// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#142938');
var osname = Ti.Platform.osname, devHeight = Ti.Platform.displayCaps.platformHeight, devWidth = Ti.Platform.displayCaps.platformWidth;
var isTablet = (osname === 'android' && (devWidth > 899 || devHeight > 899)) ? true : false;
//activity Indicator
var actInd = null;

function showIndicator() {
	// loading indicator

	actInd = Titanium.UI.createActivityIndicator({
		width : 'auto',
		height : 'auto',
		bottom : 20
	});

	actInd.message = L('app_loading');
	actInd.show();
}

function hideIndicator() {
	actInd.hide();
}

Titanium.App.addEventListener('show_indicator', function(e) {
	showIndicator();
});
Titanium.App.addEventListener('hide_indicator', function(e) {
	hideIndicator();
});
;
// end


var mainWindow = Ti.UI.createWindow({
	navBarHidden : true,
	fullscreen : true,
	exitOnClose : true,
	orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
	url : 'UI/mainWindow.js'
});

mainWindow.open();
Ti.App.fireEvent('show_indicator');