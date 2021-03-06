#pragma once

#include "iostream"
#include "vector"
#include <cmath>
#include <rpc/msgpack.hpp>

using namespace std;

class vector3D_t
{
public:
    float x;
    float y;
    float z;
	MSGPACK_DEFINE_ARRAY(x, y, z);

    vector3D_t()
    {
        x = 0;
        y = 0;
        z = 0;
    }
    
    vector3D_t(float xval, float yval, float zval)
    {
        x = xval;
        y = yval; 
        z = zval;
    }

    void set(float xval, float yval, float zval)
    {
        x = xval;
        y = yval; 
        z = zval;
    }
};

class quaternion_t 
{
public: 

    float _w;
    float _x;
    float _y;
    float _z;
	MSGPACK_DEFINE_ARRAY(_w, _x, _y, _z);

    quaternion_t()
    {
        _w = 1;
        _x = 0;
        _y = 0;
        _z = 0;
    }

    quaternion_t(float w, float x, float y, float z)
    {
        this->_w = w;
        this->_x = x;
        this->_y = y;
        this->_z = z;
    }

    void set(float w, float x, float y, float z)
    {
        this->_w = w;
        this->_x = x;
        this->_y = y;
        this->_z = z;
    }

    float w()
    {
        return _w;
    }

    float x()
    {
        return _x;
    }

    float y()
    {
        return _y;
    }

    float z()
    {
        return _z;
    }
};

class GeoPoint_t
{
public: 
    float x;
    float y;
    float z;
	MSGPACK_DEFINE_ARRAY(x, y, z);

    GeoPoint_t()
    {
        x = 0;
        y = 0;
        z = 0;
    }
    
    GeoPoint_t(float xval, float yval, float zval)
    {
        x = xval;
        y = yval; 
        z = zval;
    }

    void set(float xval, float yval, float zval)
    {
        x = xval;
        y = yval; 
        z = zval;
    }

    void set(GeoPoint_t &point)
    {
        x = point.x;
        y = point.y;
        z = point.z;
    }
};

class data_imu_t
{
public: 
	vector3D_t 	acc;
	vector3D_t 	gyro;
	vector3D_t 	mag;
	MSGPACK_DEFINE_ARRAY(acc, gyro, mag);
};

class image_t 
{
public:
	vector<uint8_t> buff;
	MSGPACK_DEFINE_ARRAY(buff);
};

class DroneState_t
{
public:
	data_imu_t  imu;
	vector3D_t 	vel;
	float 		altitude;
	float 		heading;	// in Radians
	MSGPACK_DEFINE_ARRAY(imu, vel, altitude, heading);

	DroneState_t()
	{
	}
};

/*
    This is our convention, counter clockwise, 0 to 360 in every direction
*/

inline float clamp(float val, float imin, float imax, float omin, float omax)
{
    float aa = omin + (((omax - omin) / (imax - imin)) * (val - imin));
    return aa;
}

#define PI                  3.14159265358979323846
#define CONST_PIby180       PI/180
#define CONST_180byPI       180/PI

inline float degreesToRads(float degree)
{
    return degree * (CONST_PIby180); //(degree/180)*PI;
}

inline float radsToDegrees(float degree)
{
    return degree * CONST_180byPI;
}

inline float getConventionalDegrees(float rads)
{
    // 0 -> North
    // 90 -> east
    // 180 -> south
    // 270 ->west
    float h = clamp(rads, -PI, PI, 180, -180);
    if (h < 0)
    {
        h = 360 + h;
    }
    return h;
}

inline float circularToSignAngle(float angle)
{
    if(angle > 180)
        return angle - 360;
    return angle;
}

inline vector3D_t eulerFromQuaternion(quaternion_t orien)
{
    try
    {
        vector3D_t oo;
        /*
        Quaternion to Euler
    */
        //std::cout << ">>>" << orien << "<<<" << std::endl;
        double heading = 0, roll, pitch, yaw;
        double ysqr = orien._y * orien._y;

        // roll (x-axis rotation)
        double t0 = +2.0f * (orien._w * orien._x + orien._y * orien._z);
        double t1 = +1.0f - 2.0f * (orien._x * orien._x + ysqr);
        roll = std::atan2(t0, t1);

        // pitch (y-axis rotation)
        double t2 = +2.0f * (orien._w * orien._y - orien._z * orien._x);
        t2 = ((t2 > 1.0f) ? 1.0f : t2);
        t2 = ((t2 < -1.0f) ? -1.0f : t2);
        pitch = std::asin(t2);

        // yaw (z-axis rotation)
        double t3 = +2.0f * (orien._w * orien._z + orien._x * orien._y);
        double t4 = +1.0f - 2.0f * (ysqr + orien._z * orien._z);
        yaw = std::atan2(t3, t4);
        //heading = yaw;
        //printf("->Roll %f, Pitch %f, Yaw %f", roll, pitch, yaw);
        //printf("->Heading: { %f %f}", orien._z, orien._w);
        oo.x = pitch;
        oo.y = roll;
        oo.z = yaw; // // 0, 360);
        return oo;
    }
    catch (const std::exception &e)
    {
        std::cerr << e.what() << '\n';
    }
    return vector3D_t(0,0,0);
}
