Orderbooks = new Mongo.Collection("orderbooks");
AllOrderbooks = new Mongo.Collection("allorderbooks");
Whitelist = new Mongo.Collection("whitelist");


if (Meteor.isClient) {
	
	
	Meteor.subscribe('orderbooks');
	Meteor.subscribe('allorderbooks');
	Meteor.subscribe('whitelist');
	
	//test
	
	//123
	
	//Meteor.call("placeBid","0.1","100","11060861818140490423","17554243582654188572");
	
	var x=0.01;
	var y=1;
	//Meteor.call("placeBid",x,y,"11060861818140490423","17554243582654188572");
	
	function testDEX(){
			var x=0.0000000001;
			var y=1;
		for(i=0;i<100;i++){
			

			Meteor.call("placeBid",x,y,"11060861818140490423","17554243582654188572");
			
			
			x+=0.0000000001;
		}	
	}
	
		//testDEX();
			
	//Meteor.call("getOrderbook","11060861818140490423","17554243582654188572");
	
	//Meteor.call("getOrderbook","11060861818140490423","17554243582654188572");
	
	Meteor.call("getOrderbook","17554243582654188572","5527630");
	
	//"base": "NXT", "baseid": "5527630", "rel": "BTC", "relid": "17554243582654188572"
    
    Meteor.call("allOrderbooks");
    
    //Meteor.call("getPeers");
	
  //var result = HTTP.get("http://127.0.0.1:7778/%7B%22requestType%22:%22orderbook%22,%22baseid%22:%2211060861818140490423%22,%22relid%22:%2217554243582654188572%22%7D").content;
  function test(){
	  
	  $('#output').append("tessst");
	  }

	//test();
	
	    //document.getElementById("id").innerHTML = "value";  
	
  // counter starts at 0
  Session.setDefault('counter', 0);

  //Template.hello.helpers({
    //counter: function () {
		
      //return Session.get('counter');
    //}
  //});
  
  Template.orderbooks.helpers({
    orderbooks: function () {
		
      return Orderbooks.find();
    }
  });
  
   Template.orderbooksoverview.helpers({
    orderbooks: function () {
 
      return AllOrderbooks.find().fetch()[0].orderbooks.orderbooks;
    }
  });
  

	
	Template.bidtable.rendered = function () {
		$("#bidtable").dataTable();

	}
	
	Template.asktable.rendered = function () {

		$("#asktable").dataTable();
	}
	
  
   Template.placeBid.events({
    'click button': function () {
		//alert(document.getElementById("price").value)
		var baseid = "11060861818140490423";
		var relid = "17554243582654188572";
		var price = document.getElementById("bidPrice").value;
		var amount = document.getElementById("bidAmount").value;
      Meteor.call("placeBid",price,amount,baseid,relid,function(err,result){
        //$('#output').append(result);
        //alert(result);
        
		});
		}
	});
	
	Template.placeAsk.events({
    'click button': function () {
		//alert(document.getElementById("price").value)
		var baseid = "11060861818140490423";
		var relid = "17554243582654188572";
		var price = document.getElementById("askPrice").value;
		var amount = document.getElementById("askAmount").value;
      Meteor.call("placeAsk",price,amount,baseid,relid,function(err,result){
        //$('#output').append(result);
        //alert(result);
        
		});
		}
	});
}

if (Meteor.isServer) {
	
	Meteor.publish('orderbooks', function() {
	  return Orderbooks.find();
	});
	Meteor.publish('allorderbooks', function() {
	  return AllOrderbooks.find();
	});
	Meteor.publish('whitelist', function() {
	  return AllOrderbooks.find();
	});
	
	var port = "7777";
	var server= "http://localhost";
	
	Meteor.methods({
		update: function(){
			
			
			//for now only one orderbook, will change later
			Meteor.call("getOrderbook","11060861818140490423","17554243582654188572");
			
			},
		placeBid: function(price, volume, baseid, relid){
			
			var result = HTTP.get(server+":"+port+"/%7B%22requestType%22:%22placebid%22,%22baseid%22:%22"+baseid+"%22,%22relid%22:%22"+relid+"%22,%22volume%22:%22"+volume+"%22,%22price%22:%22"+price+"%22%7D").content;
			var json = JSON.parse( result);
			
			//console.log(result);
			
			Meteor.call("update");
		
		},
		placeAsk: function(price, volume, baseid, relid){
			
			var result = HTTP.get(server+":"+port+"/%7B%22requestType%22:%22placeask%22,%22baseid%22:%22"+baseid+"%22,%22relid%22:%22"+relid+"%22,%22volume%22:%22"+volume+"%22,%22price%22:%22"+price+"%22%7D").content;
			var json = JSON.parse( result);
			
			console.log(result);
			
			Meteor.call("update");
		
		},
		allOrderbooks: function(){
			
			var result = HTTP.get(server+":"+port+"/%7B%22requestType%22:%22allorderbooks%22%7D").content;
			var json = JSON.parse( result);
			
			orderbooks = AllOrderbooks.find().fetch();
			
			if(orderbooks.length==0){
				AllOrderbooks.insert({'input':'input','orderbooks':json});
			}else{
				AllOrderbooks.update({'input':'input'},{'input':'input','orderbooks':json});
			}
			
			
			
				//for(i=0;i<json.orderbooks.length;i++){
				
					//if(json.orderbooks[i].numquotes>0){
					//Meteor.call("getOrderbook",json.orderbooks[i].baseid,json.orderbooks[i].relid);
					//}
				//}
			
			},
		getOrderbook: function(baseid, relid) {

			   result = HTTP.get(server+":"+port+"/%7B%22requestType%22:%22orderbook%22,%22baseid%22:%22"+baseid+"%22,%22relid%22:%22"+relid+"%22%7D").content;
			   
			   var json = JSON.parse( result);
			   //console.log(json.pair);
			   orderbooks = Orderbooks.find({'obookid':json.obookid}).fetch();
		
				if(orderbooks.length === 0){
					
					Orderbooks.insert({'obookid':json.obookid,'orders':json });
				}else{
					
					Orderbooks.update({'obookid':json.obookid},{'obookid':json.obookid,'orders':json });
				}
			   
			   return result;    
			},
		getPeers: function(){
			
			test = HTTP.get(server+":"+port+"/%7B%22requestType%22:%22getpeers%22%7D").content;
			console.log(test);
			
			return test;
			
			}
	});
	
	
  Meteor.startup(function () {
    
  });
}
