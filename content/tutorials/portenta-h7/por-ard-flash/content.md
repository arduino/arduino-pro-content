# Reading and Writing data on the Flash Memory 

## Overview 

This tutorial shows you how to use the internal flash memory of the Portenta H7's MCU to read and write data using the Flash In-Application Programming Interface provide by MBED OS. 

[note]

Note :- This tutorial is also applicable for other MbedOS-based Arduino board like the Nano 33 BLEs 

[/note]

### You Will Learn

-   How to use the Flash In-Application Programming Interface 
-   How to calculate the size of the flash memory 
-   How to use the Flash In-Application Programming Interface 
-   To calulate the size of the flash memory 
### Required Hardware and Software

-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 

## Instructions 

Please, be aware of the **flash r/w limits** while using raw/direct access: flash memories have a limited amount of write cycles. Typical flash memories can perform about 10000 writes cycles to the same block before starting to "wear out" and begin to lose the ability to retain data. **You can actually render your board useless with improper use of this example and described APIs.**

For this tutorial we will be using the Block device example thats and building on top of that. 
The sketch contains a basic working example of Creating a block device and writing datat 

[note]

Note: **Limit** the usage of FlashIAP block devices to **once-in-a-time** read and write **operations**. For example you could read user settings for your device in the setup() function when the device starts and update them whenever they are changed by the user. Contrary to that, it's not advisable to constantly write e.g. the latest value of a sensor into the flash.

[/note]

### 1. The Basic Setup

Begin by plugging in your Portenta board to the computer using a USB-C  cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you  check out how to [set up the Portenta H7 for Arduino](por-ard-gs) before you proceed.

![The Portenta H7 can be connected to the computer using an appropriate USB-C cable](assets/por_ard_usbh_basic_setup.svg)

### 2. Overview of the BlockDevice Example

Go to File > Examples > Block Storage and open the `FlashStorage_MbedOS.ino` sketch. This sketch has three important areas that you need to have an understanding of. 

In this sketch a block device is created using the calculated limits. A block device is a storage device that supports reading and writing data in fixed blocks.

```cpp 
FlashIAPBlockDevice blockDevice(iapLimits.start_address, iapLimits.available_size);
```

Initialize the block device before reading or write data. Remember to always **allocate** a **flash-erase-size-wide** storage area to read and write data from the flash: Don't forget to **erase** the flash block **before** being able to **program** it with your data, i.e. to write data on it (that's the way flash memories work) 

```c++
   // Initialize the flash IAP block device and print the memory layout
    blockDevice.init();
    Serial.printf("FlashIAP block device size: %llu\r\n", blockDevice.size());
    Serial.printf("FlashIAP block device read size: %llu\r\n", blockDevice.get_read_size());
    Serial.printf("FlashIAP block device program size: %llu\r\n", blockDevice.get_program_size());
    Serial.printf("FlashIAP block device erase size: %llu\r\n", blockDevice.get_erase_size());
    // Deinitialize the device
    blockDevice.deinit();
```

[note]

Note : Please, remember that **the data stored** on the flash memory will be **erased** at every **sketch upload** and will only be **retained** through successive sketch executions, e.g. after **power cycling** or **resetting** the board.

[/note]

The key value ![TDBstore]()is used to create a key-value store over the block device. The value is created by first initialising the store were it will check for data integrity on initialising and prints if its good to go. We will use this key-value store to hold the information we will be reading and writing 

```cpp
    // Initialize the key/value store
    Serial.print("Initializing TDBStore: ");
    auto result = store.init();
    Serial.println(result == MBED_SUCCESS ? "OK" : "KO");
    if (result != MBED_SUCCESS)
        while (true);
```

Reading the key value store

```cpp
// Retrieve a SketchStats from the k/v store
int getSketchStats(const char* key, SketchStats* stats)
{
    // Retrieve key/value info
    TDBStore::info_t info;
    auto result = store.get_info(key, &info);
    if (result == MBED_ERROR_ITEM_NOT_FOUND)
        return result;

    // Allocate space for the value
    uint8_t buffer[info.size] {};
    size_t actual_size;

    // Get the value
    result = store.get(key, buffer, sizeof(buffer), &actual_size);
    if (result != MBED_SUCCESS)
        return result;

    memcpy(stats, buffer, sizeof(SketchStats));
    return result;
}
```

Writing the updated value 

```cpp
int setSketchStats(const char* key, SketchStats stats)
{
    auto result = store.set(key, reinterpret_cast<uint8_t*>(&stats), sizeof(SketchStats), 0);
    return result;
}
```

### 3. Add another Key Value Store  



Heres the complete sketch of the tutorial after 

```c++
/**
 * A minimal example to demonstrate the use of the MCU's internal flash memory for
 * the Arduino boards based on MbedOS (Portenta H7, Nano 33 BLEs).
 * 
 * The sketch uses the Flash In Application Programming API to create a block device
 * on the space still available on the flash.
 * 
 * WARNING! Please, always be aware of the r/w limits while using raw/direct access to the flash.
 * 
 * Read more about the MbedOS' Flash In Application Programming API at
 * https://os.mbed.com/docs/mbed-os/v6.4/apis/flash-iap.html
 * 
**/
 
#include "FlashIAPLimits.h"
#include <FlashIAPBlockDevice.h>

using namespace mbed;

void setup()
{
  Serial.begin(115200);
  while (!Serial)
    ;

  //  Wait for terminal to come up
  delay(1000);

  Serial.println("FlashIAPBlockDevice Test");

  // Feed the random number generator for later content generation
  srand(micros());

  // Get limits of the the internal flash of the microcontroller
  auto [flash_size, start_address, iap_size] = getFlashIAPLimits();

  Serial.print("Flash Size: ");
  Serial.println(flash_size);
  Serial.print("FlashIAP Start Address: 0x");
  Serial.println(start_address, HEX);
  Serial.print("FlashIAP Size: ");
  Serial.println(iap_size);

  // Create a block device on the available space of the flash
  FlashIAPBlockDevice blockDevice(start_address, iap_size);

  // Initialize the Flash IAP block device and print the memory layout
  blockDevice.init();
  Serial.printf("Flash block device size: %llu\n", blockDevice.size());
  Serial.printf("Flash block device read size: %llu\n", blockDevice.get_read_size());
  Serial.printf("Flash block device program size: %llu\n", blockDevice.get_program_size());
  Serial.printf("Flash block device erase size: %llu\n", blockDevice.get_erase_size());

  const size_t size { blockDevice.get_erase_size() };
  char buffer[size] {};

  // Read back what was stored at previous execution
  blockDevice.read(buffer, 0, size);
  Serial.printf("%s\n", buffer);

  // Write an updated message to the first block
  sprintf(buffer, "Hello World @ %d!\n", rand());
  blockDevice.erase(0, size);
  blockDevice.program(buffer, 0, size);

  // Deinitialize the device
  blockDevice.deinit();
}

void loop(){}


```

### 4. Upload the Sketch 

## Conclusion

**Authors:** Giampaolo Mancini  
**Reviewed by:** Lenard [20.12.2020]  
**Last revision:** Jose Garcia [28.01.2021]