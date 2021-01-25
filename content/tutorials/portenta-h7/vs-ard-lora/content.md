# Vision Shield Lora Connectivity for Portenta H7
This tutorial explains how to connect your Portenta H7 to The Things Network (TTN) through the Vision Shield Lora Connectivity. A data communication channel will be enabled between Portenta H7 and a TTN application that will be configured in your TTN console.

## What You Will Learn
-   What LoRaWAN® and TTN are
-   How to setup your Portenta H7 and Vision Shield Lora Connectivity with TTN
-   To develop an application that enables communication between Portenta H7 and an application in TTN

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   Vision Shield (Lora Connectivity)
-   Dipole antenna
-   An account on [The Things Network (TTN)](https://www.thethingsnetwork.org/)
-   To be within range (10 Km) from an available Lora Gateway. Check availability on [The Things Network map](https://www.thethingsnetwork.org/map) 
-   Arduino IDE 1.8.13+ or Arduino Online Editor

# Portenta and The Things Network
The LoRaWAN technology allows things to talk to the Internet without WiFi or 3G / 4G. This means that our Portenta H7 with the Vision Shield (Lora Connectivity) are able to exchange data with an online application without relying on a WIFI or mobile network. Instead, our devices connect to an available Lora Gateway to communicate with the internet.

The LoRaWAN® (Long Range Wide Area Network) specification is a protocol that connects a device (or 'thing') to the internet specifically designed for the Internet of Things (IoT). Besides long range this protocol also features low battery usage and low bandwidth. All these aspects combined make LoRa the perfect solution for the IoT!

Now that we have the communication channel (LoraWAN), a platform that interconnects the devices, gateways and online applications is required. For this, The Things Network (TTN) is the most known global platform. TTN is a decentralized and collaborative network that provides thousands of gateways (connection points) around the world. So, we will be using TTN to connect our Portenta H7 and Vision Shield Lora to the internet.

# Configuring the Development Environment
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.

## 1. The Basic Setup
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.

## 2. Uploading the classic blink sketch
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

# Conclusion
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.  

# Next Steps
-   A
-   B

# Troubleshooting
## Sketch Upload Troubleshooting
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.

**Authors:** XX, YY
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
