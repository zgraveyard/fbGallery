var tblView, osname = Ti.Platform.osname, devHeight = Ti.Platform.displayCaps.platformHeight, devWidth = Ti.Platform.displayCaps.platformWidth;

var isTablet = (osname === 'android' && (devWidth > 899 || devHeight > 899)) ? true : false;

var limit = (isTablet) ? Ti.App.Properties.getString('imagesTabletLimit') : Ti.App.Properties.getString('imagesLimit');

exports.imagesGallery = function(_args) {
	if (_args === undefined)
		_args = {};
	var url = (_args.url === undefined ) ? Ti.App.Properties.getString('imagesURL') + limit : _args.url;

	tblView = Ti.UI.createTableView({
		height : Ti.UI.FILL,
		backgroundColor : 'white',
		top : 0,
		opacity : 0.9,
	});

	var selfView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		top : 70,
		bottom : 30,
	});

	get_images(url);

	selfView.add(tblView);
	return selfView;

};

var fbSharing = function(link) {

	var resultNotification = Ti.UI.createNotification({
		message : L('sharing_done'),
		duration : Ti.UI.NOTIFICATION_DURATION_LONG
	});
	Ti.Facebook.request('links.post', {
		url : link
	}, function(e) {
		if (e.success) {
			Titanium.Analytics.featureEvent('app.feature.facebookSharingDone');
			resultNotification.message = L('sharing_done');
			Ti.App.fireEvent('hide_indicator');
			resultNotification.show();
		} else {
			Titanium.Analytics.featureEvent('app.feature.facebookSharingError');
			resultNotification.message = L('sharing_error');
			Ti.App.fireEvent('hide_indicator');
			resultNotification.show();
		}
	});
}
var rssHandler = function() {
	var items = JSON.parse(this.responseText);
	var images = items.data;
	// var totalHeight = null;

	var data = [];

	var width = height = (isTablet) ? 140 : 80;

	var imgNo = parseInt(devWidth / (width + 30));

	var tableRowHeight = (isTablet) ? parseInt((limit / imgNo) * (height + 20)) + 60 : parseInt((limit / imgNo) * (height + 20)) + 20;

	var imageThumbs = Ti.UI.createTableViewRow({
		className : 'imageRow',
		objName : 'imageRow',
		width : Ti.UI.FILL,
		height : tableRowHeight,
		layout : 'horizontal',
		backgroundSelectedColor : 'transparent',
		touchEnabled : false,
		borderColor : 'white',
		borderWidth : 5
	});
	
	var buttonsContainer = Ti.UI.createTableViewRow({
		width : Ti.UI.FILL,
		height : '52',
		backgroundSelectedColor : 'transparent',
		touchEnabled : false,
		borderColor : 'white',
		borderWidth : 5
	});	

	for (var i = 0; i < images.length; i++) {

		var currImage = images[i].images[7];
		var cachedImage = require('/util/cachedImage');
		
		var bg = Ti.UI.createImageView({
			zIndex : 1,
			touchEnabled : true,
			top : 10,
			left : 15,
			right : 15,
			bottom : 10,
			width : width,
			height : height,
			imageId : i,
			type : 'image',
		});
		
		cachedImage.cachedImageView('lens/dimashqi',currImage.source,bg);
		
		imageThumbs.add(bg);

	}

	data.push(imageThumbs);
	data.push(buttonsContainer);

	tblView.addEventListener('click', function(e) {
		if (e.source.type === 'image') {
			createSliders(images, e.source.imageId);
		}
	});

	tblView.setData(data);

	data = null;

	Ti.App.fireEvent('hide_indicator');

};

