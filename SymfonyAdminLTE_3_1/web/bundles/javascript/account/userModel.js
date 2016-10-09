function User(data){
    this.id = data.id;
    
    this.username = data.username!=null?data.username:null;
    this.email = data.email!=null?data.email:null;
    this.lastLogin = data.lastLogin!=null?data.lastLogin:null;
    this.createDate = data.createDate!=null?data.createDate:null;
    this.updateDate = data.updateDate!=null?data.updateDate:null;
    this.online = data.online!=null?data.online:null;
    this.isActive = data.isActive!=null?data.isActive:null;
    //this.image = data.image!=null?data.image:null;
    //this.groups = data.groups!=null?data.groups:[];
}