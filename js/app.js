var controllerObj;
var uavObj;

function connectController()
{
	var drone = require('bindings')('Drone.node')
	console.log("Module loaded")
	controllerObj = new drone.ManualController("/dev/ttyUSB0");
	console.log("CALLED!!!");
	console.log(controllerObj.yaw);
}

function connectUAV()
{
	var drone = require('bindings')('Drone.node')
	console.log("Module loaded")
	uavObj = new drone.Drone();
	console.log(uavObj.connectionStatus);
	console.log(uavObj);
}