# Creating interactive GUIs With LVGL  
In this tutorial you will learn to use the [LVGL](https://lvgl.io/) library to create a simple graphical user interface that consists of a button and the inner text label that updates itself.

## What You Will Learn
-   Understanding the structure of LVGL callbacks.
-   Adding input devices to LVGL. 
-   Display custom data inside a LVGL widget. 

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+
-   USB-C hub with HDMI (<[The one we used](https://www.dustinhome.se/product/5011166993/travel-port-usb-c-total)>)
-   External monitor 
-   HDMI cable 
-   USB Keyboard
-   USB Mouse

# The implementation of interaction...

Usually what makes the difference when whe are using GUIs between each other, is how the user can interact and manipulate the data and how the user feels the way of communicating trough the GUI.
By adding the most common used interfaces, the Mouse and the Keyboard we are doing it to be more handful to computer users, but with LVGL you can use rotary encoders, keypads, buttons and much more to do the interaction as custom as your project need.

# Making the interactive GUI 

This tutorial will guide you to build a basic user interface using the LVGL , the USBhost and the RPC Libraries that you will have download using the Arduino Library Manager. The setup for this tutorial requires you to first to upload the finished sketch file to the Portenta board where it converts the board into a usb host Device. You will then connect the board to a USB-hub and connect an external monitor. Once the HUB is powered externally, a graphical user interface with a button and a text-area will be displayed on the screen. You will have the option to add a Mouse and a Keyboard to interact with those items (widgets).

![por_ard_lvgl_tutorial_steps](assets/por_ard_lvgl_tutorial_steps.svg)

## 1. The structure of the processors

In this case the Portenta M4 is going to be focused to receive the Mouse and Keyboard inputs, and send the information to the Portenta M7 trough RPC
This is the structure of our processors's sketches

Portenta
    * M4
        * lvgl_mouse_m4.ino - getting the input data and sending the it with RPC to the M7
    * M7
        * lvgl_interaction.ino - call the widgets.h and inputs.h custom made functions to configure, and display the LVGL output
        * inputs.h  - RPC callbacks from the M4 and to configure the LVGL's inputs
        * widgets.h - all the LVGL widgets and events/callbacks
