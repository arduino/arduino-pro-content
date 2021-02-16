# Using RPC for Dual Core Processing

## Overview
In this tutorial you will learn how you can use RPC (remote procedure call) to communicate between the Portenta's two cores in a dual core application. You will get an introduction to the concept of RPC and use the `RPC_internal.h` library. This tutorial builds upon using LVGL to visualize data, if you want to find out more about how ho use LVGL to create graphical user interfaces with your Portenta, check out the [LVGL tutorial](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-lvgl).

### What You Will Learn
-   What RPC is and its applications
-   Understanding the RPC library
-   Creating a dual core sketch for the Portenta
-   Using LVGL and FFT to visualize frequencies 

### Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   Portenta Vision Shield (<https://store.arduino.cc/portenta-vision-shield>)
-   USB-C cable (either USB-A to USB-C or USB-C to USB-C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 
-   USB-C hub with HDMI ([The one we used](https://www.dustinhome.se/product/5011166993/travel-port-usb-c-total))
-   External monitor 
-   HDMI cable 

## What is RPC
A remote procedure call (RPC) is when a computer program calls for a procedure (set of instructions) to be executed in a different address space, for example on another computer or a different memory section of the device. In Portenta H7 for example, the M7 core is able to run a sketch which calls for a subroutine to be executed on M4 or vice versa. Once the procedure is run by the remote (server), the results of the subroutine are returned to the local computer (client) to carry on with the following instruction. RPC are based on a client-server relation model, in which the caller is the client and the executor is server.

todo --> add illustration RPC

### Scope of the Tutorial
There is a number of different use cases and possibilities of using RPC on the Portenta. For this tutorial however we will focus on dedicating one of the cores to create a graphical user interface (GUI) that will be shown on the external monitor, while the second core handles the collection and processing of the used input data. The input data consists in this case of sounds detected by the Portenta Vision Shield's microphone and is being processed by the use of FFT. FFT stands for **fast Fourier transform** and is used to deconstruct a signal in its different frequencies. This combination allows us to build a simple **audio frequency visualizer** and both Portenta cores will thereby use RPC to communicate with each other.

### 1. Setting up the Environment
First of all begin by attaching the Vision Shield to the Portenta by using the high density connectors on the back side of the board.
Then plug your Portenta into the computer using a USB-C cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out [how to set up the Portenta H7 for Arduino](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-gs) before you proceed.

After having connected and selected your board it is time to download the necessary libraries. Therefore open the **Library Manager** and install the following libraries, needed for this activity:

-   LVGL by by [kisvegabor](https://github.com/kisvegabor)
-   todo --> add correct FFT lib here 

### 2. Creating a Dual Core Sketch
This example will use both the M4 and M7 core of the Portenta, therefore we have to upload the appropriate sketch to both of the cores. This can be achieved either by using a single sketch and defining the various parts for the specific core, or creating two separate sketches for both cores. 
To keep the code easier to read we will split it up in two sketches for this activity, however if you are interested in creating one sketch to program both cores check out the following section of the [dual core processing tutorial](https://arduino-pro-website-dev.arduino.cc/pro/tutorials/portenta-h7/por-ard-dcp#programming-both-cores-with-just-one-sketch).
The first sketch with the name of `RpcAudioCore.ino` will be running on the M7 core of the Portenta, considering that the M7 is currently the only core which is able to access the microphone directly. The second sketch, `RpcGuiCore.ino`, is going to handle LVGL and the graphical user interface. This sketch will be running on Portenta's M4 core.

### 3. LVGL and FFT
Besides the RPC approach there are both LVGL and FFT playing a key role in this tutorial. [LVGL](https://lvgl.io/) stands for *Light and Versatile Graphics Library* and is a library used to create simple GUIs for microcontrollers or embedded systems. It is not necessary to have completed the [LVGL tutorial](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-lvgl) to master this activity but it can give a more detailed view on the use cases and possibilities with LVGL.

Fast Fourier transform (FFT) on the other hand allows us to deconstruct a signal, such as an audio signal from the microphone in this case, into all it's underlying frequencies. In a second step we will use those frequencies and visualize them using LVGL. In order to perform a FFT on the audio stream picked up on by the Vision Shield microphone we use the ... (todo --> reference correct lib) library.    

todo --> add illustration FFT

### 4. The Audio Core (M7)
todo --> explain m7 sketch + code blockwise

### 5. The GUI Core (M4)
todo --> explain m4 sketch + code blockwise

### 6. Upload the Sketch
todo --> reference both full sketches to copy-paste + mention how to upload the 2 sketches on the 2 cores

### 7. Connect an External Monitor
After having uploaded the sketches to the Portenta your board becomes the host. Unplug the board from your computer and connect it to the USB-hub along with a monitor on the HDMI port. Power up your hub by connecting it to an external power source and the monitor should start displaying the grid for the frequency visualization. Try out making different sounds and see the GUI reacting to them.

## Conclusion

### Next Steps

## Troubleshooting

**Authors:** Manuel Zomer, Sebastian Romero
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
