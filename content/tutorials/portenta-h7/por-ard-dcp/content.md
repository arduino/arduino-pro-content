# Dual Core Processing

The Portenta H7 is equipped with a processor that has two processing units called cores. Dual core processing is the ability of a processor to read and execute instructions in two different cores simultaneously. In other words, a dual core processor can execute two applications, in this case two Arduino sketches,  at the same time. In this tutorial you will run two classic Arduino blink programs simultaneously on different cores of the Portenta board that blinks the RGB LED in two different colours.   

What you will learn
-------------------

-   How to upload and run applications on  Portenta's M7 and M4 cores.

-   About the characteristics of the M7 and the M4 cores.

-   Force booting the M4 core through the M7 core.

-   Controlling the colours of the built-in RGB LED. 

Required hardware and software
------------------------------

-   Portenta H7 board 

-   USB C cable (either USB A to USB C or USB C to USB C)

-   Arduino IDE 1.8.10+ or Arduino Pro IDE 0.0.4+ 

Cortex® M7 & M4 
================

Processor cores are individual processing units within the board's main processing unit. These cores are responsible for the executing instructions at a particular clock speed.  The onboard Arm Cortex processor comes with two cores - Cortex® M7 and M4, with slightly different architectures and clock speeds. The M7's runs at 480 MHz and the architecture is designed  to separate Instruction and Data buses to optimize CPU latency. The M4 runs at 240 MHz and the architecture supports the ART™ accelerator ( a block that speeds up instruction fetch accesses of the Cortex-M4 core to the D1-domain internal memories. The higher clock rate of the M7 makes it suitable to handle complex processing tasks such as data storage, debugging and handling input output peripherals at a higher efficiency compared to the M4. The dual core processor of the Portenta H7 sets it apart from other single core Arduino boards by allowing true multitasking, faster data processing capabilities, enhanced processing power and application partitioning.  

![](https://lh5.googleusercontent.com/GJaVPQoGkPUkUFqVs_5o2_D4fghvUNhGZ0lgpVmUnDyuhGHYJsneakSKu40BgyozGEP01OKZDY3l1RFUvAG48hp2C4MwqXZugrF4siy7E9PmEjKcRXG7cuMxr-m3Mwrtf09UBbtZ)

The Architectures of Cortex® M7 and M4 cores.

[POR_ARD_DCP_M7_M4_ARCHITECTURE]

Accessing the M7 and M4 Core
============================

To best illustrate the idea of dual core processing, you will be running two separate sketch files on each of the cores that blinks the RGB in two different colours. The blink_LEDR_M7.inosketch will set the builtin RGB LED on the board to Red and blink it with a delay of 500 ms. The blink_LEDG_M4.ino sketch will access the Green LED in the RGB led and blink it with a delay of 200 ms.  Both the cores will be executing the sketch files simultaneously and as a result blink both the green and red LED at the same time, however, with different intervals.

![](https://lh5.googleusercontent.com/0fe8vMn9iVYOpjdsWRICU-CYGtirjcoJs3tHnag4LSdEWNtsHAa5al2Ym-6zhfaJMWtcKn6N_NRVkuiO8uxeN2v951flwMSlujIBfN7xHc92M0OT5W6PGv2U2xHWH1vNIu2uCzfa)

Running two different Sketch files on the different cores.

[POR_ARD_DCP_TUTORIAL_OVERVIEW]

1\. The Basic Setup
-------------------

Begin by plugging-in your Portenta board to your computer using an appropriate USB-C cable and have the  Arduino IDE or the Arduino Pro IDE open. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [setup the Portenta H7 for Arduino](https://drive.google.com/open?id=1Sp-d2-di97XbNOboVlHe2wV_Bi8F5KMT-bgr1x1sN3o) before you proceed.

![](https://lh5.googleusercontent.com/KUQMLAYjo4PV2PnDdrqA-h_bVOV9PYpnebpnndlOBRq6EdbU2dmLE8NDDqiLPg0vod4uK9287wvz35BK_96SRBsvFE5qj0VyPNSG2I3RDN9gvaE05cVLBYLvgv7oDG-0XbQGjU5O)

A Basic setup of the board attached to your computer 

[POR_ARD_DCP_BASIC_SETUP]

2\. Setting the LED colour 
---------------------------

In the previous tutorial you learned how to access the built-in RGB LED through the macro definition LED_BUILTIN. You can also control the distinct Red, Green and Blue LED separately through the variables LEDR, LEDG and LEDB  respectively. Please note that, opposed to other Arduino boards, on the Portenta H7 the built-in RGB led pins need to be pulled to ground to make the led light up. This means that a voltage level of LOW will turn the led on, a voltage level of HIGH will turn it off.

The following sketch blinks the red LED at an interval of 200ms.Save your sketch as blink_LEDR_M7 and compile your sketch file.

Note - The different pin numbers connected to the Red, Blue and Green of the RGB LED are defined in the core as PK_5, PK_6, PK_7 respectively.

|

// the setup function runs once when you press reset or power the board\
void  setup() {\
  // initialize digital pin LEDR as an output.\
 pinMode(LEDR, OUTPUT);\
}

// the loop function runs over and over again forever\
void  loop() {\
 digitalWrite(LEDR, LOW);   // turn the red LED on (LOW is the voltage level)\
 delay(200);                       // wait for 200 milliseconds\
 digitalWrite(LEDR, HIGH);    // turn the LED off by making the voltage HIGH\
 delay(200);                       // wait for 200 milliseconds\
}

 |

3\. Upload the Sketch to the M7 Core 
-------------------------------------

Select the Arduino Portenta H7 (M7 core)from the Board menu and the port the Portenta is connected to. Upload the blink_LEDR_M7.ino  sketch. Doing so will automatically compile the sketch beforehand. When the sketch is uploaded  the RGB LED on the board will start blinking red.

![](https://lh3.googleusercontent.com/Gx98ytGtqZduaFjXo1qI9JKBpIPRQiVIP784LPARxL13cvHrWG17Y4D1LYLTNzSJ5VGlIzwnxPzU1hzBHE8zT8r1LzAnJzqHQ9bCZ8RCnnXFFL7Ediom37ISvQyip2EwwHrAzGAj)

Uploading the blink_LEDR_M7 to the M7 core

[POR_ARD_DCP_UPLOAD_CODE_M7]

4\. Making the LED Blink Green 
-------------------------------

Let's write another sketch that makes the RGB LED on the board blink green. Open a new sketch file and call it blink_LEDG_M4.ino. Copy paste the following program that blinks the LED green, denoted by the variable  LEDG   ,  with a delay of 500ms. 

|

// the setup function runs once when you press reset or power the board\
void  setup() {\
  // initialize digital pin LED_BUILTIN as an output.\
 pinMode(LEDG, OUTPUT);\
}

// the loop function runs over and over again forever\
void  loop() {\
 digitalWrite(LEDG, LOW);   // turn the LED on (LOW is the voltage level)\
 delay(500);                       // wait for a second\
 digitalWrite(LEDG, HIGH);    // turn the LED off by making the voltage HIGH\
 delay(500);                       // wait for a second\
}

 |

5\. Force Booting the M4 core
-----------------------------

The bootloader of the H7 boards is configured in such a way that only M7 is programmed to boot and the M4 unprogrammed. In this default mode you won't be able to upload any sketch file onto M4. Therefore, you would need to boot the M4 through the M7 using a special command.  The LL_RCC_ForceCM4Boot() command is used by the M7 to force boot the M4 and prepares it for uploading the Arduino sketch files.

Before you can upload the code to the M4 core you need to add the LL_RCC_ForceCM4Boot() command in the blink_RedLed_m7.ino sketch file that is uploaded onto the M7 core. Copy and paste the following command LL_RCC_ForceCM4Boot()  inside the setup()function of the blink_RedLed_m7.ino  sketch and upload the sketch to M7 once again.

|

// the setup function runs once when you press reset or power the board\
void  setup() {\
  // initialize digital pin LED_BUILTIN as an output.\
 LL_RCC_ForceCM4Boot();\
 pinMode(LEDR, OUTPUT);\
}

// the loop function runs over and over again forever\
void  loop() {\
 digitalWrite(LEDR, LOW);   // turn the LED on (LOW is the voltage level)\
 delay(200);                       // wait for a second\
 digitalWrite(LEDR, HIGH);    // turn the LED off by making the voltage HIGH\
 delay(200);                       // wait for a second\
}

 |

Once this sketch runs on the M7 core, it boots the M4 core and makes it available for the Arduino IDE such that a sketch can be uploaded to the M4 core.

6\. Uploading to the M4 Core
----------------------------

Now open Tools> Boards from the IDE menu and select Arduino Portenta H7 (M4 core) from the boards. Upload the blink_LEDG_m4.ino to the board. The RGB LED blinking in RED currently, starts blinking in green simultaneously at an interval of 500 ms. 

![](https://lh5.googleusercontent.com/cdRm9vJtfF_evd6S6TMSbn2mPRPFLilbqlyZc2nM5n5HkrEQ_uYstYEdCrUdHuiOmdE_SDBmwDpZQZ__3XQ34oczDef21v38n-A2MJn-Dj6ysRy0MoCQ1w52nrXQzvATzlZg502E)

Uploading the blink_LEDG_M4 to the M4 core

[POR_ARD_DCP_UPLOAD_CODE_M4]

Conclusion
==========

This tutorial introduces the idea of Dual core processing and illustrates the concept by using the M7 and M4 cores to control the different colours of the builtin RGB LED. This simple example only describes how to access the M7 and M4 cores and in the upcoming tutorials we you learn to create more complex applications that leverages the potential of dual core processing. 

Next steps
==========

-   Proceed with the next tutorial "Setting up an Access Point" to learn how to make use of the built in wifi module and configuring your portena as an Access point

Author : Lenard George

Reviewed by : Sebastian Hunkeler [27.03.2020]
