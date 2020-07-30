# BLE on the Portenta H7 For Arduino
In this tutorial we will enable low energy bluetooth (BLE) on the Portenta H7 to allow an external bluetooth program to control the on-board LED eithe by turning it on or off. 

## What you will learn
-   How to enable BLE on the Protenta H7
-   How to connect to the Portenta through BLE from an external Mobile Application (In this case nrfconnect by Nordic software)
-   How to turn on and off the Portenta H7 on-board LED

## Required hardware and software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.13+  or Arduino Pro IDE 0.0.4+ 
-   Nordic mobile app *nrfconnect* or equivalent to connect to bluetooth devices. Platforms [nrfconnect for iOS](https://itunes.apple.com/us/app/nrf-connect/id1054362403?ls=1&mt=8) or [nrfconnect for android](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp)

# Portenta and The ... 


![The Arduino core is built on top of the Mbed stack](assets/Arduino-Logo.svg?sanitize=true)


# Configuring the Development Environment
You will need to install the "ArduinoBLEE" library on whatever Arduino IDE you are using. For this example we will use the Regular Arduino IDE.
To install the library File --> Manage Libarary--> type "ArduinoBLE" click install

## 1. The Basic Setup
We are going to upload a basic on-board LED controlling Bluetooth program to the Portenta H7 board and then use a mobile bluetooth connection app to turn the LED on and off. (Reminder that on the Portenta the onboard LED is turn on by setting digitalWrite to LOW and off by setting digitalWrite to HIGH, reverse of non-pro Arduinos. This arraingment is safer for the board as a way to protect the board LED.)  

## 2. Uploading the classic blink sketch
Let's program the Portenta with the classic blink example to check if the connection to the board works:

-   Copy and paste the following code into a new sketch in your IDE. 

```

#include <ArduinoBLE.h>

BLEService ledService("19b10000-e8f2-537e-4f6c-d104768a1214"); // BLE LED Service

// BLE LED Switch Characteristic - custom 128-bit UUID, read and writable by central
BLEByteCharacteristic switchCharacteristic("19b10000-e8f2-537e-4f6c-d104768a1214", BLERead | BLEWrite);

const int ledPin = LED_BUILTIN; // pin to use for the LED

void setup() {
  Serial.begin(9600);
  //while (!Serial);   // need this gone when disconected from computer

  // set LED pin to output mode
  pinMode(ledPin, OUTPUT);

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("LED-IOT4");
  BLE.setAdvertisedService(ledService);

  // add the characteristic to the service
  ledService.addCharacteristic(switchCharacteristic);

  // add service
  BLE.addService(ledService);

  // set the initial value for the characeristic:
  switchCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();

  Serial.println("BLE LED-Distance-Control");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    // while the central is still connected to peripheral:
    while (central.connected()) {
      // if the remote device wrote to the characteristic,
      // use the value to control the LED:
      if (switchCharacteristic.written()) {
        if (switchCharacteristic.value()) {   // any value other than 0
          Serial.println("LED off");
          digitalWrite(ledPin, HIGH);         // will turn the Portenta LED off, weird
        } else {                             
          Serial.println(F("LED on"));
          digitalWrite(ledPin, LOW);          // will turn the Portenta LED on, weird
        }
      }
    }

    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }
}

```
- Connect your portenta using the "C" usb cable to your computer and double press the reset button so the on-board LED is slowly pulsing green
- Set Tools - Board to Portenta H7 (M7 core)
- Use Tools - Port to find your Portenta
- upload the above file to your Portenta
- Use tools - Port to find out if the Portenta has auto changed ports
- use Tools Serial Monitor to view printout from your device
- On your mobile device load *nrfconnect* or ewquivalent and scan for the BLE connection called "LED..."



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
