# Controlling a Motorized ball Valve 
## Overview

This tutorial we are going to learn how to connect and control a motorized ball valve control by the Edge Control board using the `Arduino_EdgeControl.h` library. 

### You Will Learn

-   How to connect a motorized valve to the edge control board,
-   How to power the board with an external power supply,
-   To use the `Arduino_EdgeControl.h` library and its APIs 

### Required Hardware and Software

-   Arduino Edge control board
-   External power source (12V battery or power supply) - LiPo / SLA 
-   Micro USB cable
-   Arduino IDE 1.8.10+ or Arduino Pro IDE 0.0.4+
-   Phoenix connectors 1844646
-   Jumper cables 

## Instructions 

A ball valve is a form of quarter-turn [valve](https://en.wikipedia.org/wiki/Valve) which uses a hollow, perforated and pivoting ball to control flow of liquids and gasses through it. There are both manual and motorized versions of these types of valves and in this example we will use a motorized version along with the Edge control board. With the help of the `Arduino_EdgeControl.h` library you will be  will be using some of the apis to  perform some basic operations such as opening and closing the valves. We used a (*specify the model*) lipo battery to power the valves as its easier to get hold of one. 

### 1. The Basic Setup

The Edge control board is controlled by the mmodule that requires you to use the  `Edge Control` core that needs to be installed from the board manager. (Release core on the board manager). 

![Download the Core]()

Add the header file `Arduino_EdgeControl.h` to your sketch 

```c++
#include <Arduino_EdgeControl.h>
```

Let's program the Portenta with the classic blink example to check if the connection to the board works:

-   In the classic Arduino IDE open the blink example by clicking the menu entry File->Examples->01.Basics->Blink. 
-   In the Arduino Pro IDE Copy and paste the following code into a new sketch in your IDE. 

Open ports and connect the board to the board manager. And upload the blink example you find inside the example folder. This sketch si to test if the board is recognised by the IDE and if you have installed the right core. Upload the code and open the serial monitor 

### 2. Connecting the valve

The motorized valve comes with three wires primarily marked as blue green and red. The blue and green are for the signal and the yellow is for the ground. 

![Schematics of the 3 wire motor]() 

Before plugging in the wires ensure the phoenix connectors are in place. Plugg in the wires to into the pins 

### 3. Opening and Closing the valves 

Let's create the sketch for the Edge Control. Begin ( Start the edge control board  , Power.begin )

Latching.begin ( pulse, direction ; Strobe ; Output )

```cpp
void setup()
{
    Serial.begin(9600);
    while(!Serial);

    delay(1000);

    Serial.println("3-Wire Valve Demo");

    EdgeControl.begin();
    Latching.begin();

    Serial.println("Starting");
}

```

The valves are operated through the onboard latches. Latches allow you to store the state of the pins based on the previous output. As the valve doesnt come with internal drivers to store the state of the motor, the Latching Out are latching ports/pins with drivers that are able to drive latch-kind devices without any external component. The connection to the Latching circuits can be found on the board marked as `LATCHING OUT`.

![LATCHING OUT pins on the Edge Control]()

you can attach a valve directly to any pins from 1- 8 . the Edge Control has already all the protection circuitry on-board. 

`Latching.channelDirection()` is used to control the signal to the pin and its direction through the parameters `LATCHING_OUT_1` and `POSITIVE` . Latching.strobe(4500)` sets the duration of signal. Strobe - two signals for on and off. N and P are the two ports , based on the dimension, duration of the signal. 

```c++
Latching.channelDirection(LATCHING_OUT_1, POSITIVE)
Latching.strobe(4500); 
```

In similar manner we need to include a command that will send the same signal in the opposite direction that will open the valve in the opposite direction. 

```c++
Latching.channelDirection(LATCHING_OUT_1, NEGATIVE)
Latching.strobe(4500); 
```

Heres a complete sketch

```cpp
void loop()
{
    Serial.println("Closing");
    Latching.channelDirection(LATCHING_OUT_1, POSITIVE);
    Latching.strobe(4500);
    delay(2500);

    Serial.println("Opening");
    Latching.channelDirection(LATCHING_OUT_1, NEGATIVE);
    Latching.strobe(4500);
    delay(2500);
}
```

### 4. Connecting to a Power Source 

The Valves require a power supply of 9 - 12 V and you can either use a power supply or lipo batteries to provide the required voltage. Power sources can be connected to the onboard relay ports of the edge control board. 

![The power pins of the Edge Control]()

Connect two jumper wires to the relay pins GND and  

[note]

we recommend using Lipo batteries. In this tutorial we have a Lipo more effiecitn, current discharge is higher and higher battery life. 

[/note]

### 5. Uploading the Sketch 

## Conclusion 

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.  

### Next Steps

-   Watermark / soil moisture sensor 
-   Remote activation 

### Complete Sketch

 

## Troubleshooting

### Sketch Upload Troubleshooting

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

**Authors:** Ernesto E. Lopez, Lenard George Swamy
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]