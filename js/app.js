// Global Objects
var controllerObj;
var uavObj;
var anemoiLink;

var fs;
var currentPane;

var statusUAVConnection = 0;
var statusControllerConnection = 0;
var statusNav = 0;

// Global Constants defining HTML tag IDs
var btnControllerConnect;
var btnUAVConnect;
var btnToggleNav;

var iconUavStatusBat;
var iconUuavStatusNet;
var iconControllerStatusBat;
var iconControllerStatusLink;

var inputControllerPort;
var inputUAVip;

// Global Constants defining HTML class names
const classBtnConnectSuccess = 'button is-normal is-rounded is-success'
const classBtnConnectFailure = 'button is-normal is-rounded is-danger'


/*
	An implementation for a auto variable value update system that updates 
	values of 'registered' variables based on values of 'subscribed' variables
	Register-Subscribe Value Update System (RSVUS)
*/

var garbage = 0;

var RSVUS_table = {}

function registerUpdates(registerVar, registerValue, subscribedVar, subscribedValue) {
	if (subscribedVar == '') subscribedVar = 'garbage'
	if (!(registerVar in RSVUS_table))
		RSVUS_table[registerVar] = {}
	if (!(registerValue in RSVUS_table[registerVar]))
		RSVUS_table[registerVar][registerValue] = {}
	RSVUS_table[registerVar][registerValue][subscribedVar] = subscribedValue
}

function updateSubscribed(variable) {
	var value = eval(variable)
	var tbl = RSVUS_table[variable][value]
	//console.log(tbl)
	for (var k in tbl) {
		var tmp = tbl[k]
		if (typeof (tmp) == 'function')
			eval(k + ' = tmp(' + value + ')')
		else
			eval(k + ' = tmp')
	}
}

function updateVariable(variable, value) {
	var tmp = value
	eval(variable + ' = ' + tmp)
	updateSubscribed(variable)
}

function loadHTML(file, elem) {
	fs.readFile(file, 'utf-8', (err, data) => {
		if (err) {
			console.log("An error ocurred reading the file :" + err.message);
			return;
		}
		//console.log("The file content is : " + data);
		elem.innerHTML = data
	});
}

/*
	Code for general event handlers and functions
*/

function initialize() {
	console.log("Loading AnemoiLink Native Module")
	fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
	console.log("Module loaded")

	btnControllerConnect = document.getElementById('btn-controller-connect')
	btnUAVConnect = document.getElementById('btn-uav-connect')

	iconUavStatusBat = document.getElementById('iconUavStatusBat')
	iconUuavStatusNet = document.getElementById('iconUuavStatusNet')
	iconControllerStatusBat = document.getElementById('iconControllerStatusBat')
	iconControllerStatusLink = document.getElementById('iconControllerStatusLink')

	inputControllerPort = document.getElementById('controller-port')
	inputUAVip = document.getElementById('uav-ip')

	registerUpdates('statusControllerConnection', 1, 'btnControllerConnect.textContent', 'Disconnect')
	registerUpdates('statusControllerConnection', 1, 'btnControllerConnect.className', classBtnConnectSuccess)
	registerUpdates('statusControllerConnection', 0, 'controllerObj', null)
	registerUpdates('statusControllerConnection', 0, 'btnControllerConnect.textContent', 'Connect')
	registerUpdates('statusControllerConnection', 0, 'btnControllerConnect.className', classBtnConnectFailure)

	registerUpdates('statusControllerConnection', 0, 'iconControllerStatusLink.className', "mdi mdi-24px mdi-link-off")
	registerUpdates('statusControllerConnection', 0, 'iconControllerStatusBat.className', "mdi mdi-24px mdi-battery-alert")
	registerUpdates('statusControllerConnection', 1, 'iconControllerStatusLink.className', "mdi mdi-24px mdi-link")
	registerUpdates('statusControllerConnection', 1, 'iconControllerStatusBat.className', "mdi mdi-24px mdi-battery")

	registerUpdates('statusUAVConnection', 1, 'btnUAVConnect.textContent', 'Disconnect')
	registerUpdates('statusUAVConnection', 1, 'btnUAVConnect.className', classBtnConnectSuccess)
	registerUpdates('statusUAVConnection', 0, 'uavObj', null)
	registerUpdates('statusUAVConnection', 0, 'btnUAVConnect.textContent', 'Connect')
	registerUpdates('statusUAVConnection', 0, 'btnUAVConnect.className', classBtnConnectFailure)

	registerUpdates('statusUAVConnection', 0, 'iconUavStatusBat.className', "mdi mdi-24px mdi-battery-alert")
	registerUpdates('statusUAVConnection', 0, 'iconUuavStatusNet.className', "mdi mdi-24px mdi-network-strength-off")
	registerUpdates('statusUAVConnection', 1, 'iconUavStatusBat.className', "mdi mdi-24px mdi-battery")
	registerUpdates('statusUAVConnection', 1, 'iconUuavStatusNet.className', "mdi mdi-24px mdi-network-strength")

	currentPane = 'tuning'
	var d = document.getElementById("panel-view")
	loadHTML('./views/' + currentPane + '.html', d)
	anemoiLink = require('bindings')('Drone.node')
}

