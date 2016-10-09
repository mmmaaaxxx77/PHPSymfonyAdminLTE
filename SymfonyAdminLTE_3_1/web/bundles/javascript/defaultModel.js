/*
    model
 */
function Badge(data) {
    if(data.text == null)
    	this.text = ko.observable(null);
    else
        this.text = ko.observable(data.text);

    if(data.color == null)
        this.color = ko.observable("label pull-right label-primary");
    else
	    this.color = ko.observable(data.color);

}

function Menu(data) {
    // id
    if(data.id == null)
        this.id = (new Date()).getUTCMilliseconds() + "" + Math.floor((Math.random() * 10000)+1) + "";
    else
        this.id = data.id;
    // title
    if(data.title == null)
        this.title = "No Title";
    else
        this.title = data.title;
    // description
    if(data.description == null)
        this.description = "No Description";
    else
        this.description = data.description;
    // icon
    if(data.icon == null)
        this.icon = "fa fa-circle-o";
    else
	    this.icon = data.icon;
    // url
    if(data.url == null)
	    this.url = "#";
    else
        this.url = data.url;
    // badge
    if(data.badge == null)
	    this.badge = new Badge({});
    else
        this.badge = new Badge(data.badge);
    // active
    // true or false
    if(data.active == null)
	    this.active = false;
    else
        this.active = data.active;
    // subMenuList
    // array
    if(data.subMenuList == null)
        this.subMenuList = [];
    else
	    this.subMenuList = data.subMenuList;
}

