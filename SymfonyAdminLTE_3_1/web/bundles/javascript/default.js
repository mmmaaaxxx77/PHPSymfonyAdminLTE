/* ajax 處理 */
$(function() {
	/*$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
		// 登入失效
		if (jqxhr.status == 403) {
			displayMessageDialog("登入逾時，請重新登入。", function(){location.href = SERVICE_URL["root"] + "/login";});
		}
	});
	$(document).ajaxSuccess(function(event, jqxhr, settings, thrownSuccess) {
		// console.log( "Triggered ajaxSuccess handler." );
	});*/
});

/* view binding */
$(function() {
	ko.bindingHandlers.stopBinding = {
		init : function() {
			return {
				controlsDescendantBindings : true
			};
		}
	};
	ko.virtualElements.allowedBindings.stopBinding = true;
});


/* main viewmodel */
function MainViewModel(menu) {
	// menu
	this.menuData = ko.observableArray(menu);
	// breadcrumb
	this.breadcrumb = ko.computed(function() {
		return getBreadcrumb(this.menuData());
    }, this);
	// now page
	this.nowPage = ko.computed(function() {
		return getNowPage(this.menuData());
    }, this);
}

/* Function */
var mainViewModel = null;
function getMainViewModel() {
	mainViewModel = new MainViewModel(getMenuList());
	return mainViewModel;
}

// creat Menu model list from MENU_LIST
function getMenuList(){
	var result = [];

	// get pageViewModel
	var nowPage = pageViewModel.nowPage();
	// 用"%>"代表page的階層, 例如: 使用者%>新增使用者 頁面
	var pagelist = nowPage.split("%>");

	// create list
	for(var i = 0 ; i < MENU_LIST.length ; i++){
		// handle subMenuList
		if(MENU_LIST[i].subMenus != null)
			if(MENU_LIST[i].subMenus.length != 0)
				MENU_LIST[i].subMenuList = getSubMenus(MENU_LIST[i].subMenus);
		result[result.length] = new Menu(MENU_LIST[i]);
	}

	// set activate
	for(i in result){
		setActive(result[i], pagelist, 0);
	}

	return result;
}

// creat subMenus list with Menu model
function getSubMenus(subMenus){
	var result = [];
	for(i in subMenus){
		if(subMenus[i].subMenus != null)
			if(subMenus[i].subMenus.length != 0)
				subMenus[i].subMenuList = getSubMenus(subMenus[i].subMenus);
		result[result.length] = new Menu(subMenus[i]);

	}

	return result;
}

// set active for Menu model
function setActive(menu, pagelist, level){
	var pageName = pagelist[level];
	if(menu.title == pageName) {
		menu.active = true;
		level++;
		if(menu.subMenuList != null)
			if(menu.subMenuList.length != 0)
				for(i in menu.subMenuList)
					setActive(menu.subMenuList[i], pagelist, level);
	}
}

// get breadcrumb
function getBreadcrumb(list, result, level){
	if(result == null) {
		var result = [];
		var home = jQuery.extend(true, {}, list[1]);
		home.title = "HOME";
		result[result.length] = home;
	}
	// get pageViewModel
	var nowPage = pageViewModel.nowPage();
	// 用"%>"代表page的階層, 例如: 使用者%>新增使用者 頁面
	var pagelist = nowPage.split("%>");
	if(level == null)
		level = 0;

	for(i in list){
		if(list[i].title == pagelist[level] && list[i].id != "HEADER") {
			result[result.length] = list[i];
			level++;
			if (list[i].subMenuList != null)
				if (list[i].subMenuList.length != 0)
					getBreadcrumb(list[i].subMenuList, result, level);
		}
	}

	return result;
}

function getNowPage(list, result, level){
	if(result == null)
		var result = null;
	// get pageViewModel
	var nowPage = pageViewModel.nowPage();
	// 用"%>"代表page的階層, 例如: 使用者%>新增使用者 頁面
	var pagelist = nowPage.split("%>");
	if(level == null)
		level = 0;

	for(i in list){
		if(list[i].title == pagelist[level]) {
			result = list[i];
			level++;
			if (list[i].subMenuList != null)
				if (list[i].subMenuList.length != 0)
					result = getNowPage(list[i].subMenuList, result, level);
		}
	}

	return result;
}
