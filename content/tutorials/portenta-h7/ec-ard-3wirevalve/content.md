# Controlling a Motorized ball Valve 
## Overview

This tutorial we are going to learn how to connect and control a motorized ball valve control by the Edge Control board using the `Arduino_EdgeControl.h` library. 

### You Will Learn

-   How to connect a motorized valve to the edge control board
-   How to connect an external power 
-   About the `Arduino_EdgeControl.h` library

### Required Hardware and Software

-   Arduino Edge control board
-   External power source (12V battery or power supply) - LiPo / SLA 
-   Micro USB cable
-   Arduino IDE 1.8.10+ or Arduino Pro IDE 0.0.4+
-   Phonix connectors 1844646

## Instructions 

A ball valve is a form of quarter-turn [valve](https://en.wikipedia.org/wiki/Valve) which uses a hollow, perforated and pivoting ball to control flow of liquids and gasses through it. There are both manual and motorized versions of these types of valves and in this example we will use a motorized version along with our Edge control board. You will be using some of the apis basic operations related to the control of the valve provided byt  `Arduino_EdgeControl.h` library.  

### 1. The Basic Setup

The Edge Control board comes with the core that needs to be installed from the board manager. (Release core on the board manager). 

Let's program the Portenta with the classic blink example to check if the connection to the board works:

-   In the classic Arduino IDE open the blink example by clicking the menu entry File->Examples->01.Basics->Blink. 
-   In the Arduino Pro IDE Copy and paste the following code into a new sketch in your IDE. 

Open ports and connect the board to the board manager. 

Get the Library called the arduino edge control 

### 2. Wiring the Motor

The motorized valve comes with three wires primarily marked as blue green and red. The blue and green are for the signal and the yellow is for the ground. 

![Schematics of the 3 wire motor]() 

Before plugging in the wires ensure the phoenix connectors are in place. Plugg in the wires to into the pins 

### 3. Uploading the classic blink sketch

Edge Control. Begin ( Start the edge control board  , Power.begin )

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

### 4. Controlling the Valve 

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

### 5. Connecting to a Power Source 

Lipo more effiecitn, current discharge is higher and higher battery life 



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