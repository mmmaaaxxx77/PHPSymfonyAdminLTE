function Role(data){
    this.id = data.id;
    
    this.name = data.name!=null?data.name:null;
    this.description = data.description!=null?data.description:null;
}