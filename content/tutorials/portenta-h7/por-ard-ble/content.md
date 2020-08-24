# BLE on the Portenta H7 For Arduino
In this tutorial we will enable low energy bluetooth (BLE) on the Portenta H7 to allow an external bluetooth device to control the on-board LED either by turning it on or off. 

![por_ard_ble_cover_image](assets/por_ard_ble_cover.svg?sanitize=true)

## What you will learn

-   Enabling the BLE on the Protenta H7.
-   Connecting the Portenta to an external BLE Mobile Application (In this case [nrfconnect](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile) by Nordic Semiconductor).

## Required hardware and software

-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.13+  or Arduino Pro IDE 0.0.4+ 
-   [nRFconnect](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile) or equivalent tool downloaded on your mobile device
    -   [nrfconnect for iOS](https://itunes.apple.com/us/app/nrf-connect/id1054362403?ls=1&mt=8) or [nrfconnect for android](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp)

# Portenta and Low Energy Bluetooth (BLE) 
The wifi/bluetooth module on board the H7 offers a low energy bluetooth module that gives the board the flexibility to be connected to devices with strict power consumptions. Compared to Classic Bluetooth, Low Energy Bluetooth is intended to provide considerably reduced power consumption and cost while maintaining a similar communication range. This helps in rapid integration to final solution.  

https://www.bluetooth.com/specifications/gatt/characteristics/)

![por_ard_ble_low_energy_BLE]()


# Configuring the Development Environment
To communicate with the Portenta H7 via bluetooth, we are going to start by uploading a pre-built sketch that starts a bluetooth network and connects to your mobile device which will be used to control the LEDs. The sketch uses the [ArduinoBLE](https://www.arduino.cc/en/Reference/ArduinoBLE) Library that enables the BLE module and handles important functions such as scan, connect and interact with servics provided by other devices. You will also be using a third party application, [nRFconnect](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-mobile)  running on your mobile device that will connect your device to the board and help you control the on board LED.

![por_ard_ble_configuration](assets/por_ard_ble_configuration.svg?sanitize=true)

*** NOTE :- //suggest some other BLE Scanning tools  *** 

## 1. The basic setup

Begin by plugging in your Portenta board to the computer using a USB-C cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://github.com/bcmi-labs/arduino-pro-content/blob/master/content/tutorials/portenta-h7/por-ard-usb/por-ard-gs) before you proceed.

![por_ard_ble_basic_setup](../por-ard-gs/assets/por_ard_gs_basic_setup.svg?sanitize=true)

## 2. Install the ArduinoBLE library 

You will need to install the ArduinoBLE library on your Arduino IDE you are using. For this example we will use the Regular Arduino IDE. To install the library go to : **File -> Manage Libarary ->** type **ArduinoBLE**  and click **Install**.

![por_ard_ble_basic_setup](assets/por_ard_ble_arduino_library.png?sanitize=true)



## 3. Add the BLE sketch

Let's program the Portenta with the classic blink example to check if the connection to the board works. Copy and paste the following code into a new sketch in your IDE. 

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
  BLE.setLocalName("LED-Portenta-01");
  BLE.setAdvertisedService(ledService);

  // add the characteristic to the service
  ledService.addCharacteristic(switchCharacteristic);

  // add service
  BLE.addService(ledService);

  // set the initial value for the characeristic:
  switchCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();
  digitalWrite(ledPin, LOW);
  delay(1000);
  digitalWrite(ledPin, HIGH);
  Serial.println("BLE LED-Distance-Control");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());;
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
    delay(100);
    digitalWrite(ledPin, HIGH);

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
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
    delay(100);
    digitalWrite(ledPin, HIGH);
  }
}

```

In our example we use a pre-defined bluetooth number code pre-setup for controlling a devices LED's. This code can also be referred to as [GATT codes](https://www.bluetooth.com/specifications/gatt/services/), which defines how two bluetooth low energy devices tranfer data. Once a connection is established with a device, its respecitve GATT code, which is a 16 bit ID, is stored in a lookup table for future reference. 

```BLEService ledService("19b10000-e8f2-537e-4f6c-d104768a1214"); // BLE LED Service```

These GATT codes are very long, but in our example it is always the same code. 

*** NOTE :- Reminder that on the Portenta the onboard LED is turn on by setting digitalWrite to LOW and off by setting digitalWrite to HIGH, reverse of non-pro Arduinos. This arraingment is safer for the board as a way to protect the board LED. ***  

## 4. Upload the sketch 

Double press the reset button so the on-board LED is slowly pulsing green. Then, select your board from **Tools** ->  **Board** -> **Arduino Portenta H7 (M7 core)** 
 ![por_ard_usb_select_board_h7](assets/por_ard_usb_select_board_h7.png)

Then choose the **Port** and **Upload** the file to your Portenta board. Open the Serial Monitor once you've **uploaded** the code to the board. 

![por_ard_usb_select_port](assets/por_ard_usb_select_port.png)

## 5. Connect an external device

Once you have downloaded the nRF application on your mobile device, and look for your portenta 

