function myMap() {
	var mapProp= {
	  center:new google.maps.LatLng(20,81),
	  zoom:5,
	};
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    $("button").hide();
}