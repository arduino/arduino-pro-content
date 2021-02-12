# Reading and Writing Data on the Flash Memory 
This tutorial shows you how to use the internal flash memory of the Portenta H7's MCU to read and write data using the Flash In-Application Programming Interface (Flash IAP) provided by Mbed OS. 

***This tutorial is also applicable for other Mbed OS based Arduino boards like the Nano 33 BLEs***

## What You Will Learn
-   Accessing the Portenta's flash memory using Mbed's Flash In-Application Programming Interface 
-   Reading and writing data from and to the flash memory
-   Calculating the memory's free storage space

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+ or Arduino Pro IDE 0.0.4+ or Arduino CLI 0.13.0+

# Mbed OS APIs for Flash Storage
Portenta's core is based upon the Mbed operating system, allowing for Arduino APIs to be integrated using APIs exposed directly by Mbed OS. 

Mbed OS has a rich API for managing storage on different mediums, ranging from the small internal flash memory of a microcontroller to external SecureDigital cards with large data storage space.

In this tutorial, we are going to save a value persistently inside the flash memory. That allows to access that value even after resetting or rebooting the board. We will retrieve some information from a flash block by using the [FlashIAPBlockDevice](https://os.mbed.com/docs/mbed-os/v6.4/apis/flashiapblockdevice.html) API and create a block device object within the awailable space of the memory (the memory space which is left after uploading a sketch to the Portenta).

***Important: Be aware of the flash r/w limits while using raw/direct access: flash memories have a limited amount of write cycles. Typical flash memories can perform about 10000 writes cycles to the same block before starting to "wear out" and begin to lose the ability to retain data. You can actually render your board useless with improper use of this example and described APIs.***

## 1. The Basic Setup
Begin by plugging in your Portenta board to the computer using a USB-C cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://github.com/bcmi-labs/arduino-pro-content/blob/master/content/tutorials/portenta-h7/por-ard-usb/por-ard-gs) before you proceed.

## 2. Create the Structure of the Program
Before we start it's important to keep above mentioned **flash r/w limits** in mind! Therefore this method should only be used for **once-in-a-time** read and write **operations** such as reading a user setting in the `setup()`. It is not a good idea to use it for constantly updated values such as e.g. sensor data.

Having this in mind, it's time to create a sketch to program the Portenta. After creating new sketch and giving it a fitting name (in our case `FlashStorage.ino`) we need to create one more file within the sketch, called `FlashIAPLimits.h`, that we will use to define some helper functions. This allows us to resuse the helper file later for other sketches.

## 3. The Helper Functions
Within the `FlashIAPLimits.h` file we start by including necessary libraries and defining the namespace. 

```cpp
// Ensures that this file is only included once
#pragma once 

#include <Arduino.h>
#include <FlashIAP.h>
#include <FlashIAPBlockDevice.h>

using namespace mbed;
```

After that we create a struct which will later be used to save the storage's properties.

```cpp
// An helper struct for FlashIAP limits
struct FlashIAPLimits {
  size_t flash_size;
  uint32_t start_address;
  uint32_t aval_size;
};
```

The last part of the helper file consists of the `getFlashIAPLimits()` function used to calculate both the size of the flash memory as well as the size and start address of the available memory.
This is done with the use of Mbed's [FlashIAP](https://os.mbed.com/docs/mbed-os/v6.6/mbed-os-api-doxy/classmbed_1_1_flash_i_a_p.html) API. Starting by finding the address of the first sector after the sketch code stored on the microcontroller's ROM: `FLASHIAP_APP_ROM_END_ADDR` and using the FlashIAP to calculate the flash memory's size `flash.get_flash_size()`, the `flash_size`, `start_address` and `available_size`can be determined.

```cpp
// Get the actual start address and available size for the FlashIAP Block Device
// considering the space already occupied by the sketch (firmware).
FlashIAPLimits getFlashIAPLimits()
{
  // Alignment lambdas
  auto align_down = [](uint64_t val, uint64_t size) {
    return (((val) / size)) * size;
  };
  auto align_up = [](uint32_t val, uint32_t size) {
    return (((val - 1) / size) + 1) * size;
  };

  size_t flash_size;
  uint32_t flash_start_address;
  uint32_t start_address;
  FlashIAP flash;

  auto result = flash.init();
  if (result != 0)
    return { };

  // Find the start of first sector after text area
  int sector_size = flash.get_sector_size(FLASHIAP_APP_ROM_END_ADDR);
  start_address = align_up(FLASHIAP_APP_ROM_END_ADDR, sector_size);
  flash_start_address = flash.get_flash_start();
  flash_size = flash.get_flash_size();

  result = flash.deinit();

  int available_size = flash_start_address + flash_size - start_address;
  if (available_size % (sector_size * 2)) {
    available_size = align_down(available_size, sector_size * 2);
  }

  return { flash_size, start_address, available_size };
}
```

## 4. Reading & Writing Flash Memory
Going back to the `FlashStorage.ino` file some more libraries need to be included in order to implement reading add writing to the flash. The `FlashIAPBlockDevice.h` library will be used to create a block device on the empty part of the memory. Additionally we include the helper file `FlashIAPLimits.h` to have access to the address and size calculation function that we just created and set the namespace to `mbed`.

```cpp
#include <FlashIAPBlockDevice.h>
#include "FlashIAPLimits.h"

using namespace mbed;
```

The `setup()` function will first wait until a serial connection is established and then feed the random number generator, which is used later in this tutorial to write a random number in the flash memory every time the device boots up.

```cpp
void setup()
{
  Serial.begin(115200);
  while (!Serial);

  //  Wait for terminal to come up
  delay(1000);

  Serial.println("FlashIAPBlockDevice Test");

  // Feed the random number generator for later content generation
  srand(micros());
```

Next the helper function, defined in the `FlashIAPLimits.h` file, is called to calculate the memory properties that are then used to create a block device using the `FlashIAPBlockDevice.h` library.

```cpp
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
```

Before using the block device the first step is to initialize it using `blockDevice.init()`. Once initialized it can give a more detailed view on the device's memory layout and size. In in terms of reading and writing flash memory blocks there is a distinction between the size of a readable block in bytes, a programmable block, which size is always a multiple of the read size and an erasable block which is always a multiple of a programmable block.

When reading and writing directly from and to the flash memory we therefore need to always **allocate an erase size wide storage**: `blockDevice.get_erase_size()`. So is has the buffer the size of the block device's erasable blocks.

```cpp
// Initialize the Flash IAP block device and print the memory layout
blockDevice.init();
Serial.printf("Flash block device size: %llu\n", blockDevice.size());
Serial.printf("Flash block device read size: %llu\n", blockDevice.get_read_size());
Serial.printf("Flash block device program size: %llu\n", blockDevice.get_program_size());
Serial.printf("Flash block device erase size: %llu\n", blockDevice.get_erase_size());

const size_t size { blockDevice.get_erase_size() };
Serial.printf("TEST: %llu",size);
char buffer[size] {};
```

In the last part of the `setup()` function we can now use the block device to read and write data. First the buffer is used to read what was stored within the previous execution, then the block device gets erased and reprogrammed with the new content. At the end of the reading and writing process the block device needs to be deinitalized again using `blockDevice.deinit()`.

```cpp
// Read back what was stored at previous execution
blockDevice.read(buffer, 0, size);
Serial.printf("%s\n", buffer);

// Write an updated message to the first block
sprintf(buffer, "Hello World @ %d!\n", rand());
blockDevice.erase(0, size);
blockDevice.program(buffer, 0, size);

// Deinitialize the device
blockDevice.deinit();
```

Finally the `loop()` function of this sketch will be left empty, considering that the flash reading and writing process should only be carried out once.

## 5. Upload the Sketch 
Below is the complete sketch of this tutorial consisting of the main sketch and the `FlashIAPLimits.h` helper file, upload both of them to your Portenta H7 to try it out.

### FlashIAPLimits.h
```cpp
/**
Helper functions for calculating FlashIAP block device limits
**/

// Ensures that this file is only included once
#pragma once 

#include <Arduino.h>
#include <FlashIAP.h>
#include <FlashIAPBlockDevice.h>

using namespace mbed;

// A helper struct for FlashIAP limits
struct FlashIAPLimits {
  size_t flash_size;
  uint32_t start_address;
  uint32_t available_size;
};

// Get the actual start address and available size for the FlashIAP Block Device
// considering the space already occupied by the sketch (firmware).
FlashIAPLimits getFlashIAPLimits()
{
  // Alignment lambdas
  auto align_down = [](uint64_t val, uint64_t size) {
    return (((val) / size)) * size;
  };
  auto align_up = [](uint32_t val, uint32_t size) {
    return (((val - 1) / size) + 1) * size;
  };

  size_t flash_size;
  uint32_t flash_start_address;
  uint32_t start_address;
  FlashIAP flash;

  auto result = flash.init();
  if (result != 0)
    return { };

  // Find the start of first sector after text area
  int sector_size = flash.get_sector_size(FLASHIAP_APP_ROM_END_ADDR);
  start_address = align_up(FLASHIAP_APP_ROM_END_ADDR, sector_size);
  flash_start_address = flash.get_flash_start();
  flash_size = flash.get_flash_size();

  result = flash.deinit();

  int available_size = flash_start_address + flash_size - start_address;
  if (available_size % (sector_size * 2)) {
    available_size = align_down(available_size, sector_size * 2);
  }

  return { flash_size, start_address, available_size };
}
```

### FlashStorage.ino
```cpp
#include <FlashIAPBlockDevice.h>
#include "FlashIAPLimits.h"

using namespace mbed;

void setup()
{
  Serial.begin(115200);
  while (!Serial);

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
  Serial.printf("TEST: %llu",size);
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

void loop() {}
```

## 5. Results
After uploading the sketch open the serial monitor to start the flash reading and writing process. The first time you start the script the block device will be filled randomly. Now try to reset or disconnect the Portenta and reconnect it again. You should see *Hello World* string with the random number written to the flash storage on the previous execution.

***Note that the value written to the flash storage will persist if the board is reseted or disconnected, however the entire flash storage will be reprogrammed once a new sketch is uploaded to the Portenta.***

# Conclusion and Caveats
We have learned how to use the available space in the flash memory of the microcontroller to read and save additional data. It's not recommended to use the flash of the microcontroller as the primary storage for data-intensive applications. It is best suited for read/write operations that are performed only once in a while such as storing and retrieving application configurations or persistent parameters.

# Next Steps
Now that you know how to use block device to perform reading and writing on a flash memory you can look into the [next tutorial](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-kvs) on how to use the [TDBStore API](https://os.mbed.com/docs/mbed-os/v6.4/apis/kvstore.html) to create a [key value store](https://en.wikipedia.org/wiki/Key%E2%80%93value_database) to create a key-value store on the flash memory.



**Authors:** Giampaolo Mancini  
**Reviewed by:** Lenard George, Jose Garcia [28.01.2021]  
**Last revision:** Manuel Zomer [11.02.2021]