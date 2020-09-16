# Setting Up Portenta H7 For Arduino
Congratulations on your purchase of one of our most powerful microcontroller boards to date! We know you are eager to try out your new board but before you can start using the Portenta H7 to run Arduino sketches you need to configure your computer and the Arduino IDE. This tutorial teaches you how to set up the board, how to configure your computer and how to run the classic Arduino blink example  to verify if the configuration was successful.

One of the benefits of the Portenta H7 is that it supports different types of software cores. A core is the software API for a particular set of processors. It is the API that provides functions such as digitalRead(), analogWrite(), millis() etc. which directly operate on the hardware.

At the moment of writing the tutorial, there is an Arduino core and a MicroPython core available for working with Portenta. The latter one allows you to write sketches in the popular programming language Python rather than C or C++ and run them on the Portenta H7.

This tutorial focuses on the Arduino core which allows you to benefit from the thousands of existing Arduino libraries and code examples written in C and C++ which are compatible with the Arduino core. A tutorial about setting the Portenta H7 up for development with the MicroPython core will be released soon.

## What You Will Learn
-   About the Arduino and Mbed operating system (Mbed OS) stack
-   Installing the Mbed library  
-   Controlling the built in LED on the Portenta board

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+

# Portenta and The Arduino Core
The Portenta H7 is equipped with two Arm Cortex ST processors (Cortex-M4 and Cortex-M7) which run the Mbed OS.  Mbed OS is an embedded real time operating system (RTOS) designed specifically for microcontrollers to run IoT applications on low power. A real-time operating system is an operating system designed to run real-time applications that process data as it comes in, typically without buffer delays. [Here](https://www.ni.com/en-us/innovations/white-papers/07/what-is-a-real-time-operating-system--rtos--.html) you can read more about real time operating systems.

The Arduino core for the Portenta H7 sits on top of the Mbed OS and allows to develop applications using Mbed OS APIs which handle for example storage, connectivity, security and other hardware interfacing. [Here](https://os.mbed.com/docs/mbed-os/v5.15/apis/index.html) you can read more about the Mbed OS APIs. However, taking advantage of the Arm® Mbed™ real time operating system's powerful features can be a complicated process. Therefore we simplified that process by allowing you to run Arduino sketches on top of it.

![The Arduino core is built on top of the Mbed stack](assets/por_gs_mbed_stack.svg?sanitize=true)


# Configuring the Development Environment
In this section, we will guide you through a step-by-step process of setting up your Portenta board for running an Arduino Sketch that blinks the built-in RGB LED.

## 1. The Basic Setup
Let's begin by Plug-in your Portenta to your computer using the appropriate USB C cable. Next, open your IDE and make sure that you have the right version of the Arduino IDE or the PRO IDE downloaded on to your computer.

![The Portenta H7 can be connected to the computer using an appropriate USB-C cable](assets/por_ard_gs_basic_setup.svg?sanitize=true)

## 2. Adding the Portenta to the list of available boards
This step is the same for both the classic IDE and the Pro IDE. Open the board manager and search for "portenta".  Find the Arduino mbed-enabled Boards library and click on "Install" to install the latest version of the mbed core (1.9.6 at the time of writing this tutorial).

**Note:** If you have previously installed the Nano 33 BLE core  it will be updated by following this step.

![A search for "portenta" reveals the core that needs to be installed to support Portenta H7.](assets/por_ard_gs_bm_core.png)

![Also in the Pro IDE, a search for "portenta" reveals the core that needs to be installed to support Portenta H7.](assets/por_ard_gs_bm_core_pro_ide.png)

## 3. Verify the USB connection  (Windows only)
In this step you will check if Windows is able to detect the Portenta H7. To do so open the Windows Device manager and if everything is set up correctly you will be able to see your device listed under USB devices. Otherwise, try unplugging it and plugging it back in.

![If the Portenta H7 is detected correctly, it will be listed in the device manager under USB devices.](assets/por_ard_gs_usb_driver_win.png)

## 4. Uploading the classic blink sketch
Let's program the Portenta with the classic blink example to check if the connection to the board works:

-   In the classic Arduino IDE open the blink example by clicking the menu entry File->Examples->01.Basics->Blink.
-   In the Arduino Pro IDE Copy and paste the following code into a new sketch in your IDE.

```cpp
// the setup function runs once when you press reset or power the board
void setup() {
    // initialize digital pin LED_BUILTIN as an output.
    pinMode(LED_BUILTIN, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
    digitalWrite(LED_BUILTIN, HIGH); // turn the LED on (HIGH is the voltage level)
    delay(1000); // wait for a second
    digitalWrite(LED_BUILTIN, LOW); // turn the LED off by making the voltage LOW
    delay(1000); // wait for a second
}
```

For Portenta H7  LED_BUILTIN  represents the built-in RGB LED on the board in green color.

**Note:** The individual colours of the built-in RGB LED can be accessed and controlled separately. In the tutorial "Dual Core Processing"  you will learn how to control the LED to light it in different colors

## 5. Upload the blink sketch 
Now it's time to upload the sketch and see if the LED will start to blink. Make sure you select Arduino Portenta H7 (M7 core) as the board and the port to which the Portenta H7 is connected. If the Portenta H7 doesn't show up in the list of ports, go back to step 5 and make sure that the drivers are installed correctly. Once selected click Upload. Once uploaded the built-in LED should start blinking with an interval of 1 second.

**Note:** The Portenta H7 has an M7 and an M4 processor which run separate cores. That's why you need to select the one to which you want to upload your sketch to (check out the tutorial "Dual Core Processing" to learn more about Portenta's processors).

![Select the Arduino Portenta H7 (M7 core) in the board selector.](assets/por_ard_gs_upload_sketch.png)

![Selecting the Arduino Portenta H7 (M7 core)](assets/por_gs_board_selection_pro_ide.png)

# Conclusion
You have now configured your Portenta board to run Arduino sketches. Along with that you gained an understanding of how the Arduino Core runs on top of Mbed OS.  

# Next Steps
-   Proceed with the next tutorial "Dual Core Processing" to learn how to make use of Portenta H7's two processors to do two separate tasks simultaneously.
-   Read more about why we chose Mbed as as the foundation [here](https://blog.arduino.cc/2019/07/31/why-we-chose-to-build-the-arduino-nano-33-ble-core-on-mbed-os/)

# Troubleshooting
## Sketch Upload Troubleshooting
If trying to upload a sketch but you receive an error message, saying that the upload has failed you can try to upload the sketch while the Portenta H7 is in bootloader mode. To do so you need to double click the reset button. The green LED will start fading in and out. Try to upload the sketch again. The green LED will stop fading when the upload completes.

![Double-clicking the reset button puts the board into bootloader mode.](assets/por_ard_gs_reset.png)

If you are using an active USB hub, please make sure it is supplied. Passive hubs will not work.

### Issues on Ubuntu
- Make sure modemmanager is not installed. In case remove it with `sudo apt-get remove modemmanager`
- Add the following rule to you udev rules `SUBSYSTEMS=="usb", ATTR{idVendor}=="2341", MODE:="0666"`
- Reboot your PC

**Authors:** Lenard George, Sebastian Hunkeler  
**Reviewed by:** Jose Garcia [18.03.2020]  
**Last revision:** 27.3.2020
