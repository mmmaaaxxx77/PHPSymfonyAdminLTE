/* ViewModel */
var pageViewModel = null;
function PageViewModel(nowPage) {
    var viewModel = this;
    this._dummyObservable = ko.observable();
    this.nowPage = ko.observable(nowPage);

}

/* Register */
$(function() {
    pageViewModel = new PageViewModel("帳號管理%>使用者");
    ko.applyBindings(getMainViewModel());
    ko.applyBindings(pageViewModel, document.getElementById("_subPage"));
});