- On your mobile device load *nrfconnect* or ewuivalent and scan for the BLE connection called "LED..."
- connect with the device, find the 2 way communication tabs and type either "00" or "01" to turn the LED on or off

# Conclusion
If all went well you have proved that you can connect your Portenta with your cell phone and have some communication abilities between the two devices  

# Next Steps  

-   NEXT STEPS
-   Using two Portenta's (or other BLE capable Arduino devices)
-   Upload a program to a Portenta to control the LED's on mulitple BLE devices (The BLE device local name must include "LED")

-   Now if you have a second Portenta or BLE capable device such as the Arduino Nano 33 IOT or Nano 33 BLE or Nano 33 BLE Sense and a few other boards you can use your Portenta to flash the LED's on mulitple BLE devices. Load the above code on several devices and use nrfconnect to check that they are working.
- Look for this line in your code and change the name slightly for each device. It must still contain the word "LED" as the next program scans for that word
```
// set advertised local name and service UUID:
BLE.setLocalName("LED-Portenta-01");
```

- Check using nrfconnect that the above devices show up with different names.
- on your portenta load the following code

```
#include <ArduinoBLE.h>

// variables for button

void setup() {
  pinMode(LEDB, OUTPUT);
  Serial.begin(9600);
 // while (!Serial);  //This is not useful when it is self powered

  // initialize the BLE hardware
  BLE.begin();
  Serial.println("BLE Central - LED control");

  // start scanning for LED BLE peripherals
  BLE.scanForUuid("19b10000-e8f2-537e-4f6c-d104768a1214");
}

void loop() {
  // check if a peripheral has been discovered
  BLEDevice peripheral = BLE.available();

  if (peripheral) {
    // discovered a peripheral, print out address, local name, and advertised service
    Serial.print("Found ");
    Serial.print(peripheral.address());
    Serial.print(" '");
    Serial.print(peripheral.localName());
    Serial.print("' ");
    Serial.print(peripheral.advertisedServiceUuid());
    Serial.println();

    if (peripheral.localName().indexOf("LED") < 0) {
          Serial.println("No 'LED' in name");
      return;  // If the name doeshn't have "LED" in it then ignore it
    }

    // stop scanning
    BLE.stopScan();

    controlLed(peripheral);

    // peripheral disconnected, start scanning again
    BLE.scanForUuid("19b10000-e8f2-537e-4f6c-d104768a1214");
  }
}

void controlLed(BLEDevice peripheral) {
  // connect to the peripheral
  Serial.println("Connecting ...");

  if (peripheral.connect()) {
    Serial.println("Connected");
  } else {
    Serial.println("Failed to connect!");
    return;
  }

  // discover peripheral attributes
  Serial.println("Discovering attributes ...");
  if (peripheral.discoverAttributes()) {
    Serial.println("Attributes discovered");
  } else {
    Serial.println("Attribute discovery failed!");
    peripheral.disconnect();
    return;
  }

  // retrieve the LED characteristic
  //BLECharacteristic ledCharacteristic = peripheral.characteristic("19b10001-e8f2-537e-4f6c-d104768a1214");  //weird this broke it
  BLECharacteristic ledCharacteristic = peripheral.characteristic("19b10000-e8f2-537e-4f6c-d104768a1214"); 
                                                                 

  if (!ledCharacteristic) {
    Serial.println("Peripheral does not have LED characteristic!");
    peripheral.disconnect();
    return;
  } else if (!ledCharacteristic.canWrite()) {
    Serial.println("Peripheral does not have a writable LED characteristic!");
    peripheral.disconnect();
    return;
  }

  while (peripheral.connected()) {
    // while the peripheral is connected
        
        digitalWrite(LEDB, LOW); //weird turns blue on
        Serial.println("flashing the LED on the device");
        ledCharacteristic.writeValue((byte)0x01);
        delay(500);
        ledCharacteristic.writeValue((byte)0x00);
        delay(500);        
        ledCharacteristic.writeValue((byte)0x01);
        delay(500);
        ledCharacteristic.writeValue((byte)0x00);
        delay(500);
        
        peripheral.disconnect();       
       digitalWrite(LEDB, HIGH); // weird turns blue off
    
  }

  Serial.println("Peripheral disconnected");
}

```
- upload the above code to your Portenta
- open the tools --> serial monitor (note you may have to search for the PORT)
- watch the serial ouput as the Portenta finds the BLE devices and flashes their on-board LED's
- Physicially watch the devices. When the Portenta on-board LED flashes blue it has found another device and that devices on-board LED should flash.


# Troubleshooting
## Sketch Upload Troubleshooting
If trying to upload a sketch but you receive an error message, saying that the upload has failed you can try to upload the sketch while the Portenta H7 is in bootloader mode. To do so you need to double click the reset button. The green LED will start fading in and out. Try to upload the sketch again. The green LED will stop fading when the upload completes.

**Authors:** Jeremy Ellis, YY
**Reviewed by:** Lenard George [20.08.2020]  
**Last revision:** AA [27.3.2020]