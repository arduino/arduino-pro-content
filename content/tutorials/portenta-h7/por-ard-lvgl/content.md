# Creating GUIs With LVGL  
Some applications developed to run on the portentea needs a graphical user interface to display information with the user can interact with. in this tutorial you will learn how to create A 

## What you will learn
-   A
-   B
-   C

## Required hardware and software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 
-   USB 
-   External monitor 
-   HDMI cable 

# Portenta and The ...

Graphical User interfaces are necessary for visualising information and interacting with the board. Information like performances, widgets and pages. 

LVGL - create user interfaces - platform independant - use one library with microcontrollers or high-end processors - light weight embedded library - for displays : OLED, TFT, monitors, Drive Monochrom and touch screens - open source

the lvgl arduino library can 

![The Arduino core is built on top of the Mbed stack](assets/Arduino-Logo.svg?sanitize=true)


# Building a simple GUI 
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

1. The Basic Setup

Begin by plugging in your Portenta board to the computer using a USB-C cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://github.com/bcmi-labs/arduino-pro-content/blob/master/content/tutorials/portenta-h7/por-ard-usb/por-ard-gs) before you proceed.

2. Download the lvgl library 

   Library manager - LVGL and dowload the lvgl library. 

<image here>

2. Portenta_lvgl example sketch

   Find the example at 

   ![por_ard_lvgl_select_example]()

   Scroll to the bottom of the sketch, comment `lv_demo_widgets();` uncomment the Hello world lines (above the command you commented). 

   ![por_ard_lvgl_select_example]() 

   upload the sketch, 
   Compile and run the sketch,

   Note : if you cant find the sketch, make sure you have selected the right board inside **Tools > Boards** 

3. Connect an external monitor the sketch 

   once the sketch has finished uploading to the board.  At the point the Portent board becomes needs to be removed as it behaves as the USB host in this case. it needs to be plugged to a USB hub through which you can attach a HDMI port connected to an external moniter 

   ![por_ard_lvgl_select_example]() 

4. Adding a widget 

   Now lets create a widget, first of all we need to declare our object

   `static lv_obj_t * myCustomLabel;`
   
   Then at the end of the `setup()` we can configure it
   ´´´
   //Setting up the object
   myCustomLabel = lv_label_create(lv_scr_act(), NULL);        //We make the object be a label widget
   lv_obj_align(myCustomLabel, NULL, LV_ALIGN_CENTER, 0, -100);   //We move it to the center of the screen below the 'Hello world' and align centered
   lv_label_set_text(myCustomLabel , "This is my first Label Widget");          //We set the default text
   ´´´
   
   Now we have two labels `label` and `myCustomLabel`
   
   You should see the new label below the `Hello World` one
   
5. Making a simple counter
   
   To make a counter we need to update periodically a label and change it value, to be able to do that we are going to use the LVGL feature called 'Task'
   
   First of all lets declare our new task by adding `static void label_Task(lv_task_t * myTask);` and an int to count `uint32_t count = 0;`
   
   After that we need to create the void that we declared before:
   
   ```cpp
   static void label_Task(lv_task_t * myTask) {
      //printf("count: %d\n", count);                        //We can see in the Serial monitor the count
      lv_label_set_text_fmt(myCustomLabel, "%d" , count);    //Update the text from the label
      count++;                                               //Increase the count number
   ```
   
   To make it work we need to take the task and add it inside the LVGL task handler, by adding `lv_task_create(label_Task, 1000, LV_TASK_PRIO_MID, NULL);` at the end `of the setup()`
   We set the task to refresh each second.
   

# Conclusion
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.  

# Next Steps
-   A
-   B

# Troubleshooting
## Not updating the text with the count
Make sure that the label and task is declared on top of the sketch, outside the `setup()`and `loop()` like a normal variable.
Check if the task has the same structure in the first declaration and the function creation.
Look inside the `loop()` and see if `lv_task_handler()` is there.
Try to uncomment the printf inside the task to check if the Serial Monitor its updating the count.

## Sketch Upload Troubleshooting
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 

**Authors:** XX, YY
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
