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



Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

### 2. The Hello_edgeControl Sketch 

Ensuring that the Serial port is connected 

```cpp
  // Start the timer 
  auto startNow = millis() + 2500;
  while (!Serial && millis() < startNow);
  Serial.println("Hello, Edge Control Sketch!");
```

The power lines enable the power to the microcontroller 

```cpp
  // Enable power lines 
  Power.enable3V3();
  Power.enable5V();
```

Enable the power lines 

```cpp
// Start the I2C connection 
  Wire.begin();

  // Initalise the expander pins 
  Expander.begin();
  Expander.pinMode(EXP_LED1, OUTPUT);
```

inside the loop, you can use the digitalWrite() to control the 

```cpp
    Serial.println("Blink");
    Expander.digitalWrite(EXP_LED1, LOW);
    delay(500);
    Expander.digitalWrite(EXP_LED1, HIGH);
    delay(500);
```

### 3. Powering up the board 

Connect the battery to the board and 

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
