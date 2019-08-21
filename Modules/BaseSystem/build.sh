#! /bin/bash

if [ ! -d "build" ]; then
    mkdir build 
    cd build 
    if [[ $1 == "gcc" ]]; then
        cmake -D CMAKE_BUILD_TYPE=Debug -D CMAKE_C_COMPILER=gcc -D CMAKE_CXX_COMPILER=g++ --build ..
    elif [[ $1 == "clang-4" ]]; then
        cmake -D CMAKE_BUILD_TYPE=Debug -D CMAKE_C_COMPILER=clang-4.0 -D CMAKE_CXX_COMPILER=clang++-4.0 --build ..
    elif [[ $1 == "clang-5" ]]; then
        cmake -D CMAKE_BUILD_TYPE=Debug -D CMAKE_C_COMPILER=clang-5.0 -D CMAKE_CXX_COMPILER=clang++-5.0 --build ..
    elif [[ $1 == "clang-7" ]]; then
        cmake -D CMAKE_BUILD_TYPE=Debug -D CMAKE_C_COMPILER=clang-7 -D CMAKE_CXX_COMPILER=clang++-7 --build ..
    elif [[ $1 == "clang-8" ]]; then
        cmake -D CMAKE_BUILD_TYPE=Debug -D CMAKE_C_COMPILER=clang-8 -D CMAKE_CXX_COMPILER=clang++-8 --build ..
    elif [[ $1 == "clang" ]]; then
        cmake -D CMAKE_BUILD_TYPE=Debug -D CMAKE_C_COMPILER=clang -D CMAKE_CXX_COMPILER=clang++ --build ..
    else
        cmake ..
    fi
    cd ..
fi
cd build
make

cd ..

cp build/libDrone.so ../

echo "Compilation Completed!\n"
echo "Building NodeJS Library\n"

#swig -c++ -python Drone.i
#g++ -fpic -c Drone_wrap.cxx -I/usr/include/python3.7m
#g++ -shared Drone_wrap.o lib/librpc.so build/libDrone.so -o _Drone.so

echo "NodeJS Library build successfully! Everything Done!"