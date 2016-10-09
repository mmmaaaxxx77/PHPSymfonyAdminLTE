/* ViewModel */
var pageViewModel = null;
function PageViewModel(nowPage) {
    var viewModel = this;
    this._dummyObservable = ko.observable();
    this.nowPage = ko.observable(nowPage);

    this.filter_list = null;

    this.newUser = {
        username: ko.observable(null),
        email: ko.observable(null),
        password: ko.observable(null),
        repassword: ko.observable(null)
    }
    this.userProfile = {
        id: null,
        username: ko.observable(null),
        email: ko.observable(null),
        profile_image: ko.observable(null),
        groups: ko.observableArray([]),
        selectGroups: [],
        permissions: ko.observableArray([]),
        selectPermissions: []
    }
    this.editUserProfile = {
        id: null,
        name: ko.observable(null),
        email: ko.observable(null),
        profile_image: ko.observable(null),
        groups: ko.observableArray([]),
        selectGroups: [],
        permissions: ko.observableArray([]),
        selectPermissions: []
    }
    this.editprofileImage = ko.pureComputed(function () {
        pageViewModel._dummyObservable();
        return _BASE_URL + this.editUserProfile.profile_image();
    }, this);
    /*this.profileImage = ko.pureComputed(function () {
        pageViewModel._dummyObservable();
        return _BASE_URL + this.userProfile.profile_image();
    }, this);*/

}

/* Dashboard */
$(function() {
    pageViewModel = new PageViewModel("帳號管理%>使用者");
    ko.applyBindings(getMainViewModel());
    ko.applyBindings(pageViewModel, document.getElementById("_subPage"));
    getUsers();
});

var datatable = null;
function getUsers() {
    var pageSize = 10;
    var ajaxFun = function (sSource, aoData, fnCallback) {
        var url = _URLS['ALL_USER']

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
                        modelresult.push(new User(result.result[i]));
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

    datatable = $('#userList').DataTable(
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
                    "title": "選項",
                    "data": "id",
                    "render": function (data, type, full, meta) {
                        //var html = "";
                        //html += '<button type="button" class="btn btn-xs btn-default deleteBtn" onClick="showEditWhoAmI(\'' + data + '\')"><i class="fa fa-fw fa-pencil"></i></button>'
                        //html += '<button type="button" class="btn btn-xs btn-danger deleteBtn" onClick="deleteUser(\'' + data + '\')"><i class="fa fa-fw fa-remove"></i></button>'
                        //return html;

                        var html = "";
                        html += '<div class="btn-group">';
                        html += '<button type="button" class="btn btn-xs btn-default" onclick="editUser(\'' + full.id + '\')">Edit</button>';
                        html += '<button type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">';
                        html += '<span class="caret"></span>';
                        html += '<span class="sr-only">Toggle Dropdown</span>';
                        html += '</button>';
                        html += '<ul class="dropdown-menu" role="menu">';
                        var isActive = 1;
                        var active_label = "帳號啟用";
                        if(full.isActive) {
                            isActive = 0;
                            active_label = "帳號關閉";
                        }
                        html += '<li><a style="cursor: pointer" onclick="updateUserActive(\'' + full.id + '\', ' + isActive + ')">' + active_label + '</a></li>';
                        html += '<li class="divider"></li>';
                        html += '<li><a style="cursor: pointer" onclick="deleteUser(\''+ full.id +'\')">Delete</a></li>';
                        html += '</ul>';
                        html += '</div>';
                        return html;
                    },
                    "width": "10%",
                    "className": "text-left"
                },
                {
                    "targets": 1,
                    "searchable": false,
                    "orderable": false,
                    "title": "使用者名稱",
                    "data": "username",
                    "render": function (data, type, full, meta) {
                        return data;
                    },
                    "width": "20%",
                    "className": "text-left"
                },
                {
                    "targets": 2,
                    "searchable": false,
                    "orderable": false,
                    "title": "EMAIL",
                    "data": "email",
                    "render": function (data, type, full, meta) {
                        return data;
                    },
                    "width": "30%",
                    "className": "text-left"
                },
                {
                    "targets": 3,
                    "searchable": false,
                    "orderable": false,
                    "title": "最後登入",
                    "data": "lastLogin",
                    "render": function (data, type, full, meta) {
                        //return data
                        return data != null ? moment.unix(data).format('YYYY-MM-DD HH:mm:ss') : "";
                    },
                    "width": "15%",
                    "className": "text-right"
                },
                {
                    "targets": 4,
                    "searchable": false,
                    "orderable": false,
                    "title": "建立日期",
                    "data": "createDate",
                    "render": function (data, type, full, meta) {
                        return data != null ? moment.unix(data).format('YYYY-MM-DD') : "";
                    },
                    "width": "15%",
                    "className": "text-right"
                },
                {
                    "targets": 5,
                    "searchable": false,
                    "orderable": false,
                    "title": "啟用",
                    "data": "isActive",
                    "render": function (data, type, full, meta) {
                        if(data == "1" || data == true || data == 1)
                            return "<i class='fa fa-circle text-success'></i>  啟用";
                        return "<i class='fa fa-circle text-red'></i>  關閉";

                    },
                    "width": "10%",
                    "className": "text-center"
                }

            ],
            "fnServerData": ajaxFun
        });
    $('#userList tbody').on('mouseover', 'tr', function () {
        var data = datatable.row(this).data();
        //getWhoAmI(data.username);
    });

    $('#userList tbody').on( 'click', 'tr', function () {

        var data = datatable.row(this).data();
    } );
}

function bindSimpleUserCreate() {

    var formData = new FormData();
    formData.append('username', pageViewModel.newUser.username());
    //var password = CryptoJS.MD5(pageViewModel.newUser.password());
    var password = pageViewModel.newUser.password();
    formData.append('password', password);
    formData.append('email', pageViewModel.newUser.email());
    //if ($("#profile_image")[0].files.length != 0)
    //    formData.append('file', $("#profile_image")[0].files[0]);

    var fun = function () {
        $.ajax({
            url: _URLS["NEW_USER"],
            type: 'POST',
            data: formData,
            //async: false,
            success: function (data) {
                if (data.success) {
                    clearSimpleUserCreate();
                    datatable.ajax.reload();
                } else {

                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }
    displayConfirmDialog("確認新增？", fun);
}

function clearSimpleUserCreate() {
    pageViewModel.newUser.name(null);
    pageViewModel.newUser.email(null);
    pageViewModel.newUser.password(null);
    pageViewModel.newUser.repassword(null);
    $("#profile_image").val(null)
}

function filterUserList(role){
    pageViewModel.filter_list = role;
    datatable.ajax.reload();
}

function updateUserActive(id, active){
    var formData = new FormData();
    formData.append('active', active);
    formData.append('id', id);

    var fun = function () {
        $.ajax({
            url: _URLS["UPDATE_USER_ACTIVE"],
            type: 'POST',
            data: formData,
            //async: false,
            success: function (data) {
                datatable.ajax.reload();
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    fun();
}

function deleteUser(id){
    var formData = new FormData();
    formData.append('id', id);

    var fun = function () {
        $.ajax({
            url: _URLS["DELETE_USER"],
            type: 'POST',
            data: formData,
            //async: false,
            success: function (data) {
                datatable.ajax.reload();
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    displayConfirmDialog("確認刪除？", fun);
}

function editUser(id){
    document.location.href=_URLS["EDIT_USER"].replace('_userId_', id);
}