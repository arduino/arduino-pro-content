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
The OpenMV IDE was built for Machine Vision applications. It is meant to provide an Arduino like experience for simple computer vision tasks using a camera sensor. OpenMV comes with its own fimware that is built on MicroPython. Among other hardware it supports the Portenta board. A statement from the creators of OpenMV on why they buit it:

>Currently, doing anything serious involving computer vision requires a computer running an operating system running may layers of software and requiring much setup before you can get computer vision code working. This is all well and fine if you need to do many other things than just processing images, like connecting to the internet, running many different applications concurrently, etc.
>
>But, what if, I just want to make an LED turn on if a red object appears in front of a white wall. Why do a need to build up a complex system for that? Or, what if I just want to turn on an LED when a face is in view?

[Here](https://openmv.io/) you can read more about the OpenMV IDE.


# Configuring the Development Environment
Before you can start programming OpenMV sketches for the Portenta you need to download and install the OpenMV IDE.

## 1. Downloading the OpenMV IDE
Open the [OpenMV download](https://openmv.io/pages/download) page in your browser and download the version that you need for your operating system. Follow the instructions of the installer. When the installation is done open the OpenMV IDE.

## 2. Flashing the OpenMV Firmware

Connect the Portenta to your computer via the USB-C cable if you haven't done so yet. Then put the Portenta in Bootloader mode by double pressing the reset button on the board. The built-in green LED will start fading in and out.

Click on the "connect" symbol at the bottom of the left toolbar. A pop-up will ask you how you would like to proceed "DFU bootloader(s) found. What would you like to do?". Select "Reset Firmware to Release Version". This will install the latest OpenMV firmware on the Portenta. If it asks you whether it should erase the internal file system you can click yes if you hadn't installed OpenMV before. Otherwise click no.

Portenta's green LED will start flashing while the OpenMV firmware is being uploaded to the board. You will see a message saying "DFU firmware update complete!" when the process is done.

***Installing the OpenMV firmware will overwrite any existing sketches in the internal flash of Portenta.***

The Portenta will start flashing its blue LED when it's ready to be connected. After the confirming the completion dialog the Portenta should already be connected to the OpenMV IDE, otherwise click the "connect" button once again.



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
