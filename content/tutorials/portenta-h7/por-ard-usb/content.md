# Portenta H7 as a USB Host

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

## What you will learn

-   A
-   B
-   C

## Required hardware and software

-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   USB C adapter (you can find [here](https://www.dustin.se/product/5011166993/travel-port-usb-c-total) the one we used for the tutorial)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 

# Portenta and The ...

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. [Here](https://www.ni.com/en-us/innovations/white-papers/07/what-is-a-real-time-operating-system--rtos--.html) you can read more about real time operating systems.

![The Arduino core is built on top of the Mbed stack](/Users/jose/Desktop/Portenta/tutorialExamples/USB_HOST/content/por-ard-usbh/assets/Arduino-Logo.svg)


# Setting Up the USB host

In this tutorial you are going to convert your Portenta in a USB Host that will allow you, by using a keyboard, to toggle the RGB built-in LEDs of the board. Throughout the tutorial, you will learn how to connected the keyboard to the Portenta board and how to program the board to become it in a USB Host device.

## 1. The Basic Setup

Begin by plugging in your Portenta board to the computer using a USB-C  cable and open the  Arduino IDE or the Arduino Pro IDE. If this is your  first time running Arduino sketch files on the board, we suggest you  check out how to [set up the Portenta H7 for Arduino](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-gs) before you proceed. 

![The Portenta H7 can be connected to the computer using an appropriate USB-C cable](/Users/jose/Desktop/Portenta/tutorialExamples/USB_HOST/content/por-ard-usbh/assets/por_ard_usbh_basic_setup.svg)

## 2. Creating the keyboard controller

Now, let's create a sketch that handles the USB connections and  modify the state of the LEDs with each press on the r (or R), g (or G) and b (or B), keys. As program all the USB protocoll that allows the board handle USB devices is an arduous task, you will use the an example already built, to do so, first, Make sure you select Arduino Portenta H7 (M7 core) as the board.

![Select the Arduino Portenta H7 (/Users/jose/Desktop/Portenta/tutorialExamples/USB_HOST/content/por-ard-usbh/assets/por_ard_usbh_upload_sketch.png) in the board selector.](assets/por_ard_usbh_upload_sketch.png)

Then, open: File>Examples>USBHOST>KeyboardController

![Open the Keyboard Controller example.](/Users/jose/Desktop/Portenta/tutorialExamples/USB_HOST/content/por-ard-usbh/assets/por-ard-ushb-keyboardController.png)

The USBHost.h library that is used in this example is a revamp of the classic Arduino USBHost.h library. This new version, among adapting the protocol to the new versions of USB, allows to connect devices through HUBs or USB adapters. It could be helpful for you to take a look at the Arduino [USBHost.h]](https://www.arduino.cc/en/Reference/USBHost) library to better understand how the libraries work.

## 3. Detecting the keys from the keyboard

The example you have opened describes how the board will handle the connection with a keyboard addressing the functionality of each one of the keys of the keyboard.

In order to modify the state of the LEDs of the Portenta board, you will need to modify and add some lines of code to the example:

Let's start by removing the comment line ( `//` )of the following line `.on_key = process_key` at the beginning of the code. By doing this, each time we press a key in the keyboard, we are calling the function that converts the data received from the keys into chars instead of using them in its HEX format.

```cpp
static const tusbh_boot_key_class_t cls_boot_key = {
  .backend = &tusbh_boot_keyboard_backend,
  //.on_key = process_key
};
```

