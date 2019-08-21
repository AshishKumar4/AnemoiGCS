{
	"targets" : [
		{
			"target_name" : "Drone",
			"sources": [ "Modules/BaseSystem/Drone_wrap.cxx"],
			"libraries": ["<!(pwd)/Modules/librpc.so", "<!(pwd)/Modules/libDrone.so"]
		}
	]
}