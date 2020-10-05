# Blob Detection using OpenMV
In this tutorial you will use the vision carrier board for Portenta to detect the position of objects in a camera image. For that you will use a technique that is often referred to as blob detection. For this task you will write a MicroPython script and run it on the Portenta with the help of the OpenMV IDE.

## What You Will Learn
-   How to use the OpenMV IDE to run MicroPython on Portenta
-   How to use the built-in blob detection algorithm of OpenMV
-   How to use MicroPython to toggle the built-in LEDs

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   Portenta Vision Carrier board
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 

# Portenta and the OpenMV IDE
OpenMV is an IDE that was built for Machine Vision applications. It is meant to provide an Arduino like experience with a camera sensor. OpenMV comes with its own fimware that is built on MicroPython. Among other hardware it supports the Portenta board. [Here](https://openmv.io/) you can read more about the OpenMV IDE.


# Configuring the Development Environment
Before you can start programming OpenMV sketches for the Portenta you need to download and install the OpenMV IDE.

## 1. Downloading OpenMV
Open the [OpenMV download](https://openmv.io/pages/download) page in your browser and download the version that you need for your operating system. 

## 2. Connecting the Portenta Board

## 3. Flashing the OpenMV Firmware



# Blob Detection

## 1. Preparing the Sensor

## 2. Detecting Blobs

## 3. Toggling LEDs

## 4. Uploading the Sketch
Let's program the Portenta with the classic blink example to check if the connection to the board works:

-   In the classic Arduino IDE open the blink example by clicking the menu entry File->Examples->01.Basics->Blink. 
-   In the Arduino Pro IDE Copy and paste the following code into a new sketch in your IDE. 

```py
import pyb #Import module for board related functions
import sensor, image, time

sensor.reset()
sensor.set_pixformat(sensor.GRAYSCALE)
sensor.set_framesize(sensor.QVGA)
sensor.skip_frames(time = 2000)

thresholds = (100, 255)
ledRed = pyb.LED(1)
ledGreen = pyb.LED(2)

clock = time.clock()

while(True):
    clock.tick()
    img = sensor.snapshot()

    # Find blobs
    blobs = img.find_blobs([thresholds], area_threshold=200, merge=False)

    # Draw blobs
    for blob in blobs:
        img.draw_rectangle(blob.rect(), color=255)
        img.draw_cross(blob.cx(), blob.cy(), color=255)

    # Toggle LEDs
    if len(blobs) > 0:
        ledGreen.on()
        ledRed.off()
    else:
        ledGreen.off()
        ledRed.on()

    pyb.delay(50)
    print(clock.fps())

```

# Conclusion
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.  

# Next Steps
-   A
-   B

# Troubleshooting
## Sketch Upload Troubleshooting
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

**Authors:** XX, YY
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
