# Creating interactive GUIs With LVGL  
In this tutorial you will learn to use the [LVGL](https://lvgl.io/) library to create a simple graphical user interface that consists of a text input and some buttons to interact with USB inputs (Mouse and Keyboard).

## What You Will Learn
-   Understanding the structure of LVGL callbacks.
-   Understanding the different states of the widgets.
-   Adding input devices to LVGL. 
-   Display custom data inside a LVGL widget. 

## Required Hardware and Software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+
-   USB-C hub with HDMI (<[The one we used](https://www.dustinhome.se/product/5011166993/travel-port-usb-c-total)>)
-   External monitor 
-   HDMI cable 
-   USB Mouse
-   USB Keyboard (optional)


# The implementation of interaction...

Usually what makes the difference when whe are using GUIs between each other, is how the user can interact and manipulate the data and how the user feels the way of communicating trough the GUI.
By adding the most common used interfaces, the Mouse and the Keyboard we are doing it to be more handful to computer users, but with LVGL you can use rotary encoders, keypads, buttons and much more to do the interaction as custom as your project need.

# Making the interactive GUI 

This tutorial will guide you to build a basic user interface using the LVGL , the USBhost and the RPC Libraries that you will have download using the Arduino Library Manager. The setup for this tutorial requires you to first to upload the finished sketch file to the Portenta board where it converts the board into a usb host Device. You will then connect the board to a USB-hub and connect an external monitor. Once the HUB is powered externally, a graphical user interface with a button and a text-area will be displayed on the screen. You will have the option to add a Mouse and a Keyboard to interact with those items (widgets).

![por_ard_lvgl_tutorial_steps](assets/por_ard_lvgl_tutorial_steps.svg)

## 1. The structure of the processors and sketches

In this case the Portenta M4 is going to be focused to receive the Mouse and Keyboard inputs, and send the information to the Portenta M7 trough RPC
This is the structure of our processors's sketches

Portenta
    * M4
        * lvgl_mouse_m4.ino - getting the input data and sending the it with RPC to the M7
    * M7
        * lvgl_interaction.ino - call the widgets.h and inputs.h custom made functions to configure, and display the LVGL output
        * inputs.h  - RPC callbacks from the M4 and to configure the LVGL's inputs
        * widgets.h - all the LVGL widgets and events/callbacks
        * sharedVariables - store the values of the mouse

## 2. Create the structure

Lets start by creating the files:
   * Create a new file called "lvgl_interaction.ino"
   * Add a new tab called "inputs.h" and "widgets.h"
   * Create one more file called "sharedVariables.h" and add the next code:
      ```cpp
         extern int16_t touchpad_x;
         extern int16_t touchpad_y;
         extern uint8_t button;
      ```
      This file is the one wich is going to "share" the mouse values and make them available between the different files
      
## 3. Add the USB inputs

 First of all lets include the needed libraries
       ```cpp
         #include "RPC_internal.h"
         #include "USBHost.h"
         #include "sharedVariables.h"
       ```

Then set the functions that are going to receive the RPC callbacks and the initialization of the RPC
      ```cpp
         void on_mouse(uint8_t btn, int8_t x, int8_t y) {
           touchpad_x += x;
           touchpad_y += y;
           if (touchpad_x < 0) {
             touchpad_x = 0;
           }
           if (touchpad_y < 0) {
             touchpad_y = 0;
           }
           button = btn;
         }

         void on_key(char ch) {
           Serial1.print("Keyboard: ");
           Serial1.println(ch);
         }

         void initInputs() {
           RPC1.begin();
           RPC1.bind("on_mouse", on_mouse);
           RPC1.bind("on_key", on_key);
         }
      ```

## 4. Interface

```cpp
#include "Portenta_LittleVGL.h"
#include "sharedVariables.h"

static lv_indev_drv_t indev_drv_mouse;
//static lv_indev_drv_t indev_drv_btn;
static lv_obj_t * myCustomLabel;
static lv_obj_t * cursor_obj;
static lv_obj_t * btn1;

static lv_obj_t * kb;

lv_obj_t * ta1;

/*

    lv_textarea_add_char(textarea, 'c')
    lv_textarea_add_text(textarea, "insert this text")

    lv_textarea_set_placeholder_text(ta, "Placeholder text")

    lv_textarea_del_char(textarea)
    lv_textarea_set_cursor_pos(textarea, 10)

    lv_textarea_cursor_right(textarea)
    lv_textarea_cursor_left(textarea)
    lv_textarea_cursor_up(textarea)
    lv_textarea_cursor_down(textarea)

    lv_textarea_set_cursor_click_pos(textarea, true)
    lv_textarea_set_cursor_hidden(textarea, true)

    lv_textarea_set_cursor_hidden(textarea, true)
    lv_textarea_get_text(textarea)

    lv_textarea_set_text_sel(textarea, true)
*/

void btn_event_cb(lv_obj_t * myCustomLabel, lv_event_t event)
{
  if (event == LV_EVENT_CLICKED) {
    lv_label_set_text(myCustomLabel , "ButtonClicked");
  }
}


static void kb_event_cb(lv_obj_t * keyboard, lv_event_t e)
{
  lv_keyboard_def_event_cb(kb, e);
  if (e == LV_EVENT_CANCEL) {
    lv_keyboard_set_textarea(kb, NULL);
    lv_obj_del(kb);
    kb = NULL;
  }
}

static void kb_create(void)
{
  kb = lv_keyboard_create(lv_scr_act(), NULL);
  lv_keyboard_set_cursor_manage(kb, true);
  lv_obj_set_event_cb(kb, kb_event_cb);
  lv_keyboard_set_textarea(kb, ta1);

}

bool my_input_read(lv_indev_drv_t * drv, lv_indev_data_t*data)
{
  static uint32_t last_btn = 0;   /*Store the last pressed button*/
  int btn_pr = button - 1;        /*Get the ID (0,1,2...) of the pressed button*/

  data->point.x = touchpad_x;
  data->point.y = touchpad_y;

  if (btn_pr >= 0) {              /*Is there a button press? (E.g. -1 indicated no button was pressed)*/
    last_btn = btn_pr;           /*Save the ID of the pressed button*/
    data->state = LV_INDEV_STATE_PR;  /*Set the pressed state*/
  } else {
    data->state = LV_INDEV_STATE_REL; /*Set the released state*/
  }

  data->btn_id = last_btn;            /*Save the last button*/

  //data->state = LV_INDEV_STATE_REL;
  return false; /*No buffering now so no more data read*/
}

void createWidgets() {

  // Mouse pointer init
  lv_indev_drv_init(&indev_drv_mouse);      /*Basic initialization*/
  indev_drv_mouse.type = LV_INDEV_TYPE_POINTER;
  indev_drv_mouse.read_cb = my_input_read;
  lv_indev_t * my_indev_mouse = lv_indev_drv_register(&indev_drv_mouse);

  // Mouse pointer
  cursor_obj =  lv_img_create(lv_scr_act(), NULL); //create object
  lv_label_set_text(cursor_obj, "Sys layer");
  lv_indev_set_cursor(my_indev_mouse, cursor_obj); // connect the object to the driver

  // Mouse press
  /* lv_indev_drv_init(&indev_drv_btn);      /*Basic initialization*/
  /*indev_drv_btn.type = LV_INDEV_TYPE_BUTTON;
    indev_drv_btn.read_cb = button_read;
    lv_indev_t * my_indev_btn = lv_indev_drv_register(&indev_drv_btn);*/

  //Set your objects
  myCustomLabel = lv_label_create(lv_scr_act(), NULL);
  lv_obj_align(myCustomLabel, NULL, LV_ALIGN_CENTER, 0, 0);
  //lv_label_set_text(myCustomLabel , "Button");

  btn1 = lv_btn_create(lv_scr_act(), NULL);
  //lv_obj_set_event_cb(btn1, event_handler_button);
  lv_obj_align(btn1, NULL, LV_ALIGN_CENTER, 0, 0);

  myCustomLabel = lv_label_create(btn1, NULL);
  lv_label_set_text(myCustomLabel, "Submit");


  //Text Area
  ta1 = lv_textarea_create(lv_scr_act(), NULL);
  lv_obj_set_size(ta1, 200, 100);
  lv_obj_align(ta1, NULL, LV_ALIGN_CENTER, 0, -120);
  lv_textarea_set_placeholder_text(ta1, "Arduino PRO and LVGL");  //Placed if empty
  //lv_textarea_set_text(ta1, "A text in a Text Area");    /*Set an initial text*/
  //lv_obj_set_event_cb(ta1, event_handler_textArea);
  lv_textarea_set_cursor_click_pos(ta1, true);
  lv_textarea_set_cursor_hidden(ta1, true);
  lv_textarea_set_text_sel(ta1, true);

  //get text lv_textarea_get_text
  /*Assign buttons to points on the screen*/
  /* static const lv_point_t btn_points[1] = {
     {720 / 2, 480 / 2}, /*Button 0 -> x:10; y:10*/
  //};*/
  //lv_indev_set_button_points(my_indev_mouse, btn_points);

  kb_create();

  //Create a task
  //lv_task_create(label_refresher_task, 1000, LV_TASK_PRIO_MID, NULL);

  //Assign a callback to the button
  //lv_obj_set_event_cb(myCustomLabel, btn_event_cb);
}

```


## 5. Main sketch
```cpp
   int16_t touchpad_x = 0;
   int16_t touchpad_y = 0;
   uint8_t button = 0;

   #include "inputs.h"
   #include "widgets.h"

   void setup() {
     // put your setup code here, to run once:
     initInputs();
     portenta_init_video();
     Serial1.begin(115200);

     createWidgets();
   }

   void loop() {
     // put your main code here, to run repeatedly:
     lv_task_handler();
     //delay(3);
   }

```
