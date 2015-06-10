// ****** Request Routing *******
var appRouter = new Router();
appRouter.addRoute("GET",	"/api/contacts",		"getAllContacts");
appRouter.addRoute("POST","/api/contacts",		"addContact");
appRouter.addRoute("GET",	"/api/contacts,type=star",	"getAllFavouriteContacts");
appRouter.addRoute("GET",	"/api/contacts/:id",	"getContact");
appRouter.addRoute("PUT",	"/api/contacts/:id",	"updateContact");
appRouter.addRoute("DELETE","/api/contacts/:id",	"deleteContact");
appRouter.addRoute("PUT",	"/api/contacts/:id/star","addToFavourite");
appRouter.addRoute("DELETE","/api/contacts/:id/star","removeFromFavourite");
appRouter.setNotFound("notFound");
appRouter.setInvalidRequestMethod("invalidRequestMethod");

//appRouter.run("DELETE","/api/contacts/34/star");

// ****** Request Handling Methods ********
function getAllContacts(){
	var uri_param = "GET <b>/api/contacts</b> HTTP/1.1";
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html('');
	
	var list  = getStorageContacts(false,0);
	var json = JSON.stringify({"status":200,"contacts":list});
	$("#response-preview .text").jJsonViewer(json);
	
	
	syncViewTable();
	
	$.notify("Request successful", "success");
	$.notify("Preview updated", "success");
	
}
function addContact(){
	var uri_param = "POST <b>/api/contacts</b> HTTP/1.1";
	var name = $(".input-contact-name").val();
	var number = $(".input-contact-number").val();
	var email = $(".input-contact-email").val();
	var favourite = $(".input-contact-favourite").val();
	var id = getNextIndexId();
	var payload = getRequestPayload();
	var missingFields = '';
	
	if(!name)
		missingFields = "name";
	if(!number){
		if(!missingFields)
			missingFields = "number"
		else
		missingFields += ",number"
	}
	
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html(payload);
	
	if(missingFields){
		$.notify("Contact not added ! See API response",'error');
		$("#response-preview .text").jJsonViewer('{"status":400,"message":"Missing required field(s) '+missingFields+'"}');
		return;
	}
	
	
	var item = '<tr id="contact-row" class="row'+id+'">\
				<th scope="row" class="contact-id">'+id+'</th>\
				<td class="contact-name">'+name+'</td>\
				<td class="contact-number">'+number+'</td>\
				<td class="contact-email">'+email+'</td>\
				<td class="contact-is-favourite">'+favourite+'</td>\
			  </tr>';

	//var json = JSON.stringify('"status":200,"message":"New contact added successfully"}');
	$("#response-preview .text").jJsonViewer('{"status":200,"message":"New contact added successfully"}');
	$("#storage-practice-table #table-body").append(item);
	syncViewTable();
	$.notify("New contact added", "success");
	$.notify("Preview Updated !", "success");
}
function getAllFavouriteContacts(){
	var uri_param = "GET <b>/api/contacts/star</b> HTTP/1.1";
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html('');
	
	var list = getStorageContacts(true,0);
	var json = JSON.stringify({"status":200,"contacts":list});
	$("#response-preview .text").jJsonViewer(json);
	$.notify("Favourite contacts loaded!", "success");
	
	generateNewView(list);
}
function getContact(){
	var input_url = $("#input-url").val();
	var id = input_url.replace( /^\D+/g, '');
	
	var uri_param = "GET <b>"+input_url+"</b> HTTP/1.1";
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html('');
	
	list = getStorageContacts(false,parseInt(id))
	var json = JSON.stringify({"status":200,"contacts":list});
	$("#response-preview .text").jJsonViewer(json);
	$.notify("Contact loaded!", "success");
	generateNewView(list);
}
function updateContact(){
	var input_url = $("#input-url").val();
	var id = input_url.replace( /^\D+/g, '');
	
	var uri_param = "GET <b>"+input_url+"</b> HTTP/1.1";
	var payload = getRequestPayload();
	
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html(payload);
	
	selector = "#storage .row"+id;
	var contact = $("#storage .row"+id).html();
	
	var name = $(".input-contact-name").val();
	var number = $(".input-contact-number").val();
	var email = $(".input-contact-email").val();
	var favourite = $(".input-contact-favourite").val();
	
	if(contact){
		
		if(name)
			$(selector).find('td.contact-name').html(name);
		if(number)
			$(selector).find('td.contact-number').html(number);
		if(email)
			$(selector).find('td.contact-email').html(email);
		if(favourite)	
			$(selector).find('td.contact-is-favourite').html(favourite);
		if(payload){
			$("#response-preview .text").jJsonViewer('{"status":200,"message":"Contact updated!"}');
			$.notify("Contact updated!", "success");
			$.notify("Preview updated!", "success");
			syncViewTable();
		}else{
			$("#response-preview .text").jJsonViewer('{"status":400,"message":"Minimum one field is required to update contact"}');
			$.notify("ERROR! See the response!", "error");
		}
		
	}else{
		$("#response-preview .text").jJsonViewer('{"status":400,"message":"Contact does not exists."}');
		$.notify("ERROR! See the response!", "error");
	}
}
function deleteContact(){
	var input_url = $("#input-url").val();
	var id = input_url.replace( /^\D+/g, '');
	
	var uri_param = "DELETE <b>"+input_url+"</b> HTTP/1.1";
	
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html("");
	
	selector = "#storage .row"+id;
	var contact = $("#storage .row"+id).html();
	if(contact){
		$("#storage .row"+id).empty();
		$("#response-preview .text").jJsonViewer('{"status":200,"message":"Contact [ id:'+id+' ] is deleted!"}');
		$.notify("Delete successful!", "success");
		$.notify("Preview updated!", "success");
		syncViewTable();
	}else{
		$("#response-preview .text").jJsonViewer('{"status":400,"message":"Contact [ id:'+id+' ] does not exists."}');
		$.notify("ERROR! See the response!", "error");
	}
}
function addToFavourite(){
	switchFavourite('true');
}
function removeFromFavourite(){
	switchFavourite('false');
}
function notFound(){
	var input_url = $("#input-url").val();
	var method = $("#request-method-dropdown").val();
	
	var uri_param = method+" <b>"+input_url+"</b> HTTP/1.1";
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html(getRequestPayload());
	
	$("#response-preview .text").jJsonViewer('{"status":404,"message":"Requested URI ['+rootURL+input_url+'] not found!"}');
	$.notify("ERROR! See the response!", "error");
}
function invalidRequestMethod(){
	var input_url = $("#input-url").val();
	var method = $("#request-method-dropdown").val();
	
	var uri_param = method+" <b>"+input_url+"</b> HTTP/1.1";
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html(getRequestPayload());
	
	$("#response-preview .text").jJsonViewer('{"status":404,"message":"Requested method ['+method+'] is not applicable for '+rootURL+input_url+'. See the examples !"}');
	$.notify("ERROR! See the response!", "error");
}



