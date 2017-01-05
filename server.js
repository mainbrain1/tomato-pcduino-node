var WebSocketServer = new require('ws');
//var md5 = require('js-md5');
var pcduino = require("pcduino");
var digital = pcduino.digital;
var startpy = require('child_process');
var clients = {};
var registered = {};
var hashes = {};
var noworktimer = {};
var worktimer = {};
var interval = {};


//ffserver -f /etc/ffserver.conf
//init
function checkhash()
{
	
	//digital.pinMode(pin, digital.OUTPUT);
	
}

function checkpin()
{
	
	//digital.pinMode(pin, digital.OUTPUT);
	
}


//digital.pinMode(pin, digital.OUTPUT);

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
  port: 8888
});
//////////////////////
function str_rand() {
        var result       = '';
        var words        = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        var max_position = words.length - 1;
            for( i = 0; i < 10; ++i ) {
                position = Math.floor ( Math.random() * max_position );
                result = result + words.substring(position, position + 1);
            }
        return result;
    }
/////////////////////
function endTime()
{
var tm=new Date();
var y=tm.getFullYear();
var d=tm.getDate();
var mon=tm.getMonth()+1;
var h=tm.getHours();
var m=tm.getMinutes();
var s=tm.getSeconds();
m=checkTime(m);
s=checkTime(s);
h=checkTime(h);
d=checkTime(d);
mon=checkTime(mon);
return(y+"-"+mon+"-"+d+" "+h+":"+m+":"+s);
}
function checkTime(i)
{
if (i<10)
{
i="0" + i;
}
return i;
}

/////////////////////
function sendall(message){

for (var keys in registered)
	{
		
 console.log(endTime()+'  SENDING MESSAGE  '+message+'  TO CLIENT    WITH ID  '+keys);
      clients[keys].send(message);
	}
////
 // console.log(endTime()+"  REGISTERED USERS  "+registered[keys]+"    ID   "+ keys);
}
/////////////////////

/////////////////////
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'tomato',
  password : 'tomato155',
  database : 'tomato'
});

connection.connect();


console.log(endTime()+"  CONNECTED TO DATABASE");

/////////////////////
//connection.query("SET SESSION wait_timeout = 604800"); 
setInterval(sqlrefresh,5000000);
function sqlrefresh() {
connection.query('SELECT 1 FROM  `users`');
console.log(endTime()+'  SQL CONNECTION REFRESHED');
}
/////////////////////
function var_dump(_var, _level) {
  var dumped_text = "";
  if(!_level) _level = 0;
     
  //The padding given at the beginning of the line.
  var level_padding = "";
  for(var j=0; j<_level+1; j++) level_padding += "    ";
     
    if(typeof(_var) == 'object') { //Array/Hashes/Objects 
      for(var item in _var) {
    var value = _var[item];
             
    if(typeof(value) == 'object') { // If it is an array,
      dumped_text += level_padding + "'" + item + "' ...\n";
      dumped_text += var_dump(value, _level+1);
    } else {
      dumped_text += level_padding +"'"+ item +"' => \""+ value +"\"\n";
    }
      }
    } else { //Stings/Chars/Numbers etc.
      dumped_text = "===>"+ _var +"<===("+ typeof(_var) +")";
    }
  return dumped_text;
};
/////////////////////GPIO
function servo(servalue,pin) {
	//2.35  0.54
startpy.exec('/usr/bin/python servo.py '+servalue+" "+pin, function (err) {
  if (err) {    console.log(endTime()+' Can\'t start child process.');
    process.exit(1);
  }

  console.log(endTime()+'  SERVO MOVED ON VALUE:  '+servalue);
});

	
};


	////////////////////////
function relay(worktime,noworktime,pin) {
	digital.digitalWrite(pin, digital.LOW)
	writestatus("1",pin);	
	
console.log(endTime()+'  WORK STARTED PIN  '+pin+"  "+"  TIME  "+worktime);	
worktimer[pin] = setTimeout(function() {
	//console.log(endTime()+'  WORK STOPPED PIN  '+pin+"  "+"  TIME  "+worktime);
	digital.digitalWrite(pin, digital.HIGH)
	writestatus("0",pin);

console.log(endTime()+'  WAITING STARTED PIN '+pin+"  "+"  TIME  "+noworktime);
noworktimer[pin] = setTimeout(function() {
},noworktime)
},worktime)
}
/////////////////////
function writestatus(status,pin) {
var post = {status: status};
var post2 = 'UPDATE relay SET ? WHERE pin='+pin;
var query = connection.query(post2, post, function(err, result) {
 
console.log(endTime()+"  NEW STATUS DETECTED ON PIN  "+pin+"  STATUS  "+status);
var message=JSON.stringify ({
            type: 'status',
            pin: pin,
			status: status
					
        })
		sendall(message);
  
});
}
/////////////////////

