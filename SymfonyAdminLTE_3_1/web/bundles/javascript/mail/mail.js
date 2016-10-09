/* ViewModel */
var pageViewModel = null;
function PageViewModel(nowPage) {
    this.nowPage = ko.observable(nowPage);
}

/* Dashboard */
$(function() {
    pageViewModel = new PageViewModel("Mail");
    ko.applyBindings(getMainViewModel());
    //ko.applyBindings(pageViewModel, document.getElementById("_subPage"));
});