// ******** UI Form controllers *******

rootURL = 'http://apikothn.com';

function sendRequest(){
	var input_url = $("#input-url").val();
	var method = $("#request-method-dropdown").val();
	if(!input_url){
		$("#input-url").notify("Enter request URI", "error");
		return;
	}
	appRouter.run(method,input_url);
	
}
function checkInputs(){
	
	showMessage("my Title","My Message");
	
}

function switchMethod(value){
	if(value=="POST" || value=="PUT"){
		$("#top-send-request-div").hide();
		$("#input-contact-form").css('display', 'block');
		
	}else{
		$("#top-send-request-div").show();
		$("#input-contact-form").css('display', 'none');
	}
	
}

function showMessage(title,text){

	BootstrapDialog.show({
		title: title,
		message: text,
		buttons: [{
			id: 'btn-ok',        
			label: 'Close',
			cssClass: 'btn-primary', 
			autospin: false,
			action: function(dialogRef){    
				dialogRef.close();
			}
		}]
	});

}
function getNextIndexId(){
	var max_num = 0;
	$( ".contact-id" ).each(function() {
		var id = parseInt($( this ).text());
		if(id>max_num)
			max_num=id;
	});
	return max_num+1;
	
}
function getStorageContacts(isFav,id){
	var selector = "#storage #contact-row";
	if(id!=0)
		selector = "#storage .row"+id;
	var list = [];
	$(selector).each(function(){
		var id = $(this).find('th.contact-id').html();
		var name = $(this).find('td.contact-name').html();
		var number = $(this).find('td.contact-number').html();
		var email = $(this).find('td.contact-email').html();
		var favourite = $(this).find('td.contact-is-favourite').html();
		
		var obj ={
			"id": id,
			"name": name,
			"number":number,
			"email":email,
			"favourite":favourite
		}
		if(isFav==false){
			list.push(obj);
		}else{
			if(favourite=='true')
				list.push(obj);
		}
		
	});
	
	return list;
}
function getRequestPayload(){
	var method = $("#request-method-dropdown").val();
	if(method =="POST"  || method =="PUT"){

		var name = $(".input-contact-name").val();
		var number = $(".input-contact-number").val();
		var email = $(".input-contact-email").val();
		var favourite = $(".input-contact-favourite").val();
		
		if(!favourite && method =="POST"){
			favourite='false';
		}
		
		var payload = "";
		if(name)
			payload = "name="+name;
		if(number){
			if(payload)
				payload+="&";
			payload += "number="+number;
		}
		if(email){
			if(payload)
				payload+="&";
			payload += "email="+email;
		}
		if(favourite){
			if(payload)
				payload+="&";
			payload += "favourite="+favourite;
		}		
		return payload;
	}
	else
		return ' ';
}

function syncViewTable(){
	var data = $("#storage #table-body").html();
	$("#practice-table #table-body").html(data);
}

function generateNewView(list){
	$("#practice-table #table-body").empty();
	for(var i=0;i<list.length;i++){
		var item = '<tr id="contact-row" class="row'+list[i].id+'">\
					<th scope="row" class="contact-id">'+list[i].id+'</th>\
					<td class="contact-name">'+list[i].name+'</td>\
					<td class="contact-number">'+list[i].number+'</td>\
					<td class="contact-email">'+list[i].email+'</td>\
					<td class="contact-is-favourite">'+list[i].favourite+'</td>\
				  </tr>';
		$("#practice-table #table-body").append(item);
	}
}

function switchFavourite(fav){
	var input_url = $("#input-url").val();
	var id = parseInt(input_url.replace( /^\D+/g, ''));
	
	
	var uri_param = "PUT <b>"+input_url+"</b> HTTP/1.1";
	
	$(".request-preview-param-uri").html(uri_param);
	$(".request-preview-param-body").html('');
	
	selector = "#storage .row"+id;
	var contact = $("#storage .row"+id).html();
	if(contact){
		$("#storage .row"+id).find('td.contact-is-favourite').html(fav);
		$("#response-preview .text").jJsonViewer('{"status":200,"message":"Contact added to favourite!"}');
		$.notify("Contact added to favourite!", "success");
		$.notify("Preview updated!", "success");
		syncViewTable();
	}else{
		$("#response-preview .text").jJsonViewer('{"status":400,"message":"Contact [ id:'+id+' ] does not exists."}');
		$.notify("ERROR! See the response!", "error");
	}
}