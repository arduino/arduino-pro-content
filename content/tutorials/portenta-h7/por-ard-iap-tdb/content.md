# Using the Flash on Portenta H7 - Part 2 - KeyValue Store
In this tutorial, we will learn how to create a flash-optimized KeyValue Store using the flash memory of the microcontroller on the Portenta H7.

## What You Will Learn
This tutorial builds on top of [Part 1](TODO - Add the link to Part 1) and uses the MbedOS [TDBStore API](https://os.mbed.com/docs/mbed-os/v6.4/apis/kvstore.html) to create a [KeyValue Store](https://en.wikipedia.org/wiki/Key%E2%80%93value_database) on the free space of the internal flash of the microcontroller.

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+ or Arduino Pro IDE 0.0.4+ or Arduino CLI 0.13.0+

# Portenta H7 and MbedOS APIs for Flash Storage
The core software of Portenta H7 is based on the MbedOS operating systems, allowing developers to integrate the Arduino API with the APIs exposed by MbedOS.

MbedOS has a rich API for managing storage on different mediums, ranging from the tiny internal flash memory of a microcontroller to large external SecureDigital cards.

In this tutorial, we are going to save a value inside the flash memory, that allows to have that saved after a reset, and we will able to see some info from the Flash block, so we will rely on the [FlashIAPBlockDevice](https://os.mbed.com/docs/mbed-os/v6.4/apis/flashiapblockdevice.html) and the [TDBStore](https://os.mbed.com/docs/mbed-os/v6.4/apis/kvstore.html) APIs. We will use `FlashIAPBlockDevice` to create a block device on the free space of the flash and we will create a KeyValue Store on it using the `TDBStore` API.

***Important!*** The TBStore API will optimize the speed of access, reduce [wearing of the flash](https://en.wikipedia.org/wiki/Flash_memory#Memory_wear) and minimize storage overhead. TBStore is also resilient to power failures. If you want to use the flash memory of the microcontroller, *always prefer the TDBStore approach over a direct access to the FlashIAP block device* described on Part 1.

## 1. The Basic Setup
Begin by plugging in your Portenta board to the computer using a USB-C cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://github.com/bcmi-labs/arduino-pro-content/blob/master/content/tutorials/portenta-h7/por-ard-usb/por-ard-gs) before you proceed.

![The Portenta H7 can be connected to the computer using an appropriate USB-C cable](assets/por_ard_basic_setup.svg?sanitize=true)

## 2. Create the structure of the program
Let's program the Portenta with the following sketch. We will also need a few helper functions defined in a supporting header file. 
* First, create a new sketch called `flashKeyValue.ino` 
* Second, create a new tab called `FlashIAPLimits.h` to split the helper functions.

## 3. Populate the helper functions, flash limits (FlashIAP) Sketch
First lets have the `FlashIAPLimits.h` header with the helper functions
This will get the available Flash limits to alocate the custom data.

   ```cpp
   /**
      Helper functions for calculating limits for the FlashIAP block device
    **/

   #pragma once

   #include <Arduino.h>
   #include <FlashIAP.h>
   #include <FlashIAPBlockDevice.h>

   using namespace mbed;

   // An helper struct for FlashIAP limits
   struct FlashIAPLimits {
     size_t flash_size;
     uint32_t start_address;
     uint32_t aval_size;
   };

   // Get the actual start address and available size for the FlashIAP Block Device
   // considering the space already occupied by the sketch.
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

     auto ret = flash.init();
     if (ret != 0)
       return { };

     // Find the start of first sector after text area
     int sector_size = flash.get_sector_size(FLASHIAP_APP_ROM_END_ADDR);
     start_address = align_up(FLASHIAP_APP_ROM_END_ADDR, sector_size);
     flash_start_address = flash.get_flash_start();
     flash_size = flash.get_flash_size();

     ret = flash.deinit();

     int aval_size = flash_start_address + flash_size - start_address;
     if (aval_size % (sector_size * 2)) {
       aval_size = align_down(aval_size, sector_size * 2);
     }

     return { flash_size, start_address, aval_size };
   }
   ```

## 4. Make the Key Store program
Go to `flashKeyValue.ino` and

start by declaring the libraries that we need from **MBED**, our header helper (`FlashIAPLimits.h`) 

   ```cpp
   #include <FlashIAPBlockDevice.h>
   #include <TDBStore.h>

   using namespace mbed;

   // Get limits of the In Application Program (IAP) flash, ie. the internal MCU flash.
   #include "FlashIAPLimits.h"
   auto iapLimits { getFlashIAPLimits() };

   // Create a block device on the available space of the FlashIAP
   FlashIAPBlockDevice bd(iapLimits.start_address, iapLimits.aval_size);

   // Create a key/value store on the Flash IAP block device
   TDBStore store(&bd);

   // Dummy sketch stats for demonstration purposes
   struct SketchStats {
     uint32_t startupTime;
     uint32_t randomValue;
     uint32_t runCount;
   };
   ```

In the `setup()` at the beginning we will wait to open the Serial port to run the program, and print some info from the FlashIAP block device (`bd`)

   ```cpp
   void setup()
   {
     Serial.begin(115200);
     while (!Serial)
       ;

     //  Wait for terminal to come up
     delay(1000);

     Serial.println("FlashIAPBlockDevice + TDBStore Test");

     // Feed the RNG for later content generation
     srand(micros());

     // Initialize the flash IAP block device and print the memory layout
     bd.init();
     Serial.printf("FlashIAP block device size: %llu\r\n", bd.size());
     Serial.printf("FlashIAP block device read size: %llu\r\n", bd.get_read_size());
     Serial.printf("FlashIAP block device program size: %llu\r\n", bd.get_program_size());
     Serial.printf("FlashIAP block device erase size: %llu\r\n", bd.get_erase_size());
     // Deinitialize the device
     bd.deinit();

   ```
   
After that, initialize TDBstore (our "space"), setting the tag for the store and the value that we will save `runCount` and the previous value (`prevStats`)

   ```cpp
     // Initialize the key/value store
     Serial.print("Initializing TDBStore: ");
     auto ret = store.init();
     Serial.println(ret == MBED_SUCCESS ? "OK" : "KO");
     if (ret != MBED_SUCCESS)
       while (true);

     // An example key name for the stats on the store
     const char statsKey[] { "stats" };

     // Keep track of the number of sketch executions
     uint32_t runCount { 0 };

     // Previous stats
     SketchStats prevStats;
   ```

Now that we have everything ready, lets Get the previous value from the store, and update the store with the new value 

   ```cpp
     // Get previous run stats from the key/value store
     Serial.println("Retrieving Sketch Stats");
     ret = getSketchStats(statsKey, &prevStats);
     if (ret == MBED_SUCCESS) {
       Serial.println("Previous Stats");
       Serial.print("\tStartup Time: ");
       Serial.println(prevStats.startupTime);
       Serial.print("\tRandom Value: ");
       Serial.println(prevStats.randomValue);
       Serial.print("\tRun Count: ");
       Serial.println(prevStats.runCount);

       runCount = prevStats.runCount;

     } else if (ret == MBED_ERROR_ITEM_NOT_FOUND) {
       Serial.println("First execution");
     } else {
       Serial.println("Error reading from key/value store.");
       while (true)
         ;
     }

     // Update the stats...
     SketchStats currStats { millis(), rand(), ++runCount };
     // ... and on save them to the store
     ret = setSketchStats(statsKey, currStats);
     if (ret == MBED_SUCCESS) {
       Serial.println("Sketch Stats updated");
       Serial.println("Current Stats");
       Serial.print("\tStartup Time: ");
       Serial.println(currStats.startupTime);
       Serial.print("\tRandom Value: ");
       Serial.println(currStats.randomValue);
       Serial.print("\tRun Count: ");
       Serial.println(currStats.runCount);
     } else {
       Serial.println("Error storing to key/value store");
       while (true)
         ;
     }
   }
   ```


To finish the program, create `getSketchStats` and `setSketchStats` functions at the bottom of the sketch (after the `setup()` and `loop()`)

   ```cpp

   // Retrieve a SketchStats from the k/v store
   int getSketchStats(const char* key, SketchStats* stats)
   {
     // Retrieve key/value info
     TDBStore::info_t info;
     auto ret = store.get_info(key, &info);
     if (ret == MBED_ERROR_ITEM_NOT_FOUND)
       return ret;

     // Allocate space for the value
     uint8_t buf[info.size] {};
     size_t actual_size;

     // Get the value
     ret = store.get(key, buf, sizeof(buf), &actual_size);
     if (ret != MBED_SUCCESS)
       return ret;

     memcpy(stats, buf, sizeof(SketchStats));
     return ret;
   }

   // Store a SketchStats to the the k/v store
   int setSketchStats(const char* key, SketchStats stats)
   {
     auto ret = store.set(key, reinterpret_cast<uint8_t*>(&stats), sizeof(SketchStats), 0);
     return ret;
   }
   ```

## 5. Results

Upload the sketch and the output should be:
   ```text
   FlashIAPBlockDevice + TDBStore Test
   FlashIAP block device size: 1572864
   FlashIAP block device read size: 1
   FlashIAP block device program size: 32
   FlashIAP block device erase size: 131072
   Initializing TDBStore: OK
   Retrieving Sketch Stats
   Previous Stats
           Startup Time: 12727
           Random Value: 1514801629
           Run Count: 13
   Sketch Stats updated
   Current Stats
           Startup Time: 4285
           Random Value: 2133170025
           Run Count: 14
   ```

**note that the flash memory will be __erased__ by a new sketch __upload__.**

Push the reset button to restart the sketch. The values of the stats have been updated: `Previous Stats` – retrieved from the k/v store – now contains values from the previous execution.


-- Previous --
--------------

Add a new file/tab to the sketch and name it `FlashIAPLimits.h`:

```cpp

/**
 * Helper functions for calculating limits for the FlashIAP block device
 * */

#pragma once

#include <Arduino.h>
#include <FlashIAP.h>
#include <FlashIAPBlockDevice.h>

using namespace mbed;

// An helper struct for FlashIAP limits
struct FlashIAPLimits {
    size_t flash_size;
    uint32_t start_address;
    uint32_t aval_size;
};

// Get the actual start address and available size for the FlashIAP Block Device
// considering the space already occupied by the sketch.
FlashIAPLimits getFlashIAPLimits()
{
    // Alignment lambdas
    auto align_down = [](uint64_t val, uint64_t size) { return (((val) / size)) * size; };
    auto align_up = [](uint32_t val, uint32_t size) { return (((val - 1) / size) + 1) * size; };

    size_t flash_size;
    uint32_t flash_start_address;
    uint32_t start_address;
    FlashIAP flash;

    auto ret = flash.init();
    if (ret != 0)
        return { };

    // Find the start of first sector after text area
    int sector_size = flash.get_sector_size(FLASHIAP_APP_ROM_END_ADDR);
    start_address = align_up(FLASHIAP_APP_ROM_END_ADDR, sector_size);
    flash_start_address = flash.get_flash_start();
    flash_size = flash.get_flash_size();

    ret = flash.deinit();

    int aval_size = flash_start_address + flash_size - start_address;
    if (aval_size % (sector_size * 2)) {
        aval_size = align_down(aval_size, sector_size * 2);
    }

    return { flash_size, start_address, aval_size };
}
```

Compile and upload the sketch on the Portenta H7. Open the Serial Monitor: the sketch will start and will display an output similar to:

```text
FlashIAPBlockDevice + TDBStore Test
FlashIAP block device size: 1572864
FlashIAP block device read size: 1
FlashIAP block device program size: 32
FlashIAP block device erase size: 131072
Initializing TDBStore: OK
Retrieving Sketch Stats
Previous Stats
        Startup Time: 12727
        Random Value: 1514801629
        Run Count: 13
Sketch Stats updated
Current Stats
        Startup Time: 4285
        Random Value: 2133170025
        Run Count: 14
```

`Previous Stats` displays the value for the stats already stored on the flash while `Current Stats` displays the values of the updated stats.

Push the reset button to restart the sketch. The values of the stats have been updated: `Previous Stats` – retrieved from the k/v store – now contains values from the previous execution.

***Please***, note that the flash memory will be __erased__ by a new sketch __upload__.

## Code Walkthrough

The FlashIAP KeyValue sketch starts with the definition of the limits of the FlashIAP block device:

```cpp
#include "FlashIAPLimits.h"
auto iapLimits { getFlashIAPLimits() };
```

Those limits are calculated by the functions defined in the `FlashIAPLimits.h` header. The `getFlashIAPLimits()` function takes care of not overwriting data already stored on the flash and aligns the start address and stop address with the size of the flash sector.

We use the FlashIAP limits to create a block device and a `TDBStore` on top of it

```cpp
FlashIAPBlockDevice bd(iapLimits.start_address, iapLimits.aval_size);
TDBStore store(&bd);
```

We initialize the `store` object in `setup()`:

```cpp
    auto ret = store.init();
```

and then use it to do operations with data.

### Getting values from the K/V Store

The `getSketchStats(const char* key, SketchStats* stats)` function tries to retrieve the stats values stored in the key `key` and returns it via the `stats` parameter.

Before getting the values from the store, we collect a few information about the key:

```cpp
    TDBStore::info_t info;
    auto ret = store.get_info(key, &info);
```

We use the info to allocate the space for the data buffer and retrieve it:

```cpp
    uint8_t buf[info.size] {};
    size_t actual_size;

    ret = store.get(key, buf, sizeof(buf), &actual_size);
```

Our `SketchStats` data struct is very simple and has a fixed size: we can de-serialize/unmarshall the buffer with a simple copy. YMMV.

```cpp
    memcpy(stats, buf, sizeof(SketchStats));
```

### Setting values to the K/V Store

The `setSketchStats(const char* key, SketchStats stats)` will store `stats` to the key `key`. The key will be created or updated accordingly.

```cpp
    auto ret = store.set(key, reinterpret_cast<uint8_t*>(&stats), sizeof(SketchStats), 0);
```         

# Conclusion and Caveats
We have learned how to use the space still available on the flash memory of the microcontroller to create a KeyValue Store and use it to retrieve and store data.
It's not recommended to use the flash of the microcontroller as the primary storage for data-intensive applications: it is best suited for once-in-time read/write operations such as storing and retrieving application configurations or persistent parameters.

# Next Steps
- Learn how to retrieve a collection of keys using TDBStore iterators via [`iterator_open`](https://os.mbed.com/docs/mbed-os/v6.4/mbed-os-api-doxy/classmbed_1_1_k_v_store.html#a77661adec54b9909816e7492a2c61a91) and [`iterator_next`](https://os.mbed.com/docs/mbed-os/v6.4/mbed-os-api-doxy/classmbed_1_1_k_v_store.html#a5116b40a3480462b88dc3f1bb8583ad4)
- Learn how to create an incremental TDBStore set sequence via [`set_start`](https://os.mbed.com/docs/mbed-os/v6.4/mbed-os-api-doxy/classmbed_1_1_k_v_store.html#a6e882a0d4e0cbadf6269142ac3c4e693), [`set_add_data`](https://os.mbed.com/docs/mbed-os/v6.4/mbed-os-api-doxy/classmbed_1_1_k_v_store.html#adbe636bf8c05834fe68b281fc638c348) and [`set_finalize`](https://os.mbed.com/docs/mbed-os/v6.4/mbed-os-api-doxy/classmbed_1_1_k_v_store.html#a346da66252added46d3b93902066b548)
- Learn how to use the 16MB QSPI Flash on the Portenta H7 (TODO - Upcoming Tutorial)

# Troubleshooting
## Sketch Upload Troubleshooting
If trying to upload a sketch but you receive an error message, saying that the upload has failed you can try to upload the sketch while the Portenta H7 is in bootloader mode. To do so you need to double click the reset button. The green LED will start fading in and out. Try to upload the sketch again. The green LED will stop fading when the upload completes.

**Authors:** Giampaolo Mancini
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
