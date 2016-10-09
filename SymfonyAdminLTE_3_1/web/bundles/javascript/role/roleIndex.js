/* ViewModel */
var pageViewModel = null;
function PageViewModel(nowPage) {
    var viewModel = this;
    this._dummyObservable = ko.observable();
    this.nowPage = ko.observable(nowPage);

}

/* Dashboard */
$(function() {
    pageViewModel = new PageViewModel("帳號管理%>權限");
    ko.applyBindings(getMainViewModel());
    ko.applyBindings(pageViewModel, document.getElementById("_subPage"));
    getRoles();
});

var datatable = null;
function getRoles() {
    var pageSize = 10;
    var ajaxFun = function (sSource, aoData, fnCallback) {
        var url = _URLS['ALL_ROLE']

        var startO = null;
        var lengthO = null;
        var drawO = null;
        aoData.forEach(function (item) {
            if (item.name == "start") {
                startO = item;
            }
            if (item.name == "length") {
                lengthO = item;
            }
            if (item.name == "draw") {
                drawO = item;
            }
        });

        var page = Math.floor(startO.value / lengthO.value);
        page++;

        url = url.replace('_page_', page);
        url = url.replace('_size_', pageSize);

        if(pageViewModel.filter_list != null)
            url += "?role=" + pageViewModel.filter_list;

        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json',
            success: function (result) {
                if (result.success) {
                    var modelresult = [];
                    for (var i = 0; i < result.result.length; i++) {
                        modelresult.push(new Role(result.result[i]));
                    }
                    var dat = {
                        draw: drawO.value,
                        data: modelresult,
                        recordsTotal: result.result.length,
                        recordsFiltered: result.result.length
                    }
                    fnCallback(dat);
                } else {
                    alert("取得列表失敗。");
                    var dat = {
                        draw: drawO.value,
                        data: [],
                        recordsTotal: 0,
                        recordsFiltered: 0
                    }
                    fnCallback(dat);
                }
            },
            error: function (result) {
                alert("取得列表失敗。");
                var dat = {
                    draw: drawO.value,
                    data: [],
                    recordsTotal: 0,
                    recordsFiltered: 0
                }
                fnCallback(dat);
            }
        });
    }

    datatable = $('#roleList').DataTable(
        {
            "bProcessing": true,
            "pageLength": pageSize,
            "bServerSide": true,
            "bFilter": false,
            "bLengthChange": false,
            "columnDefs": [
                {
                    "targets": 0,
                    "searchable": false,
                    "orderable": false,
                    "title": "權限名稱",
                    "data": "name",
                    "render": function (data, type, full, meta) {
                        return data;
                    },
                    "width": "20%",
                    "className": "text-center"
                },
                {
                    "targets": 1,
                    "searchable": false,
                    "orderable": false,
                    "title": "說明",
                    "data": "description",
                    "render": function (data, type, full, meta) {
                        return data;
                    },
                    "width": "80%",
                    "className": "text-left"
                }
            ],
            "fnServerData": ajaxFun
        });
    $('#roleList tbody').on('mouseover', 'tr', function () {
        var data = datatable.row(this).data();
        //getWhoAmI(data.username);
    });

    $('#roleList tbody').on( 'click', 'tr', function () {
        var data = datatable.row(this).data();
    } );
}