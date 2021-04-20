# Getting Started with the Edge Control
## Overview
The Edge Control board is a versatile tool that allows agriculturalists , creative and innovative solutions for Agriculture and technology. This tutorial will help you setup the development environment for the board and will cover the library and the API 

### You Will Learn
-   How to power up the board 
-   About the [Arduino_EdgeControl.h](https://github.com/bcmi-labs/Arduino_EdgeControl) library 
-   About the core APIs used control the board
-   

### Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 

## Instructions

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

### 1. The Basic Setup

Before you start programming the Edge control board, you will have to download the [Mbed core](https://github.com/arduino/ArduinoCore-mbed) from the board manager. Open the **Board manager** and look for the `Edge Control` core. This board comes with the **Nina B306** processor which is the same processor used in other Pro boards such as the **Portenta** and the **Nano 33 BLE**. 

![Download the Core](assets/ec_ard_gs_core.png)

Next you need to download the Example library that contains the Blink example. (identify how to install this library ). 

plug the board to your computer and m 

### 2. The Hello_edgeControl Sketch 

Open a new sketch file `hello_edge_control.ino` and add the [Edge Control library](). This library provides acess to many of the different pins and functionalities belonging to the board. 

```cpp
#include<Arduino_EdgeControl.h>
```

Next, you need to ensure that the Serial communication has begun. Ensure that the board waits for at least 2.5 seconds before to guarantee that the communication has been established. Print a message on the Serial line with the text `Hello, Edge Control` 

```cpp
  // Start the timer 
  auto startNow = millis() + 2500;
  while (!Serial && millis() < startNow);
  Serial.println("Hello, Edge Control!");
```

Once the serial communication has been established lines enable the power to the microcontroller. Certain parts of the board such as the Nina B3606 module, the control logic requires 3Vs where as the MKR Slots and GPIO pins require 5V to be operational. 3V comes from which comes from the USB and the 5V comes from external batteries. 

![Power rails of the Edge Control board](assets/ec_ard_gs_power_rail.png)

The `Power` class provides API access to enable the different voltage regulators present on the board. In this tutorial we need to enable the 3V and 5V power lines using the `enable3V3()` and `enable5V()` power source. 

```cpp
// Enable power lines 
  Power.enable3V3();
  Power.enable5V();
```

The edge control board uses Expander !--- (what are they ? Short sentence here) ---! . Communication to the Expander happens through the I2C port for which we will use the `Wire.begin() The onboard LED can e

```cpp
// Start the I2C connection 
  Wire.begin();

  // Initalise the expander pins 
  Expander.begin();
  Expander.pinMode(EXP_LED1, OUTPUT);
```

inside the loop, you can use the digitalWrite() to control the on

```cpp
    Serial.println("Blink");
    Expander.digitalWrite(EXP_LED1, LOW);
    delay(500);
    Expander.digitalWrite(EXP_LED1, HIGH);
    delay(500);
```

***Tip: The Complete Sketch can be found in the Conclusions***

### 3. Powering up the board 

Connect the battery to the board to one 

### 4. Uploading the classic blink sketch

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

## Conclusion
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.  

### Complete Sketch 

```cpp

```

### Next Steps

-   A
-   B

## Troubleshooting

### Sketch Upload Troubleshooting
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

**Authors:** XX, YY
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
