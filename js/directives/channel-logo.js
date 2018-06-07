app.directive('channelLogo',function(){
return {
    restrict:"EA",//Element and Attributes
    //template:"<h1>Hello</h1>
    template : function(element,attribute){
        //alert(attribute.size);
        return "<h"+attribute.size+">Hello "+attribute.val+"</h"+attribute.size+">";
    }

}
});