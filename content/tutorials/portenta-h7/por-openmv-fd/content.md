# Face Detection with Portenta and OpenMV
In this tutorial you will build a micropython application through openMV that uses the Portenta Vision Shield to    detect faces. 

## What You Will Learn
- How to use the OpenMV IDE to run MicroPython on Portenta,
- About the face detection method implemented in the example, 
- How to use the built-in face detection algorithm of OpenMV,
- How to use MicroPython to read files from the internal flash.

## Required Hardware and Software
- Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
- Arduino Portenta Vision Shield (https://store.arduino.cc/portenta-vision-shield)
- USB C cable (either USB A to USB C or USB C to USB C)
- Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 
- Portenta Bootloader Version 20+
- OpenMV IDE 2.6.4+


# Configuring the Development Environment
If you haven't installed the OpenMV IDE yet, please have a look at the tutorial XYZ...



# Face Detection

In this section you will learn how to use the built-in ...

## 1. Prepare the Script

Create a new script by clicking the "New File" button in the toolbar on the left side. Import the required modules:

```py
import pyb # Import module for board related functions
import sensor # Import the module for sensor related functions
import image # Import module containing machine vision algorithms
import time # Import module for tracking elapsed time
```



## 2. Preparing the Sensor



## 3. Detecting the Face

In order to...

## 4. Overlaying an Image

...

## 5. Uploading the Script
Let's program the Portenta with the complete script and test if the algorithm works. Copy the following script and paste it into the new script file that you created.

```py
import pyb # Import module for board related functions


```

# Conclusion

In this tutorial you learned...

# Next Steps
-   TBD

# Troubleshooting


**Authors:** Sebastian Romero, Lenard George  
**Reviewed by:** Lenard George [6.10.2020]  
**Last revision:** Sebastian Romero [7.10.2020]