function connectController() {
	if (statusControllerConnection) {
		delete controllerObj
		console.log("Controller Disconnected!")
		updateVariable('statusControllerConnection', 0)
		return;
	}
	controller_port = inputControllerPort.value
	controllerObj = new anemoiLink.ManualController(controller_port);
	console.log(controllerObj.connectionStatus);
	console.log(controllerObj);
	if (statusUAVConnection) {
		console.log('Here!');
		controllerObj.setUAV(uavObj);
	}
	//controllerCommander();
	controllerObj.launchExecutor();
	if (controllerObj.connectionStatus == 0) {
		console.log("Controller Successfully Connected!")
		updateVariable('statusControllerConnection', 1)
	}
	else {
		console.log("Controller Could not be connected!")
		console.log(controllerObj.connectionStatus)
	}
}

var uavChecker;

function UAVConnectionCheck() {
	if (uavObj == null || uavObj.connectionStatus != 0) {
		if (uavObj != null) {
			console.log(uavObj.connectionStatus)
			uavObj.closeConnections();
		}
		updateVariable('statusUAVConnection', 0)
		console.log("UAV Connection Broke!!!")
		clearInterval(uavChecker);
	}
}

function connectUAV() {
	if (statusUAVConnection) {
		uavObj.closeConnections();
		delete uavObj
		console.log("UAV Disconnected!")
		updateVariable('statusUAVConnection', 0)
		return;
	}
	uav_ip = inputUAVip.value
	uavObj = new anemoiLink.Drone(uav_ip);
	console.log(uavObj.connectionStatus);
	console.log(uavObj);
	if (statusControllerConnection) {
		controllerObj.setUAV(uavObj);
	}
	if (uavObj.connectionStatus == 0) {
		uavChecker = setInterval(UAVConnectionCheck, 500);
		console.log("UAV Successfully Connected!")
		updateVariable('statusUAVConnection', 1)
	}
	else {
		console.log(uavObj.connectionStatus)
		uavObj.closeConnections();
		console.log("UAV Could not be connected!")
	}
}

/*
	General Functionality Code and Button Handlers
*/

function switchPane(value) {
	if (currentPane == value)
		return;
	currentPane = value;
	var d = document.getElementById("panel-view")//("panel-embed");
	//d.setAttribute('src', './' + value + '.html');
	loadHTML('./views/' + value + '.html', d)
}

function toggleNavigation() {
	btnToggleNav = document.getElementById('btn-toggleNav');
	if (!statusNav) {
		statusNav = 1;
		uavObj.enableAutoNav();
		btnToggleNav.classList = 'button is-danger';
		btnToggleNav.innerText = 'Stop Navigation';
	}
	else {
		statusNav = 0;
		uavObj.disableAutoNav();
		btnToggleNav.classList = 'button is-warning';
		btnToggleNav.innerText = 'Start Navigation';
	}
}

function addWaypoint() {
	console.log("clicked");
	destination = document.getElementById('destination').value;
	velocity = document.getElementById('velocity').value
	delay = document.getElementById('delay').value
	// $('#destination').val('');
	// $('#velocity').val('');
	// $('#delay').val('');
	document.getElementById('destination').value = '';
	document.getElementById('velocity').value = '';
	document.getElementById('delay').value = '';

	var dd = destination.split(',')
	console.log(dd)
	var id;

	if (parseInt(delay) == 1)
		id = uavObj.gotoLocation(parseFloat(dd[0]), parseFloat(dd[1]), parseFloat(dd[2]), parseFloat(velocity))
	else
		id = uavObj.addWaypoint(parseFloat(dd[0]), parseFloat(dd[1]), parseFloat(dd[2]), parseFloat(velocity))

	// var div = $("<tr/>");
	// div.html(generateWaypointEntry(destination, velocity, delay, id));

	document.getElementById('TextBoxContainer').innerHTML += generateWaypointEntry(destination, velocity, delay, id);
}

// $(function () {
//     $("#btnAdd").bind("click", function () {
// 		console.log("clicked");
// 		destination = $('#destination').val();
// 		velocity = $('#velocity').val();
// 		delay = $('#delay').val();
// 		$('#destination').val('');
// 		$('#velocity').val('');
// 		$('#delay').val('');

// 		var dd = destination.split(',')
// 		console.log(dd)
// 		var id;

// 		if(parseInt(delay) == 1)
// 			id = uavObj.gotoLocation(parseFloat(dd[0]), parseFloat(dd[1]), parseFloat(dd[2]), parseFloat(velocity))
// 		else 
// 			id = uavObj.addWaypoint(parseFloat(dd[0]), parseFloat(dd[1]), parseFloat(dd[2]), parseFloat(velocity))

//         var div = $("<tr/>");
//         div.html(generateWaypointEntry(destination, velocity, delay, id));
//         $("#TextBoxContainer").append(div);
//     });
//     $("body").on("click", ".remove", function () {
//         $(this).closest("tr").remove();
//     });
// });

function generateWaypointEntry(destination, velocity, delay, id) {
	var out = '<td>' + id + '</td>';
	out += '<td>' + destination + '</td>';
	out += '<td>' + velocity + '</td>';
	out += '<td>' + delay + '</td>';
	out += '<td><button type="button" class="icon is-medium mdi mdi-24px mdi-delete-forever remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>';
	return out;
}
//For the map in GPS Page
function myMap() {
	var mapProp= {
	  center:new google.maps.LatLng(82.508742,-0.120850),
	  zoom:5,
	};
	var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}