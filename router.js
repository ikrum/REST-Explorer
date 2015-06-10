var Router = function () {
	this.list = [];
	this.notFoundFunc = '';
	this.invalidRequestFunc = "";
};

Router.prototype.addRoute = function(requestMethod,uri,execFunc) {
  this.list.push({requestMethod:requestMethod,uri:uri,execFunc:execFunc});
};
Router.prototype.run = function(requestMethod,uri) {
	
	uriPattern = uri.replace(/(\d+)/g,":id");
	var routeExists = false;
	var requestMatch = false;
	
	for(i=0;i<this.list.length;i++){
		if(this.list[i].uri == uriPattern)
			routeExists = true;
			
		if(this.list[i].requestMethod == requestMethod && this.list[i].uri == uriPattern ){
			// Invoke the function
			window[this.list[i].execFunc]();
			requestMatch = true;
			break;
		}
		
		
	}
	// if url matched and request method is invalid
	if(!requestMatch && routeExists){
		if(this.invalidRequestFunc)
			window[this.invalidRequestFunc]();
	}
	else if(!requestMatch && !routeExists){
		if(this.notFoundFunc)
			window[this.notFoundFunc]();
	}
		
};

Router.prototype.setNotFound = function(notFoundFunc) {
	if(notFoundFunc)
		this.notFoundFunc = notFoundFunc;
	
}
Router.prototype.setInvalidRequestMethod = function(invalidRequestFunc) {
	if(invalidRequestFunc)
		this.invalidRequestFunc = invalidRequestFunc;
	
}




/* Example Uses 
var appRouter = new Router();
appRouter.addRoute("POST","/contacts","CreateContact");
appRouter.addRoute("DELETE","/contacts/34/hambi","DeleteContact");
appRouter.addRoute("GET","/contacts","GetContacts");
appRouter.setNotFound();

appRouter.test();
appRouter.run("DELETE","/contacts/34/hamdbi");


function DeleteContact(){
	
	alert("DeleteContact function Called");
}

*/
