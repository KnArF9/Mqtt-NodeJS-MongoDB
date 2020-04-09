

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC_NAME = "Raw/TempESP8266";
const CLIENT_ID = "subscribe.js";
const url = "mongodb://localhost:27017"; // Connection URL
const dbName ="FrankDB"; //nom db
const assert = require('assert');

var MQTT = require('mqtt');
var client  = MQTT.connect(BROKER_URL, {clientId: CLIENT_ID});
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var payload;
var messageJSON = {};

client.on("connect", onConnected);
client.on("message", onMessageReceived);


function onConnected()
{
  client.subscribe(TOPIC_NAME);
}

function onMessageReceived(topic, message)
{
	var d = new Date();
	var msUTC = d.getTime();
	var local = d.toLocaleTimeString();
	payload = JSON.parse(message.toString());
	console.log(topic);
	console.log(payload);
	console.log("");
	messageJSON = {date:{msUTC, local},topic , payload};
	
	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db(dbName);
	dbo.collection("Temperature").insertOne(messageJSON, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});  

}
