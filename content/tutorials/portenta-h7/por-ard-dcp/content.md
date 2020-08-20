# Dual Core Processing
The Portenta H7 is equipped with a processor that has two processing units called cores. Dual core processing is the ability of a processor to read and execute instructions in two different cores simultaneously. In other words, a dual core processor can execute two applications, in this case two Arduino sketches, at the same time. In this tutorial you will run two classic Arduino blink programs simultaneously on different cores of the Portenta board that blinks the RGB LED in two different colours.

## What You Will Learn
-   How to upload and run applications on Portenta's M7 and M4 cores.
-   About the characteristics of the M7 and the M4 cores.
-   How to force bootForce booting the M4 core through the M7 core and why that is necessary.
-   Controlling the colours of the built-in RGB LED. 

## Required Hardware and Software
-   Portenta H7 board 
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+ or Arduino Pro IDE 0.0.4+ 

# Cortex® M7 & M4 
Processor cores are individual processing units within the board's main processing unit (don't confuse a processor core with an [Arduino core](https://www.arduino.cc/en/guide/cores)). These cores are responsible for the executing instructions at a particular clock speed.  The on-board  Arm Cortex processor comes with two cores (Cortex® M7 and M4), with slightly different architectures and clock speeds. The M7  runs at 480 MHz and the architecture is designed  to separate Instruction and Data buses to optimize CPU latency. The M4 runs at 240 MHz and the architecture supports the ART™ accelerator (a block that speeds up instruction fetching accesses of the Cortex-M4 core to the D1-domain internal memories). The higher clock rate of the M7 makes it suitable to handle complex processing tasks such as data storage, debugging or handling input/output peripherals at a higher efficiency compared to the M4. The dual core processor of the Portenta H7 sets it apart from other single core Arduino boards by allowing true multitasking, faster data processing capabilities, enhanced processing power and application partitioning.  

![The Architectures of Cortex® M7 and M4 cores.](assets/por_ard_dcp_m4_m7_architectures.svg?sanitize=true)

# Accessing the M7 and M4 Core

To best illustrate the idea of dual core processing, you will be running two separate sketch files. One on each of the cores which blinks the RGB LED in a different colour. The **blink_RedLed_m7.ino** sketch will set the built-in RGB LED on the board to red and blink it with a delay of 500 ms. The **blink_GreenLed_M4.ino** sketch will access the green LED in the RGB led and blink it with a delay of 200 ms.  Both the cores will be executing the corresponding sketch file simultaneously and as a result both the green and red LED blink, however, at different intervals.

![Running two different sketch files on the different cores.](assets/por_ard_dcp_tutorial_overview.svg?sanitize=true)

## 1. The Basic Setup
Begin by plugging-in your Portenta board to your computer using an appropriate USB-C cable and have the  Arduino IDE or the Arduino Pro IDE  open. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://arduino.cc/pro/tutorials/portenta-h7) before you proceed.

![A Basic setup of the board attached to your computer](../por-ard-gs/assets/por_ard_gs_basic_setup.svg?sanitize=true)

## 2. Setting the LED Color 
In the previous tutorial you learned how to access the built-in RGB LED through the macro definition LED_BUILTIN. You can also control the distinct Red, Green and Blue LED separately through the LEDR, LEDG and LEDB  macro definition respectively. 

Please note that, opposed to other Arduino boards, on the Portenta H7 the built-in RGB led pins need to be pulled to ground to make the LED light up. This means that a voltage level of LOW will turn the LED on, a voltage level of HIGH will turn it off.

The following sketch blinks the red LED at an interval of 200ms controlled by the M7 core.Save your sketch as **blink_RedLed_m7** and compile your sketch file.

```cpp
// the setup function runs once when you press reset or power the board
void setup() {
    // initialize digital pin LEDR as an output.
    pinMode(LEDR, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
   digitalWrite(LEDR, LOW); // turn the red LED on (LOW is the voltage level)
   delay(200); // wait for 200 milliseconds
   digitalWrite(LEDR, HIGH); // turn the LED off by making the voltage HIGH
   delay(200); // wait for 200 milliseconds
}
```

## 3. Upload the Sketch to the M7 Core 
Select the **Arduino Portenta H7 (M7 core)** from the **Board** menu and the port the Portenta is connected to (e.g. /dev/cu.usbmodem141101). Upload the **blink_RedLed_m7.ino** sketch. Doing so will automatically compile the sketch beforehand. When the sketch is uploaded  the RGB LED on the board will start blinking red.

![Uploading the blink_RedLed_m7 sketch to the M7 core](assets/por_ard_dcp_upload_code_m7.png)

## 4. Making the LED Blink Green
Let's write another sketch that makes the RGB LED on the board blink green. Open a new sketch file and call it **blink_GreenLed_M4.ino**. Copy and paste the following program that blinks the LED green, denoted by the variable `LEDG`,  with a delay of 500ms. This time the blinking is controlled by the M4 core.

```cpp
// the setup function runs once when you press reset or power the board
void setup() {
    // initialize digital pin LED_BUILTIN as an output.
    pinMode(LEDG, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
   digitalWrite(LEDG, LOW); // turn the LED on (LOW is the voltage level)
   delay(500); // wait for half a second
   digitalWrite(LEDG, HIGH); // turn the LED off by making the voltage HIGH
   delay(500); // wait for half a second
}
```

If you would upload the sketch to the M4 at this point nothing would change. The reason is that the M4 core doesn't start up by itself. There is one more step required to make the M4 core blink the LED green: Force booting the M4.

## 5. Force Booting the M4 core
The bootloader of the H7 boards is configured in such a way that only M7 gets booted automatically. The reason is that for simple use cases the M4 may not be needed and hence be unprogrammed and doesn't need to get powered. One such instance is when the M7 doesn't have the appropriate firmware that automatically handles the initialization of the M4. As a result you need to force boot the M4 so that it can run a sketch. You can do so through the M7 using a special command, `bootM4()`  that boots the M4 when the board is powered.

![The M7 and the M4 cores share the flash memory where the sketches are stored.](assets/por_ard_dcp_m4_m7_flash_memory.svg?sanitize=true)

Before you can upload the code for the M4 core to the flash memory you need to add the `bootM4()` command in the **blink_RedLed_m7.ino** sketch file that is uploaded and run by the M7 core. Copy and paste the following command `bootM4()` inside the `setup()` function of the **blink_RedLed_m7.ino**  sketch and upload the sketch to M7 once again.

```cpp
// the setup function runs once when you press reset or power the board
void setup() {
    // initialize digital pin LED_BUILTIN as an output.
   bootM4();
   pinMode(LEDR, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
   digitalWrite(LEDR, LOW); // turn the LED on (LOW is the voltage level)
   delay(200); // wait for 200 miliseconds
   digitalWrite(LEDR, HIGH); // turn the LED off by making the voltage HIGH
   delay(200); // wait for 200 miliseconds
}
```

Once this sketch runs on the M7 core, it boots the M4 core and allows it to run its corresponding sketch.

## 6. Uploading to the M4 Core
The final step is to upload the sketch that we prepared for the M4. Now open **Tools> Boards** from the IDE menu and select **Arduino Portenta H7 (M4 core)** from the boards. Upload the **blink_GreenLed_M4.ino** to the board. Note that there is no separate serial port listed for the M4 in the port menu as the M7 takes care of the serial communication. The RGB LED blinking in RED currently, starts blinking in green simultaneously at an interval of 500 ms. When the blinking overlaps the mix of red and green light is perceived as yellow.

![Uploading the blink_GreenLed_M4 to the M4 core](assets/por_ard_dcp_upload_code_m4.png)

# Programming both Cores with just one sketch

As you have learnt in this tutorial, we need specific programs and sketches in order to program different applications for both of the cores, but using a bit more advanced programming concepts, you can program different behaviors for both cores by using the same program. 

***Programming bigger applications by using this method may increase the difficulty of the program you will need to create.*** 

Let's now to create a new sketch to  blink both of LEDs with random sequences, this will allow you to clearly see different behaviors for both of the LEDs using a very simple program.

## 1. Programming the M7 Core Set-up

Let's start by opening a new sketch and naming it **blink_2cores.ino**. Then let's add the following lines of code. 

```cpp
void setup() {

   randomSeed(analogRead(0));
   
 #ifdef CORE_CM7  
     LL_RCC_ForceCM4Boot();  
     myLED = LEDB; // on-board blue LED
  #endif
```
The code between `#ifdef CORE_CM7` and `#endif` will only apply for the M7 Core to boot the M4 core allowing it to run its corresponding sketch, that portion of code will also allow the M7 core control the blue LED of the board.

## 2. Programming the M4 Core Set-up

Then, as well inside the `setup()` function, you will need to include the following lines to configure properly the green LED in the M4 core.

```cpp
 #ifdef CORE_CM4  
     myLED = LEDG; // on-board greeen LED
  #endif   
```

## 3. Finishing the setup() function and programming the loop()

To finish with the `setup()` you will need to initialise the LEDs as outputs. 

Then in the `loop()` function you will need to include the sequence that blink the LEDs. to do so, add  the following portion of code right after the `#endif`. 

```cpp
  pinMode(myLED, OUTPUT);
}

void loop() {
   digitalWrite(myLED, LOW); // turn the LED on 
   delay(200); 
   digitalWrite(myLED, HIGH); // turn the LED off 
   delay( rand() % 2000 + 1000); // wait for a random amount of time between 1 and 3 seconds.
} 
```

Now that the code is done, you need to upload it to both of the cores of the Portenta. With this program, you will be able to program both Cores (M4 and M7) using the same sketch.

Once the code is in the M4 and M7 Cores, you should be able to see the Blue and Green LEDs of the Portenta board blinking with different sequences. 


# Conclusion

This tutorial introduces the idea of dual core processing and illustrates the concept by using the M7 and M4 cores to control the different colors of the built-in RGB LED. This simple example only describes how to access the M7 and M4 cores. In the upcoming tutorials you will learn to create applications that leverage the potential of dual core processing to perform more complex tasks. 

# Next steps
- Proceed with the next tutorial "Setting Up a WiFi Access Point" to learn how to make use of the built-in WiFi module and configure your Portena H7 as a WiFi access point.

**Authors:** Lenard George, Sebastian Hunkeler  
**Reviewed by:** José Garcia [20.03.2020]  
**Last revision:** 23.4.2020
