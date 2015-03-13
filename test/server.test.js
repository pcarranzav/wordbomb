
//Start the server
require('../index');


var Word = require('../models/word');
var User = require('../models/user');
var Ranking = require('../models/ranking');

var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

it("should correctly login a user",function(done){
	var client = io.connect(socketURL,options);

	client.on('connect',function(data){
		client.emit('login',"pedrito");
	});

	client.on("valid login",function(data){
		data.user.name.should.equal("pedrito");
		data.user.score.should.equal(0);
		User.all.should.have.property("pedrito");
		done();
	});


});

it("should not login a duplicated user",function(done){
	var client2 = io.connect(socketURL,options);

	client2.on('connect',function(data){
		client2.emit('login',"pedrito");
	});

	client2.on("valid login",function(data){
		true.should.equal(false);
		done();
	});


	client2.on("invalid login",function(data){
		done();
	});
});

it("should add 10 points for a correct guess",function(done){
	var client = io.connect(socketURL,options);

	client.on('connect',function(data){
		client.emit('login',"juanito");
	});

	client.on("valid login",function(data){
		client.emit("guess",{word: Word.current});
	});

	client.on("correct guess",function(data){
		console.log(data.user);
		data.user.name.should.equal("juanito");
		User.all["juanito"].score.should.equal(10);
		User.all["juanito"].ranking.should.equal(0);
		User.all["pedrito"].ranking.should.equal(1);
		Ranking.list[0].should.equal("juanito");
		done();
	});


});

it("should remove 1 point for an incorrect guess",function(done){
	var client = io.connect(socketURL,options);

	client.on('connect',function(data){
		client.emit('login',"manolo");
	});

	client.on("valid login",function(data){
		client.emit("guess",{word: "fdsdfh"});
	});

	client.on("incorrect guess",function(data){
		console.log(data.user);
		data.user.name.should.equal("manolo");
		User.all["juanito"].score.should.equal(10);
		User.all["manolo"].ranking.should.equal(2);
		User.all["pedrito"].ranking.should.equal(1);
		Ranking.list[2].should.equal("manolo");
		User.all["manolo"].score.should.equal(-1);
		done();
	});


});
