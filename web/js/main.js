 
$(document).ready(function(){
	
var translate=[];	
var img_red = "<img src=\"images/status_red.png\">";
var img_blue = "<img src=\"images/status_blue.png\">";
var img_green = "<img src=\"images/status_green.png\">";
var img_gray = "<img src=\"images/status_gray.png\">";
var img_orange = "<img src=\"images/status_orange.png\">";

var div_name = "<div  id=name style=\"height:27px;width:200px; margin:1px;padding:1px;float:left;\">";
var div_string = "<div id=status style=\"height:27px;width:200px; margin:1px;padding:1px;float:left;\">";
var div_img = "<div  id=img style=\"height:17px;width:20px; margin:4px;padding:1px;float:left;\">";
var div_c ="</div>";
	
  $('#workarea').hide(); 

 var socket = new WebSocket("ws://192.168.0.170:8888");
 
   test1 = localStorage.getItem('crm_login');
   test2 = localStorage.getItem('crm_password');
 
 
  if (test1!='undefined'){
  
  if (test1!=null){
  if (test1!=""){
   login_=test1;
  pass_ =test2;
  $('#loginform').hide(); 
function doStuff()
{
  
  setTimeout(continueExecution, 200) 
}
function continueExecution()
{
  

   socket.send( JSON.stringify ({
            type: 'auth',
            login: login_,
			password: pass_,
			regtype: 'hash'
					
        }));
  
	 }
	 
	 doStuff();
 }
 }
 }
 socket.onmessage = function(event) {
  var incomingMessage = JSON.parse(event.data);
   

  switch (incomingMessage.type) { 
   case 'status':  	
 
	var pin = incomingMessage.pin;
	
	var status = incomingMessage.status;
	
$('#log').prepend('<div>'+pin+"_"+status+'</div>');

var string='';
var img_switch='';
 
 
		if (status==0) {
		 string='Ожидание';
		 img_switch=img_orange;
		 }
		 if (status==1) {
		 string='Работает';
		 img_switch=img_red;
		 }
		 if (status==-1) {
		 string='Отключен';
		 img_switch=img_gray;
		 }
		 
	
		 
		
			var div_user = "<div class=change id="+pin+" style=\"height:27px;border:1px solid; margin:1px;padding:1px;float:left;width:800px\">";
var test='#'+pin;
$(test).html(div_name+pin+" ( "+translate[pin]+" ) "+div_c+div_img+img_switch+div_c+div_string+string+div_c);


break

   case 'refresh':
    var pin = incomingMessage.pin;
	var description = incomingMessage.description;
	var calendar = incomingMessage.calendar;
    var period = incomingMessage.period;
	var worktime = incomingMessage.worktime;
	var status = incomingMessage.status;
$('#log').prepend('<div>'+pin +'_'+status+'</div>');
var string='';
var img_switch='';
 
 
	if (status==0) {
		 string='Ожидание';
		 img_switch=img_orange;
		 }
		 if (status==1) {
		 string='Работает';
		 img_switch=img_red;
		 }
		 if (status==-1) {
		 string='Отключен';
		 img_switch=img_gray;
		 }
		 
		 
			translate[pin]=description;
			var div_user = "<div class=change id="+pin+" style=\"height:27px;border:1px solid; margin:1px;padding:1px;float:left;width:800px\">";

$('#list').prepend(div_user+div_name+pin+" ( "+description+" ) "+div_c+div_img+img_switch+div_c+div_string+string+div_c+div_c);
   
   break

   case 'auth':
   if (incomingMessage.auth===1){
	   var hash=incomingMessage.hash;
   //$('loginform').classList.remove('unauthorized');
    $('#log').prepend('<div>'+"ACCESS GRANTED!!"+'</div>');
   localStorage.setItem('crm_login', login_);
   localStorage.setItem('crm_password', hash);
   $('#loginform').hide(); 

	$('#workarea').show(); 
	
	  var test=$("#testin").val();
	 socket.send( JSON.stringify ({
            type: 'refresh',
			to: test
        }));
	
   }
    if (incomingMessage.auth===0){
		alert("ACCESS DENIED!!");
   }
   break

   //case 'chat':
   //var message=incomingMessage.message;
  // var from=incomingMessage.from;
  // $('#list').prepend('<div>'+from+":"+message+'</div>');
   }
/////////////

};
socket.ondisconnect = function(){
       localStorage.clear();
    };

$("#loginform").keydown(function(event){
	//ловим событие нажатия клавиши
	
	if(event.keyCode == 13) {	//если это w
	  
	   
 
	pass_=$("#pass").val();
	  login_=$("#login").val();
	 if (login_!="")
	 
	 {
	 socket.send( JSON.stringify ({
            type: 'auth',
            login: login_,
			password: pass_,
			regtype: 'password'
					
        }));
		
		}
	}
	
	
});		


$("#but_settings2").click(function(e){
       e.preventDefault();
	   
 
	pass_=$("#pass").val();
	  login_=$("#login").val();
	 if (login_!="")
	 
	 {
	 socket.send( JSON.stringify ({
            type: 'auth',
            login: login_,
			password: pass_
					
        }));
		
		}
	    });


 $("#but_settings").click(function(e){
       e.preventDefault();
	 
     $('#log').prepend('<div>EXITED</div>');
	 localStorage.clear();
	// ;
	 $('#loginform').show();
	 $("#pass").val("");
		$("#list").empty();
	 $('#workarea').hide(); 
	 socket.send( JSON.stringify ({
            type: 'exit'	
        }));
	 
	    });
		
		 $("#but_test").click(function(e){
       e.preventDefault();

	   var test=$("#testin").val();
	   var test2=$("#testin2").val();
	   var test3=$("#testin3").val();
	 socket.send( JSON.stringify ({
            type: 'relay',
			operation: "start",
			worktime: test,
			noworktime: test2,
			pin: test3
        }));
	 
	    });
		
		 $("#but_test2").click(function(e){
       e.preventDefault();
	   var test3=$("#testin3").val();
	 socket.send( JSON.stringify ({
            type: 'relay',
			operation: "stop",
			pin: test3
        }));
	 
	    });
		
		
		$("#servo").change(function(e){
       e.preventDefault();

	   var test=$("#servo").val();
	   var test3=$("#testin3").val();
	 socket.send( JSON.stringify ({
            type: 'servo',
			servalue: test,
			pin: test3
        }));
	 
	    });

});