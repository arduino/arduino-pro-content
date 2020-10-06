# Blob Detection using OpenMV
In this tutorial you will use the vision carrier board for Portenta to detect the position of objects in a camera image. For that you will use a technique that is often referred to as blob detection. For this task you will write a MicroPython script and run it on the Portenta with the help of the OpenMV IDE.

## What You Will Learn
- How to use the OpenMV IDE to run MicroPython on Portenta
- How to use the built-in blob detection algorithm of OpenMV
- How to use MicroPython to toggle the built-in LEDs

## Required Hardware and Software
- Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
- Portenta Vision Carrier board
- USB C cable (either USB A to USB C or USB C to USB C)
- Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 
- Portenta Bootloader Version 20+
- OpenMV IDE 2.6.4+

# Portenta and the OpenMV IDE
The OpenMV IDE was built for Machine Vision applications. It is meant to provide an Arduino like experience for simple computer vision tasks using a camera sensor. OpenMV comes with its own fimware that is built on MicroPython. Among other hardware it supports the Portenta board. A statement from the creators of OpenMV on why they buit it:

>Currently, doing anything serious involving computer vision requires a computer running an operating system running may layers of software and requiring much setup before you can get computer vision code working. This is all well and fine if you need to do many other things than just processing images, like connecting to the internet, running many different applications concurrently, etc.
>
>But, what if, I just want to make an LED turn on if a red object appears in front of a white wall. Why do a need to build up a complex system for that? Or, what if I just want to turn on an LED when a face is in view?

