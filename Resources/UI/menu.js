exports.applicationMenu = function(e) {
	var menu = e.menu;
	var activity = Ti.Android.currentActivity;

	var m1 = menu.add({
		title : L('app_exit')
	});
	m1.setIcon(Titanium.Android.R.drawable.ic_lock_power_off);
	m1.addEventListener('click', function(e) {
		activity.finish();
	});

	var m2 = menu.add({
		title : L('app_about')
	});
	m2.setIcon(Ti.Android.R.drawable.ic_dialog_info);
	m2.addEventListener('click', function() {
		var aboutTitle = Ti.UI.createLabel({
			text : L('app_about'),
			color : 'black',
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			font : {
				fontSize : 20,
				fontWeight : 'bold'
			},
			right : 10,
			top : 5
		});

		var twitter = 'twitter : http://twitter.com/' + Ti.App.Properties.getString('twitter');
		var googlePlus = 'g+: ' + Ti.App.Properties.getString('google');

		var aboutLabel = Ti.UI.createLabel({
			text : twitter + '\n' + googlePlus,
			color : 'black',
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			font : {
				fontSize : 16,
				fontWeight : 'bold'
			},
			right : 10,
			top : 40,
			left : 100,
			autoLink : Ti.UI.Android.LINKIFY_ALL,
		});

		var logo = Ti.UI.createImageView({
			image : 'appicon.png',
			left : 10,
			top : 10,
			width : 'auto',
			height : 'auto'
		});

		var containerView = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			opacity : 1,
			backgroundColor : 'white',
			borderColor : 'white',
			borderWidth : 1,
			borderRadius : 5
		});


		containerView.add(aboutTitle);
		containerView.add(aboutLabel);
		containerView.add(logo);

		var scrollView = Ti.UI.createScrollView({
			contentWidth : Ti.UI.SIZE,
			contentHeight : Ti.UI.SIZE,
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : false,
			height : '90%',
			width : '90%'
		});
		scrollView.add(containerView);

		var containerWin = Ti.UI.createWindow({
			navBarHidden : true,
			fullscreen : true,
			opacity : 0.8,
			backgroundColor : 'black'
		});

		containerWin.addEventListener("android:back", function(e) {
			scrollView.remove(containerView);
			containerWin.remove(scrollView);
			containerWin.close();
			containerWin = null;
		});

		containerWin.add(scrollView);
		containerWin.open();

	});
	//
	var m3 = menu.add({
		title : L('app_refresh')
	});
	m3.setIcon(Ti.Android.R.drawable.ic_popup_sync);
	m3.addEventListener('click', function() {
		Ti.App.fireEvent('refresh');
	});

	var m4 = menu.add({
		title : L('app_feedback')
	});

	m4.setIcon(Ti.Android.R.drawable.ic_dialog_email);

	m4.addEventListener('click', function() {
		var emailDialog = Ti.UI.createEmailDialog()
		emailDialog.subject = L('app_feedback');
		emailDialog.toRecipients = [Ti.App.Properties.getString('emailaddress')];
		emailDialog.messageBody = '';
		emailDialog.addEventListener('complete', function(e) {
			//Check the mail is completely sent or not
			if (e.result == emailDialog.SENT) {
				alert(L('app_mail_sent'));
			}
		});
		emailDialog.open();
	});

	var m5 = menu.add({
		title : L('app_facebook')
	});

	m5.addEventListener('click', function() {
		Ti.Platform.openURL(Ti.App.Properties.getString('facebookURL'));

	});

};
