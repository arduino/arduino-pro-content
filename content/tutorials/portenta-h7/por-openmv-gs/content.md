# Getting Started with OpenMV and MicroPython

## Overview
In this tutorial, you will learn how the Portenta works with OpenMV and MicroPython. This tutorial will go through some features in OpenMV and MicroPython. You will then write a simple script in MicroPython that will use the I/O pins and PWM on the Portenta.

### What You Will Learn
- How to use the OpenMV IDE
- How to use the OpenMV IDE to run MicroPython on Portenta
- How to use PWM and I/O pins on the Portenta

### Required Hardware and Software
- Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
- Arduino Portenta Vision Shield (https://store.arduino.cc/portenta-vision-shield)
- USB C cable (either USB A to USB C or USB C to USB C)
- Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 
- Portenta Bootloader Version 20+
- OpenMV IDE 2.6.4+

## Portenta and the OpenMV IDE
The OpenMV IDE was built for Machine Vision applications. It is meant to provide an Arduino like experience for simple computer vision tasks using a camera sensor. OpenMV comes with its own firmware that is built on MicroPython. Among other hardware it supports the Portenta board. A statement from the creators of OpenMV on why they built it:

>Currently, doing anything serious involving computer vision requires a computer running an operating system running many layers of software and requiring much set up before you can get computer vision code working. This is all well and fine if you need to do many other things than just processing images, like connecting to the internet, running many different applications concurrently, etc.

This is where OpenMV comes in. [Here](https://openmv.io/) you can read more about the OpenMV IDE.

## MicroPython

With OpenMV and the Portenta board, it is possible to use MicroPython in sketches. MicroPython includes a lot of classes and libraries that makes it easier for us to use the Portenta to its full potential.

[Here](http://docs.MicroPython.org/en/latest/) you can read more about MicroPython.

### Pulse Width Modulation

Pulse width modulation (PWM) is a way to get an artificial analog output on a digital pin. By rapidly toggling the pin from low to high. There are two parameters associated with this: the frequency of the toggling, and the duty cycle. The duty cycle is defined to be how long the pin is high compared with the length of a single period. Maximum duty cycle is when the pin is high all the time, and minimum is when it is low all the time.

>On the Portenta the pins PA8, PC6, PC7, PG7, PJ11, PK1, and PH15 support PWM.

### I/O Pins

I/O pins are pins that can be set as input or output in the sketch. Using Micropython, there are methods to set the mode of the pin (input or output) and methods to get and set the digital logic level. We can also determine the behavior of the pull up or down resistor with the help of Micropython.

## Instructions

### Configuring the Development Environment
Before you can start programming OpenMV scripts for the Portenta you need to download and install the OpenMV IDE.

***IMPORTANT: Before you connect the Portenta to the OpenMV IDE make sure you update the bootloader as explained in the "Flashing the OpenMV Firmware" section!***

### 1. Downloading the OpenMV IDE
Open the [OpenMV download](https://openmv.io/pages/download) page in your browser and download the version that you need for your operating system. Alternatively, you may use the following direct download links of the OpenMV IDE 2.6.5:

- [For Windows Xp, Vista, 7, 8, 10 or Later](https://github.com/openmv/openmv-ide/releases/download/v2.6.5/openmv-ide-windows-2.6.5.exe)
- [For OsX Snow Leopard 10.6 or Later](https://github.com/openmv/openmv-ide/releases/download/v2.6.5/openmv-ide-mac-2.6.5.dmg)
- [For Ubuntu 12.04 Lts 32-Bit or Later](https://github.com/openmv/openmv-ide/releases/download/v2.6.5/openmv-ide-linux-x86-2.6.5.run)
- [For Ubuntu 12.04 Lts 64-Bit or Later](https://github.com/openmv/openmv-ide/releases/download/v2.6.5/openmv-ide-linux-x86_64-2.6.5.run)
- [For Raspberry Pi 0, 1, 2, 3, and 4 or Later](https://github.com/openmv/openmv-ide/releases/download/v2.6.5/openmv-ide-linux-arm-2.6.5.tar.gz)

Follow the instructions of the installer.

### 2. Flashing the OpenMV Firmware

Connect the Portenta to your computer via the USB-C cable if you haven't done so yet. Make sure you first update the bootloader to the latest version using the *PortentaH7_updateBootloader* sketch in the examples menu in the Arduino IDE. 
Instructions on how to update the bootloader can be found in the ["Updating the Portenta Bootloader" tutorial](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-bl).

***In bootloader versions 17 and older there was a bug that could put the Portenta in a boot loop when the transmission aborted while flashing a large firmware file. This was fixed in the bootloader version 18. We strongly advise to update the bootloader before you proceed with the next step of this tutorial!***

After updating the bootloader put the Portenta in bootloader mode by double pressing the reset button on the board. The built-in green LED will start fading in and out. Now open the OpenMV IDE.

![The OpenMV IDE after starting it](assets/por_openmv_open_ide.png)

Click on the "connect" symbol at the bottom of the left toolbar. 

![Click the connect button to attach the Portenta to the OpenMV IDE](assets/por_openmv_click_connect.png)

A pop-up will ask you how you would like to proceed "DFU bootloader(s) found. What would you like to do?". Select "Reset Firmware to Release Version". This will install the latest OpenMV firmware on the Portenta. If it asks you whether it should erase the internal file system you can click "No".

![Install the latest version of the OpenMV firmware](assets/por_openmv_reset_firmware.png)

Portenta's green LED will start flashing while the OpenMV firmware is being uploaded to the board. A terminal window will open which shows you the upload progress. Wait until the green LED stops flashing and fading. You will see a message saying "DFU firmware update complete!" when the process is done.

***Installing the OpenMV firmware will overwrite any existing sketches in the internal flash of Portenta. As a result the M7 port won't be exposed in the Arduino IDE anymore. To re-flash the M7 with an Arduino firmware you need to put the board into bootloader mode. To do so double press the reset button on the Portenta H7 board. The built-in green LED will start fading in and out. In bootloader mode you will see the Portenta M7 port again in the Arduino IDE.***

The Portenta will start flashing its blue LED when it's ready to be connected. After confirming the completion dialog the Portenta should already be connected to the OpenMV IDE, otherwise click the "connect" button once again.

![When the Portenta is successfully connected to the OpenMV IDE a green play button appears in the lower left](assets/por_openmv_board_connected.png)

### 3. Wiring the LED to the Portenta

To be able to change the LED's intensity with PWM we need to first wire the Portenta to the LED. If you want to use other pins than the ones shown here, take a look at the pinout diagram.

![Portenta pinout](assets/Pinout-PortentaH7_latest.png)

Here you can also see what functionality each pin has. In this tutorial wire the pin PC6 via a resistor to the positive leg of the LED, and wire the boards GND to the negative leg of the LED. As shown in the illustration.

[Illustration of a LEDs positive leg on a breadboard wired to the PC6 pin on the Portenta, and the negative end going to the GND pin on the Portenta]()

### 4. Preparing the MicroPython Sketch

Create a new script by clicking the "New File" button in the toolbar on the left side. Import the required modules:

```py
import pyb # Import module for board related functions
import time # Import module for board related functions
from pyb import Pin, Timer # Import module for board related functions
```

A module in Python is a confined bundle of functionality. By importing it into the script it gets made available.

### 5. Preparing the Pin and PWM

In order to control a LED connected to one of our pins, we first need to configure the pins behavior. After, we can set up the PWM.

```py
pin1 = Pin("PC6", Pin.OUT_PP, Pin.PULL_NONE)
timer1 = Timer(3, freq=1000) # Frequency in Hz
channel1 = timer1.channel(1, Timer.PWM, pin=pin1, pulse_width=0)

# maximum and minimum pulse-width, corresponds to maximum and minimum brightness
maxWidth = 5000
minWidth = 0

# How much to change the pulse-width by each step
step = 500
# Set starting value
curWidth = minWidth
```

In the `pin1` variable we define what pin on the board we intend to use. We also define if it should be an input or output pin with `Pin.OUT_PP`. Lastly, we can set the behavior of the pull up resistor on the pin, for now we set it as `Pin.PULL_NONE`.

>For more info about the options available, please see [Here](https://docs.micropython.org/en/latest/library/pyb.Pin.html?)

With the `timer1` variable we will determine what id the timer will have and what frequency it will use. With a timer frequency of 1000 Hz, each cycle takes 1 millisecond. When setting up the PWM channel we can then use these variables. With the `timer1.channel()` function we can customize the PWM channels behavior. `pulse_width` sets the initial pulse width for the PWM.

We also enter parameters for how much the LED will change each time the PWM pulses with the `step` variable, what value it should start on with `minWidth` and when it will reset with the `maxWidth` variable.

### 6. Using MicroPython

Putting our code inside a `while True:` function will make the code run in a loop.

```py
while True:

  channel1.pulse_width(curWidth)

  # this determines how often we change the pulse-width.
  pyb.delay(500)

  curWidth = curWidth + step

  if curWidth > maxWidth:
    print("Max width reached!")
    curWidth = minWidth
```

We use the `channel1.pulse_width()` function to set the pulse width of the PWM channel, changing the intensity of the LED. Using `pyb.delay()` we can make the sketch stop running for the determined amount of time, which is 500 milliseconds in this example. At the end, we check if the value has reached our defined end, we print a message to the serial terminal and reset the `curWidth` variable.

### 7. Uploading the Script

If the wiring is correct the LED light should start incrementally getting brighter before resetting and starting over. Printing a message when the limit has been reached. 

```py
import pyb # Import module for board related functions
import time # Import module for board related functions
from pyb import Pin, Timer # Import module for board related functions

pin1 = Pin("PC6", Pin.OUT_PP, Pin.PULL_NONE)

timer1 = Timer(3, freq=1000) # Frequency in Hz

channel1 = timer1.channel(1, Timer.PWM, pin=pin1, pulse_width=0)

# Maximum and minimum pulse-width, corresponds to maximum and minimum brightness
maxWidth = 5000
minWidth = 0

# How much to change the pulse-width by each step
step = 500
# Set starting value
curWidth = minWidth

while True:
  channel1.pulse_width(curWidth)

  # How often the pulse-width is changed
  pyb.delay(500)
  curWidth = curWidth + step

  if curWidth > maxWidth:
    print("Max width reached!")
    curWidth = minWidth
```

## Conclusion

In this tutorial, you learned how to use the OpenMV IDE to develop MicroPython scripts that run on the Portenta board. You learned how to use and configure I/O pins and PWM on the Portenta. Lastly, you learned how to use these to control a LED light.


### Next Steps
-   Blob Detection with Portenta and OpenMV
-   Creating a Basic Face Filter With OpenMV

## Troubleshooting
### OpenMV Firmware Flashing Issues
- If the upload of the OpenMV firmware fails during the download, put the board back in boot loader mode and try again. Give it a few tries until the firmware gets successfully uploaded.
- If the upload of the OpenMV firmware fails without even starting, try uploading the latest firmware using the "Load Specific Firmware File" option. You can find the latest firmware on the [OpenMV Github repository](https://github.com/openmv/openmv/releases). Look for a file calLED *firmware.bin* in the PORTENTA folder.
- If you experience issues putting the board in bootloader mode, make sure you first update the bootloader to the latest version using the *PortentaH7_updateBootloader* sketch from the examples menu in the Arduino IDE.
- If you see a "OSError: Reset FaiLED" message, reset the board by pressing the reset button. Wait until you see the blue LED flashing, connect the board to the OpenMV IDE and try running the script again.

**Authors:** Sebastian Romero, Benjamin Dannegård  
**Reviewed by:** Lenard George [2021-03-31]  
**Last revision:** Benjamin Dannegård [2021-03-31]