[Here](https://openmv.io/) you can read more about the OpenMV IDE.


# Configuring the Development Environment
Before you can start programming OpenMV scripts for the Portenta you need to download and install the OpenMV IDE.

## 1. Downloading the OpenMV IDE
Open the [OpenMV download](https://openmv.io/pages/download) page in your browser and download the version that you need for your operating system. Follow the instructions of the installer. When the installation is done open the OpenMV IDE.

## 2. Flashing the OpenMV Firmware

Connect the Portenta to your computer via the USB-C cable if you haven't done so yet. Then put the Portenta in Bootloader mode by double pressing the reset button on the board. The built-in green LED will start fading in and out.

Click on the "connect" symbol at the bottom of the left toolbar. A pop-up will ask you how you would like to proceed "DFU bootloader(s) found. What would you like to do?". Select "Reset Firmware to Release Version". This will install the latest OpenMV firmware on the Portenta. If it asks you whether it should erase the internal file system you can click yes if you hadn't installed OpenMV before. Otherwise click no.

Portenta's green LED will start flashing while the OpenMV firmware is being uploaded to the board. You will see a message saying "DFU firmware update complete!" when the process is done.

***Installing the OpenMV firmware will overwrite any existing sketches in the internal flash of Portenta.***

The Portenta will start flashing its blue LED when it's ready to be connected. After the confirming the completion dialog the Portenta should already be connected to the OpenMV IDE, otherwise click the "connect" button once again.



# Blob Detection

In this section you will learn how to use the built-in blob detection algorithm to detect the location of objects in an image. That algorithm allows to detect areas in a digital image that differ in properties such as brightness or color compared to surrounding areas. These areas are called blobs.

To do so you need to feed an image from the camera to the algorithm. It will then analyse it and output the coordinates of the found blobs. You will visualize these coordinates directly on the image and indicate whether a blob was found by using the red and green LED.

## 1. Prepare the Script

Create a new script by clicking the "New File" button in the toolbar on the left side. Import the required modules:

```py
import pyb # Import module for board related functions
import sensor # Import the module for sensor related functions
import image # Import module containing machine vision algorithms
import time # Import module for tracking elapsed time
```

A module in Python is a confined bundle of functionality. By importing it into the script it gets made available.

## 2. Preparing the Sensor

In order to take a snapshot with the camera it has to be configured in the script.

```py
sensor.reset() # Resets the sensor
sensor.set_pixformat(sensor.GRAYSCALE) # Sets the sensor to grayscale
sensor.set_framesize(sensor.QVGA) # Sets the resolution to 320x240 px
sensor.skip_frames(time = 2000) # Skip some frames to let the image stabilize
```

The most relevant functions in this snipped are `set_pixformat`and `set_framesize`. The camera that comes with the Portenta Vision Carrier only supports gray scale images. Therefore we need to set it via the `sensor.GRAYSCALE`parameter.

The resolution of the camera needs to be set to a supported format both by the sensor and the algorithm. Algorithms which use a neural network are ususally trained on a specific image resolution. This makes them sensistive to the provided image snapshot resolution. The vision carrier supports `QVGA`which you will use in this tutorial.

## 3. Detecting Blobs

In order to feed the blob detection algorithm with an image you have to take a snapshot from the camera or load the image from memory (e.g. SD card or internal flash). In this case you will take a snapshot using the `snapshot()`function. The resulting image needs then to be fed to the algorithm using the `find_blobs`function. You will notice theat a list of tuples gets passed to the algorithm. In this list you can specify the gray scale values (brightness) that are mostly contained in the object that you would like to track. If you were for example to dect white objects on a black background the resulting range of brightness would be very narrow (e.g. from 200 - 255). Remember that 255 denotes the maximum brightess / white. If we're interested in a wider range of gray scale values to detect various objects we can set the threshold range for example to (100, 255).

```py
thresholds = (100, 255) # Define the min/max gray scale values we're looking for
img = sensor.snapshot() # Takes a snapshot and saves it in memory

# Find blobs with a minimal area of 15x15 = 200 px
# Overlapping blobs won't be merged
blobs = img.find_blobs([thresholds], area_threshold=225, merge=False)
```

Once the blobs are detected you may be interested to see where in the images they were found. This can be done by drawing directly on the camera image.

```py
# Draw blobs
for blob in blobs:
    # Draw a rectangle where the blob was found
    img.draw_rectangle(blob.rect(), color=255)
    # Draw a cross in the middle of the blob
    img.draw_cross(blob.cx(), blob.cy(), color=255)
```

The result of that will be visible in the Frame Buffer preview panel on the right side of the OpenMV IDE.

## 4. Toggling LEDs

What if you want some visual feedback from the blob detection without any computer connected to your Portenta? You could use for example the built-in LEDs to indicate whether or not a blob was found in the camera image.

```py
# Turn on green LED if a blob was found
if len(blobs) > 0:
    ledGreen.on()
    ledRed.off()
else:
# Turn the red LED on if no blob was found
    ledGreen.off()
    ledRed.on()
```

In this example the green LED will light up when there is at least one blob found in the image. The red LED will light up if no blob could be found.

## 5. Uploading the Script
Let's program the Portenta with the complete script and test if the algorithm works. Copy the following script and paste it into the new script file that you created.

```py
import pyb # Import module for board related functions
import sensor # Import the module for sensor related functions
import image # Import module containing machine vision algorithms
import time # Import module for tracking elapsed time

sensor.reset() # Resets the sensor
sensor.set_pixformat(sensor.GRAYSCALE) # Sets the sensor to grayscale
sensor.set_framesize(sensor.QVGA) # Sets the resolution to 320x240 px
sensor.skip_frames(time = 2000) # Skip some frames to let the image stabilize

thresholds = (100, 255) # Define the min/max gray scale values we're looking for
ledRed = pyb.LED(1) # Initiates the red led
ledGreen = pyb.LED(2) # Initiates the green led

clock = time.clock() # Instantiates a clock object

while(True):
    clock.tick() # Advances the clock
    img = sensor.snapshot() # Takes a snapshot and saves it in memory

    # Find blobs with a minimal area of 15x15 = 200 px
    # Overlapping blobs won't be merged
    blobs = img.find_blobs([thresholds], area_threshold=225, merge=False)

    # Draw blobs
    for blob in blobs:
        # Draw a rectangle where the blob was found
        img.draw_rectangle(blob.rect(), color=255)
        # Draw a cross in the middle of the blob
        img.draw_cross(blob.cx(), blob.cy(), color=255)

    # Turn on green LED if a blob was found
    if len(blobs) > 0:
        ledGreen.on()
        ledRed.off()
    else:
    # Turn the red LED on if no blob was found
        ledGreen.off()
        ledRed.on()

    pyb.delay(50) # Pauses the execution for 50ms
    print(clock.fps()) # Prints the framerate to the serial console


```

Click on the "Play" button at the bottom of the left toolbar. Place some objects on your desk and check if the Portenta can detect them.

***The MicroPython script doesn't get compiled and linked into an actual firmware. Instead it gets copied to the internal flash of the Portenta where it gets compiled and executed on the fly.***

# Conclusion

In this tutorial you learned how to use the OpenMV IDE to develop MicroPython scripts that then run on the Portenta board. You also learned how to configure the camera of the Vision Carrier board to be used for machine vision applications in OpenMV. Last but not least you learned how to interact with the built-in LEDs in MicroPython on the OpenMV firmware.  

# Next Steps
-   Familiarize yourself with the OpenMV IDE. There are many other features that didn't get mentioned in this tutorial.
-   Try out other machine vision examples that come with the OpenMV IDE (e.g. Face Detection). You can find them in the "Examples" menu.

# Troubleshooting
## OpenMV Firmware Flashing Issues
- If the upload of the OpenMV firmware fails during the download, put the board back in boot loader mode and try again. Give it a few tries until the firmware gets successfully uploaded.
- If the upload of the OpenMV firmware fails without even starting, try uploading the latest firmware using the "Load Specific Firmware File" option. You can find the latest firmware on the [OpenMV Github repository](https://github.com/openmv/openmv/releases).
- If you experience issues putting the board in bootloader mode, make sure you first update the bootloader to the latest version using the *PortentaH7_updateBootloader* sketch from the examples menu in the Arduino IDE.
- If the camera cannot get recognized by the OpenMV IDE or if you see a "No OpenMV Cams found!" message, press the reset button of Portenta once and wait until you see the blue LED flashing. Then try again connecting to the board.

**Authors:** Sebastian Romero
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** Sebastian Romero [5.10.2020]