webSocketServer.on('connection', function(ws) {
	

	
  var id = str_rand();

  clients[id] = ws;

  console.log(endTime()+"  NEW USER CONNECTED  " + id);
 
  ws.on('message', function(message) {
    console.log(endTime()+'  MESSAGE RECEIVED  ' + message+' FROM ID '+id);
	
	var incomingMessage =JSON.parse(message);
	
	if(incomingMessage.type==='auth') { 
   
var login = incomingMessage.login;
var password = incomingMessage.password;
var regtype = incomingMessage.regtype;
var sql = 'SELECT `secret` FROM `users` WHERE `name`='+'"'+login.toString()+'"';
//console.log(endTime()+'  SQL  ' + sql);

	connection.query(sql, function(err, rows, fields) {
  if (err) throw err;
  var pass_check=rows[0].secret;
 if (regtype=='password')
 {
  var pass_check_test=pass_check;
 }
  if  (regtype=='hash') 
 {
  var pass_check_test=hashes[login];
 }
  
  console.log(endTime()+'  CHECK  '+pass_check);
  console.log(endTime()+'  PASSWORD  '+password);
 	if (password===pass_check_test)
	{
	var hash=str_rand();
	hashes[login] = hash;
	console.log(endTime()+'  HASH  ' + hash)
	var message=JSON.stringify ({
            type: 'auth',
            auth: 1,
			hash: hash
        })
	ws.send(message);
	
	console.log(endTime()+'  CLIENT  PASSED  '+'  WITH ID  '+id+'  AND LOGIN  '+login+'  AND PASSWORD  '+password);
	
	//map[[0][0]]=id+'_'+login+'_'+'0'+'_'+'0';
	//console.log(endTime()+"  PISKA  "+id);
     var userobj = [login,pass_check,hash];
	 
	registered[id]=userobj;
	

	
	
	
	console.log(endTime()+"  REGISTERED USERS  "+var_dump(registered,1));
	
	//console.log(endTime()+"  REGISTERED USERS  "+JSON.parse(registered));
	//console.log(endTime()+"  MAP  "+map);
	//console.log(endTime()+"   "+registered[id]);
	for (var keys in registered)
	{
		console.log(endTime()+"  REGISTERED USERS  "+registered[keys]+"    ID   "+ keys);
		
	}
	
	
	}
	
	else {
	console.log(endTime()+'  CLIENT  DENIED  '+'  WITH ID  '+id+'  AND LOGIN  '+login+'  AND PASSWORD  '+password);
	var message=JSON.stringify ({
            type: 'auth',
            auth: 0
        })
ws.send(message);

	}
	
	
	});
	}
	
	if(incomingMessage.type==='exit') { 
	console.log(endTime()+'  CLIENT LOGOUT  ' + id);
	
delete registered[id];

	}
   
   ////////////////
   /*
   if(incomingMessage.type==='chat') {
   var number = incomingMessage.text;
  		var message=JSON.stringify ({
            type: 'chat',
			text: number,
			id:   id
        })		
		sendall(message);
	console.log(endTime()+'  USER  '+id+'  SAYS  '+number);
   };
   */
   ////////////////////////////////////////////////////////////////////////////
	  if(incomingMessage.type==='relay') {
   
   var operation = incomingMessage.operation;
   var pin = incomingMessage.pin;
 
   if (operation=="start"){
	   /////////
	     
	   /////////
	var worktime = incomingMessage.worktime;
	var noworktime = incomingMessage.noworktime;
	var sum = parseInt(worktime)+parseInt(noworktime);   
	 
	console.log(endTime()+'  INITIAL CYCLE STARTED ------------------------------------'+sum);
	relay(worktime,noworktime,pin);
	interval[pin] =  setInterval(function() {
    console.log(endTime()+'  ROTATE CYCLE STARTED ------------------------------------'+sum);
	relay(worktime,noworktime,pin);

}, sum);
  
   }
    if (operation=="stop"){
		digital.digitalWrite(pin, digital.HIGH)
		writestatus("-1",pin);
		clearTimeout(worktimer[pin]); 
		clearTimeout(noworktimer[pin]); 
		clearInterval(interval[pin])
   }
 

   };
	/////////
   
     if(incomingMessage.type==='servo') {
   
   var servalue = incomingMessage.servalue;
   var servalue_pin = incomingMessage.pin;
  	servo(servalue,servalue_pin)
 

   };
   
   
   /////////////////////////
   
   
   
   if(incomingMessage.type==='refresh') { 
connection.query('SELECT * FROM `relay` ORDER BY `pin` DESC', function(err, rows, fields) {
  if (err) throw err;
 for (var key in rows) { 
var pin= rows [key].pin;
var description= rows [key].description;
var calendar = rows [key].calendar;
var period = rows [key].period;
var worktime = rows [key].worktime;
var status= rows [key].status;

console.log(endTime()+"  relay STATUS LIST GENERATED "+pin+"   "+status);
var message=JSON.stringify ({
            type: 'refresh',
            pin: pin,
			description: description,
			calendar: calendar,
			period: period,
			worktime: worktime,
			status: status
			
        })
ws.send(message);

};
});
	
};
   
   
   
   /////////////////////////////////////////////////////////////////////////////////////
  });  // END of function message

  ws.on('close', function() {
  
    console.log(endTime()+'  CONNECTION CLOSED  ' + id);
	
    delete clients[id];
	delete registered[id];
	
  });
});