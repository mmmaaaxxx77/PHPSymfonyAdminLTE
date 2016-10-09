/*
 處理ajax
 */
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		function getCookie(name) {
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
		//if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
		// Only send the token to relative URLs i.e. locally.
		xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		//}
	}
});
/*
 Shared Method
 */
function GetURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}
/*
 Modals
 */
var _okFunction = function() {
};
function displayMessageDialog(message, okFunction) {
	if (okFunction != null)
		_okFunction = okFunction;
	$("#sharedDialogMessage").html(message);
	$("#sharedMessageDialog").modal('show');
	$('#sharedMessageDialog').unbind('hidden.bs.modal');
}

function doOkFunction() {
	if (_okFunction != null) {
		_okFunction();
	}
	$("#sharedMessageDialog").modal('hide');
}

var confirmFunction = function() {
};
var cancelFunction = function() {
};
function displayConfirmDialog(message, confirmFunctionP, cancelFunctionP) {
	if (confirmFunctionP != null) {
		confirmFunction = confirmFunctionP;
	}
	if (cancelFunctionP != null) {
		cancelFunction = cancelFunctionP;
	}
	$("#sharedConfirmMessage").html(message);
	$("#sharedConfirmDialog").modal('show');
}

function doConfirmDialogFunction() {
	if (confirmFunction != null)
		confirmFunction();
	$("#sharedConfirmDialog").modal('hide');
}

function doCancelDialogFunction() {
	if (cancelFunction != null)
		cancelFunction();
	$("#sharedConfirmDialog").modal('hide');
}