var createSliders = function(images, imageId) {
	Ti.App.fireEvent('show_indicator');
	var views = [];
	var sliderWin = Ti.UI.createWindow({
		fullscreen : true,
		backgroundColor : 'black',
		opacity : 0.9,
		navBarHidden : true,
		orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
		windowSoftInputMode:Ti.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED  //** important to make a heavyweight window
		// orientationModes : [Ti.UI.LANDSCAPE_RIGHT]
	});

	for (var n = 0; n < images.length; n++) {
		var imageContainer = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			left : 0,
			type : 'container'
		});
		
		var imgSource = images[n] ;
		
		if(devWidth < 600)
		{
			imgSource = images[n].images[4];
		}
		else if(devWidth < 720)
		{
			imgSource = images[n].images[3];
		}
		else if(isTablet)
		{
			imgSource = images[n].images[1]
		}
		
		var image = Ti.UI.createImageView({
			image : imgSource.source,			title : images[n].name,
			width : imgSource.width,
			height : (imgSource.height > devHeight ) ? devHeight : imgSource.height,
			touchEnabled : false,
			// defaultImage : 'progressbar.gif',
		});

		// image.addEventListener('pinch', function(e) {
			// var t = Ti.UI.create2DMatrix().scale(e.scale);
			// e.source.transform = t;
		// });

		var eventLabel = Ti.UI.createLabel({
			html : images[n].name,
			color : 'white',
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			top : 5,
			bottom : 5,
			right : 5
		});

		Titanium.Facebook.appid = Ti.App.Properties.getString('facebookappid');
		Titanium.Facebook.permissions = ['publish_stream'];

		var share = Ti.UI.createButton({
			backgroundImage : '/fb_share.png',
			height : '42',
			width : '122',
			top : 10,
			left : -150,
			link : images[n].link,
			visible : false,
		});

		share.addEventListener('click', function(e) {
			Titanium.Analytics.featureEvent('app.feature.facebookSharingClicked');
			if (!Ti.Facebook.loggedIn) {
				var sourceLink = e.source.link;
				Ti.Facebook.addEventListener('login', function(e) {
					if (e.success) {
						Ti.App.fireEvent('show_indicator');
						fbSharing(sourceLink);
					} else if (e.error) {
						alert(e.error);
					} else if (e.cancelled) {}
				});
				Ti.Facebook.authorize();
			} else {
				Ti.App.fireEvent('show_indicator');
				fbSharing(e.source.link);
			}
		});

		var labelContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			bottom : -60,
			backgroundColor : 'black',
			opacity : 0.6,
			width : Ti.UI.FILL,
			zIndex : 10,
			visible : false,
		});

		labelContainer.add(eventLabel);
		imageContainer.add(labelContainer);
		imageContainer.add(image);
		imageContainer.add(share);
		
		imageContainer.addEventListener('click',function(e){
			if(e.source.type === 'container')
			{
				var fbAnimate = Ti.UI.createAnimation({
					duration:500, 
					curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
				}), lbAnimate = Ti.UI.createAnimation({
					duration:500, 
					curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
				});				
				
				var childs = e.source.getChildren();
				
				if(!childs[0].visible)
				{
					childs[0].visible = true;
					childs[2].visible = true;
					
					//facebook share animation
					fbAnimate.left = 10;
					childs[2].animate(fbAnimate);
					
					//label container animation
					lbAnimate.bottom = 0;
					childs[0].animate(lbAnimate);
	
				}
				else
				{
					fbAnimate.left = -160;
					childs[2].animate(fbAnimate);
					fbAnimate.addEventListener('complete',function(){
						childs[2].visible = false;
					});
					
					lbAnimate.bottom = -60;
					childs[0].animate(lbAnimate);
					lbAnimate.addEventListener('complete',function(){
						childs[0].visible = false;
					});
				}	
			}
		});
		
		views.push(imageContainer);
	}

	var slider = Ti.UI.createScrollableView({
		top : 0,
		zIndex : 10,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		views : views,
		visible : false,
		zoomScale : 2,
		maxZoomScale : 30,
		minZoomScale : 1,
	});

	sliderWin.add(slider);
	slider.scrollToView(imageId);
	slider.setVisible(true);
	
	//creating the menu
	var activity = Ti.Android.currentActivity;
	sliderWin.activity.onCreateOptionsMenu = require('menu').applicationMenu;
	
	sliderWin.addEventListener("android:back", function(e) {
		sliderWin.remove(slider);
		slider.setVisible(false);
		sliderWin.close();
		slider = null;
		sliderWin = null;
	});

	sliderWin.open({
		modal : true
	});
	Ti.App.fireEvent('hide_indicator');

}
var get_images = function(url) {
	var xhr = Ti.Network.createHTTPClient({
		onload : rssHandler,
		//timeout : 5000,
		timeout : 1000000,
		onerror : function(e) {
			Titanium.Analytics.featureEvent('app.feature.appNetworkError');
			Ti.API.debug(e.error);
			Ti.App.fireEvent('hide_indicator');
			alert(L('app_internet_problem') + e.error);
		},
	});

	xhr.open('GET', url);
	xhr.send();
};
