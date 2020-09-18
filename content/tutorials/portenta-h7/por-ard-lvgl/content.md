# Creating GUIs With LVGL  
In this tutorial you will learn to use the [LVGL](https://lvgl.io/) library and the Portenta_lvgl example to create a simple graphical user interface that consists of a label that updates itself.

## What you will learn
-   Understanding the Portenta_lvgl example.
-   Building a simple UI with a text label. 
-   Configuring the setup to display the User-Interface. 

## Required hardware and software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4+ 
-   USB 
-   External monitor 
-   HDMI cable 

# The Light and Versatile Graphics Library...

Graphical User interfaces are necessary for visualising information and interacting with certain aspects of the applications. Also known as LVGL this open-sourced library is used to create graphical user-interfaces for microcontrollers and high-end processors. The light weight embedded library provides all the necessary widgets and the user interface elements that will allow you to easily  create user interfaces for displays like OLED, TFT, monitors, Drive Monochrom and touch screens.

# Building a simple GUI 

we are going to work on the **Portenta_lvgl** example , The Portenta H7 comes with an inbuilt,  In this tutorial we are going to upload the lvgl example to the portenta board. Once the sketch is uploaded the board becomes a usb host where it then is connected to the usb hub which then is connected to an external monitor and powered externally. when connected the monitor the buttons and text fields will be connected. 

![por_ard_lvgl_tutorial_steps](/Users/lenardgeorge/Documents/Arduino/Content Team/Maker Content/Portenta Tutorials /arduino-pro-content/content/tutorials/portenta-h7/por-ard-lvgl/assets/por_ard_lvgl_tutorial_steps.svg)

1. The Basic Setup

   Begin by plugging in your Portenta board to the computer using a USB-C cable and open the Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://github.com/bcmi-labs/arduino-pro-content/blob/master/content/tutorials/portenta-h7/por-ard-usb/por-ard-gs) before you proceed.

2. Download the lvgl library

   To start with, you need to download the [lvgl Library](https://github.com/lvgl/lvgl) from the Library Manager. Go to **Sketch** **->** **Include Libraries** **-> Manage Libraries** and search for LVGL. Dowload the **lvgl library** by [kisvegabor](https://github.com/kisvegabor).  
   
   ![por_ard_lvgl_download_library](/Users/lenardgeorge/Documents/Arduino/Content Team/Maker Content/Portenta Tutorials /arduino-pro-content/content/tutorials/portenta-h7/por-ard-lvgl/assets/por_ard_lvgl_select_library.svg)
   
   
   Once you have installed the library, open the **Portenta_lvgl** sketch from **File -> Examples -> LittleVGL**.
   
   *** Note : if you cant find the sketch, make sure you have selected the right board inside Tools > Boards ***
   
   ![por_ard_lvgl_select_example](/Users/lenardgeorge/Documents/Arduino/Content Team/Maker Content/Portenta Tutorials /arduino-pro-content/content/tutorials/portenta-h7/por-ard-lvgl/assets/por_ard_lvgl_select_example.svg)
   
   
   
3. The Hello World label widget 

   For the first part of the tutorial you will be displaying a `Hello Arduino` label on the monitor.  Scroll to the bottom of the sketch and uncomment the all the lines below the ` /*Hello world label*/` 

   ![por_ard_lvgl_select_example](/Users/lenardgeorge/Documents/Arduino/Content Team/Maker Content/Portenta Tutorials /arduino-pro-content/content/tutorials/portenta-h7/por-ard-lvgl/assets/por_ard_lvgl_hello_world_snippet.svg) 

   

   In this sketch we are first creating a `label` object is a widget of the type label. the following line declares a new label.  We then 

   ```cpp
   lv_obj_t * label = lv_label_create(lv_scr_actr(),NULL); 
   lv_label_set_text(label,"Hello Arduino! Dev-7.0");
   lv_obj_align(label, NULL, LV_ALIGN_CENTER, 0, 0);
   ```

   and Comment out  `lv_demo_widgets();`

   is widget the Once you have made the changes, Compile and upload the sketch, to your Portenta H7.  

    

4. Connect an external monitor

   At this point your board becomes as the host. Unplug the board from your computer and connect it to USB hub along with a monitor that is connected to the HDMI port. Power up your hub by connecting it to an external power source and the monitor will display a `Hello Arduino! Dev-7,0`. 

   ![por_ard_lvgl_connect_monitor](/Users/lenardgeorge/Documents/Arduino/Content Team/Maker Content/Portenta Tutorials /arduino-pro-content/content/tutorials/portenta-h7/por-ard-lvgl/assets/por_ard_lvgl_connect_monitor.svg)


   Unplug the board and connect it back to your computer 

   *** Note: if you arent familiar with how the USB host works, we recommend you to have a look at the [USB Host tutorial](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-usb ) ***

4. Adding a widget 

   To add our custom Now lets create a widget, first of all we need to declare our object

   `static lv_obj_t * myCustomLabel;`

   Then at the end of the `setup()` we can configure it

   ```cpp
   //Setting up the object
   myCustomLabel = lv_label_create(lv_scr_act(), NULL);        //We make the object be a label widget
   lv_obj_align(myCustomLabel, NULL, LV_ALIGN_CENTER, 0, -100);   //We move it to the center of the screen below the 'Hello world' and align centered
   lv_label_set_text(myCustomLabel , "This is my first Label Widget");          //We set the default text
   ```

   Now we have two labels `label` and `myCustomLabel`

   You should see the new label below the `Hello World` one

5. Create a simple counter

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

in this tutorial you learned how to build a simple user interface for the Portenta H7 and the configuration required to view the 

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

**Authors:** Pablo Marquinez YY
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
