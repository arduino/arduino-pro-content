# Creating GUIs With LVGL  
In this tutorial you will learn to use the [LVGL](https://lvgl.io/) library to create a simple graphical user interface that consists of a button and the inner text label that updates itself.

## What You Will Learn
-   Understanding the structure to build LVGL interfaces.
-   Building a simple UI with a text label and a button. 
-   Configuring the setup to display the User-Interface. 

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 
-   USB-C hub with HDMI (<[The one we used](https://www.dustinhome.se/product/5011166993/travel-port-usb-c-total)>)
-   External monitor 
-   HDMI cable 

# The Light and Versatile Graphics Library...

Graphical User interfaces are necessary for visualising information and interacting with certain aspects of the applications. Also known as [LVGL](https://lvgl.io/) this open-sourced library is used to create graphical user-interfaces for microcontrollers and high-end processors. The light weight embedded library provides all the necessary widgets and the user interface elements that will allow you to easily  create user interfaces for displays like OLED, TFT, monitors, Drive Monochrom and touch screens.

# Building a simple GUI 

This tutorial will guide you to build a basic user interface using the LVGL and the USBhost Libraries that you will have download using the Arduino Library Manager. The setup for this tutorial requires you to first to upload the finished sketch file to the Portenta board where it converts the board into a usb host Device. You will then connect the board to a USB-hub and connect an external monitor. Once the HUB is powered externally, a graphical user interface with a button and a text-field will be displayed on the screen.

![por_ard_lvgl_tutorial_steps](assets/por_ard_lvgl_tutorial_steps.svg)

## 1. The Basic Setup

Begin by plugging in your Portenta board to the computer using a USB-C cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://github.com/bcmi-labs/arduino-pro-content/blob/master/content/tutorials/portenta-h7/por-ard-usb/por-ard-gs) before you proceed.

![por_ard_usbh_basic_setup](assets/por_ard_usbh_basic_setup.svg)

## 2. Download the lvgl library

Next, select Portenta in the Tool > Board menu before to install the [lvgl Library](https://github.com/lvgl/lvgl) from the Library Manager. To do so, go to **Sketch** **->** **Include Libraries** **-> Manage Libraries** and search for LVGL. Dowload the **lvgl library** by [kisvegabor](https://github.com/kisvegabor).  

![por_ard_lvgl_download_library](assets/por_ard_lvgl_select_library.svg)

   ***Make sure you have selected the right board inside Tools > Boards, otherwise you won't see the library or you may isntall a library that is not compatible with Portenta .***

## 3. Add the button widget  

   ```cpp
   #include "Portenta_LittleVGL.h"
   #include "USBHost.h"

   static lv_obj_t *lv_btn;
   static lv_obj_t *myCustomLabel;

   void setup() {
     // put your setup code here, to run once:
     Serial1.begin(115200);
     
     portenta_init_video();

     //Setting up the Button
     lv_btn = lv_btn_create(lv_scr_act(), NULL);
     lv_obj_align(lv_btn, NULL, LV_ALIGN_CENTER, 0, -40);
     //lv_obj_set_event_cb(lv_btn, event_handler);            // If you want to handle the button’s callback create a cb_btn function

     //Setting up inner Label
     myCustomLabel = lv_label_create(lv_btn, NULL);           // We make the object be a label widget, lv_btn child     lv_obj_align(myCustomLabel, NULL, LV_ALIGN_CENTER, 0, -40);   // We move it to the center of the screen below the ‘Hello world’ and align centered
     lv_label_set_text(myCustomLabel , "Button");      // We set the default text
   }

   void loop() {
     // put your main code here, to run repeatedly:
     lv_task_handler();
   }
   ```

   This sketch creates a button that will be displayed in the monitor. By using the `lv_btn` statement we create the phisical button and then by modifying the `myCustomLabel`part, you will be able to add the text you want to the button.

   Then, in the setup, it configures  the type, style and the position of the button and lits abel.

   To finish, in the loop, it calls to the `lv_task_handler()` which will update the output to the external monitor. 


## 4. Connect an external monitor

Compile and upload the sketch, to your Portenta H7. At this point your board becomes as the host. Unplug the board from your computer and connect it to USB hub along with a monitor that is connected to the HDMI port. Power up your hub by connecting it to an external power source and the monitor will display a Button with the inner text `Button`". 


   ![por_ard_lvgl_connect_monitor](assets/por_ard_lvgl_connect_monitor.svg)

   ***If you arent familiar with how the USB host works, we recommend you to have a look at the [USB Host tutorial](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-usb )***

   The button should be the default one, have a look <https://docs.lvgl.io/latest/en/html/widgets/btn.html#simple-buttons>


   Once you know that it is working, let's create a counter that increases each second and update it in the screen. To do so, we will create a new label that is going to be updated periodically and then change its value in the screen, this is possible using the LVGL feature called 'Task'. 

   Let's update the sketch by adding the following portions of code: 
   
   * First the new task declaration and the counter variable at the beginninf of the program (before the `setup()` function)
   
   ```cpp
   static lv_obj_t * lv_btn;
   static lv_obj_t * myCustomLabel;

   static void label_Task(lv_task_t * myTask);
   uint32_t count = 0;
   ```
   
   * Then, the function that is going to update the value of the counter, its label and that is going to send it through the Serial Monitor (after and outside the loop() function)
   
   ```cpp
   static void label_Task(lv_task_t * myTask) {
      //printf("count: %d\n", count);                        //We can see in the Serial monitor the count
      lv_label_set_text_fmt(myCustomLabel, "%d" , count);    //Update the text from the label
      count++;      //Increase the count number
   }
   ```
   
   * And, to finish, to program the execution of the task each second, we need to add the next line of code as the last command inside the `setup()` function 
   
   ```cpp
    void setup() {
     // put your setup code here, to run once:
     Serial1.begin(115200);

     portenta_init_video();

     //Setting up the Button
     lv_btn = lv_btn_create(lv_scr_act(), NULL);
     lv_obj_align(lv_btn, NULL, LV_ALIGN_CENTER, -40, -40);
     //lv_obj_set_event_cb(lv_btn, event_handler);        // If you want to handle the button's callback create a cb_btn function

     //Setting up inner Label
     myCustomLabel = lv_label_create(lv_btn, NULL);       // We make the object be a label widget, lv_btn child
     lv_label_set_text(myCustomLabel , "Button");         // We set the default text

     //Create a task
     lv_task_create(label_Task, 1000, LV_TASK_PRIO_MID, NULL);
   }
   ```
## 5. Create a simple counter

Once you know that it is working, let's create a counter that increases each second and update it in the screen. To do so, we will create a new label that is going to be updated periodically and then change its value in the screen, this is possible using the LVGL feature called 'Task'. 

First the create a new task declaration and the counter variable at the beginning of the program (before the `setup()` function)

```cpp
static lv_obj_t * lv_btn;
static lv_obj_t * myCustomLabel;

static void label_Task(lv_task_t * myTask);
uint32_t count = 0;
```

Then, the function that is going to update the value of the counter, its label and that is going to send it through the Serial Monitor (after and outside the loop() function)

```cpp
static void label_Task(lv_task_t * myTask) {
   //printf("count: %d\n", count);                        //We can see in the Serial monitor the count
   lv_label_set_text_fmt(myCustomLabel, "%d" , count);    //Update the text from the label
   count++;      //Increase the count number
}
```

And, to finish, to program the execution of the task each second, we need to add the next line of code as the last command inside the `setup()` function 

```cpp
 void setup() {
  // put your setup code here, to run once:
  Serial1.begin(115200);

  portenta_init_video();

  //Setting up the Button
  lv_btn = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_align(lv_btn, NULL, LV_ALIGN_CENTER, -40, -40);
  //lv_obj_set_event_cb(lv_btn, event_handler);        // If you want to handle the button's callback create a cb_btn function

  //Setting up inner Label
  myCustomLabel = lv_label_create(lv_btn, NULL);       // We make the object be a label widget, lv_btn child
  lv_label_set_text(myCustomLabel , "Button");         // We set the default text

  //Create a task
  lv_task_create(label_Task, 1000, LV_TASK_PRIO_MID, NULL);
}
```

## 6. Upload the Sketch

Heres a complete sketch of the tutorial that updates the button text with a counter. Upload the sketch to your Portenta H7 and connect it the same way to an external just as in Step 4. 

```c++
#include "Portenta_LittleVGL.h"
#include "USBHost.h"

static lv_obj_t * lv_btn;
static lv_obj_t * myCustomLabel;
static void label_Task(lv_task_t * myTask);
uint32_t count = 0;

void setup() {
  // put your setup code here, to run once:
  Serial1.begin(115200);
  portenta_init_video();
  //Setting up the Button
  lv_btn = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_align(lv_btn, NULL, LV_ALIGN_CENTER, -40, -40);
  //lv_obj_set_event_cb(lv_btn, event_handler);        // If you want to handle the button's callback create a cb_btn function
  //Setting up inner Label
  myCustomLabel = lv_label_create(lv_btn, NULL);       // We make the object be a label widget, lv_btn child
  lv_label_set_text(myCustomLabel , "Button");         // We set the default text
  //Create a task
  lv_task_create(label_Task, 1000, LV_TASK_PRIO_MID, NULL);
}

void loop() {
  // put your main code here, to run repeatedly:
  lv_task_handler();
  
}
static void label_Task(lv_task_t * myTask) {
  //printf("count: %d\n", count);                      // We can see in the Serial monitor the count
  lv_label_set_text_fmt(myCustomLabel, "%d" , count);  // Update the text from the label
  count++;                                             // Increase the count number
}

```

# Conclusion

This tutorial shows how to build a simple user interface with your Portenta showing first a static view in the monitor and then, convert this UI into a simple dynamic application that shows in the screen a variable that updates with the time. The tutorial also shows how to  use the "task" feature of the LVGL library to run instructions recurrently.

in this tutorial you learned how to build a simple user interface for the Portenta H7 and the configuration required to view the 

# Next Steps
Now that you know how to build a simple UI in a screen, you can try to add more labels in the screen to show different stuff. Also be alert because we will continue growing the tutorials about how to combine LVGL with other features of your Portenta

# Troubleshooting
## Not updating the text with the count
Make sure that the label and task is declared on top of the sketch, outside the `setup()`and `loop()` like a normal variable.

Check if the task has the same structure in the first declaration and the function creation.

Look inside the `loop()` and see if `lv_task_handler()` is there.

Try to uncomment the printf inside the task to check if the Serial Monitor its updating the count.


## Sketch Upload Troubleshooting
* Make sure you set the board in bootloader mode, by clicking twice the reset button, then you should see the built-in LED fading.
* If you uploaded the sketch and you dont have any output in the display, make sure you have in the setup `portenta_init_video()`.
* Unplug and plug back the HDMI cable.
* Reset the Portenta once its connected to the HUB.

**Authors:** Pablo Marquínez & Lenard George
**Reviewed by:** Jose Garcia [20.10.2020]  
**Last revision:**  [20.10.2020]
