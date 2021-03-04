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
      * lvgl_interaction.ino - call the widgets.h and inputs.h custom made functions for the receiving data from the M4, and display the LVGL output
      * widgets.h - all the LVGL widgets on screen and events/callbacks of them, plus LVGL's mouse driver


## 2. Create the structure and getting started

Lets start by creating the files:
   * Create a new file called "lvgl_interaction.ino"
   * Add one more tab called "widgets.h"

Inside the main file "lvgl_interaction.ino" include the needed libraries and the widgets.h tab:
```cpp
   #include "RPC_internal.h"
   #include "USBHost.h"

   #include "widgets.h"
```

Inside this file, we will have the initialization of the needed features (Video driver, LVGL, Inputs)
```cpp
   void setup() {
     // put your setup code here, to run once:
     Serial1.begin(115200);
     portenta_init_video();
     initInputs();

     createWidgets();
   }
```
Later on we will define `initInputs()` to initialize the RPC for the **USB Mouse and Keyboardand**, and `createWidgets()` to have in place the entire interface

Then the `loop()` will be focusing on the LVLG's task handler to update the screen with the content and watching the changes and events happening on it.

```cpp
   void loop() {
      // put your main code here, to run repeatedly:
      lv_task_handler();
   }
```

## 3. Making the interface

The screen will show a text field that the user can input text in it, and two buttons, one that says submit that will trhow a popup box with the text from the previous text field, and the other button that launches a virtual keyboard from LVGL so the user only needs a mouse to fully interact with the interface wich will show on-screen an "o" where the pointer of the mouse is pointing to.

### LVGL widget's events
To understand the logic behind the interface LVGL works with **callbacks** also called **event handlers**, wich are functions that are called when for example a widget is being touched. The widgets can be attached to custom callbacks by using the command `lv_obj_set_event_cb( WIDGET, CALLBACK() )`

**Note:** Sometimes depending on the widget, it needs to be defined the *event* inside the *event callback* (Look inside `keyboardEventHandler`, it has `lv_keyboard_def_event_cb` to attach the *EVENT* to the current callback)

When we attach a callback using `lv_obj_set_event_cb( WIDGET, EVENT_HANDLER )` , we are letting LVGL know that the widget object `lv_obj_t * WIDGET` has a function that is going to receive the events happening  wich is called `EVENT_HANDLER` , this function needs to have inside its parameters the pointer to the widget and a definition to the **event** `void EVENT_HANDLER(lv_obj_t WIDGET, lv_event_t EVENT)` so inside the brackets we will be able to know the event by looking the `EVENT` variable and comparing that with the LVGL events, some of them are:
  * LV_EVENT_PRESSED : when its being pressed
  * LV_EVENT_RELEASED : triggerd when the widget stops being pressed

### Syntax example of an Event Handler
```cpp
lv_obj_t * myButton;
void myButtonEventHandler(lv_obj_t * myButton, lv_event_t myWidgetEvent);

...

  setup(){
  
    ...
    
    myButton = lv_btn_create(lv_scr_act(), NULL);
    lv_obj_set_event_cb(myButton, myButtonEventHandler);
    
    ...
    
  }

  void myButtonEventHandler(lv_obj_t * myButton, lv_event_t myWidgetEvent){
     switch(myWidgetEvent) {
          case LV_EVENT_PRESSED:
              // Button got pressed
              // Do work
              break;

          case LV_EVENT_RELEASED:
              // Button got released
              // Do work
              break;
      }
  }
  ```
**Note:** Remember to add inside the `loop()` function  `lv_task_handler();` to update LVGL's screen and task manager

[image, with the interface labeled with the names]()

Start by knowing what we need in order to make the interface work, this part contains the functions, LVGL widgets, configuration, events and callbacks:
* Draw the widgets on screen 
  * createWidgets() : This will instantiate all the widgets 
* Text Area (text input to fill)
  * object: `lv_obj_t * ta`
  * event callback: `event_handler_textArea(lv_obj_t * ta, lv_event_t ta_event)`
* Submit button
  * object: `lv_obj_t * submit_btn`
  * event callback: `submit_event_cb(lv_obj_t * submit_btn, lv_event_t submit_event)`
* Virtual Keyboard (from LVGL)
  * object: `lv_obj_t * keyboard`
  * event callback: `keyboard_event_cb(lv_obj_t * keyboard, lv_event_t keyboard_event)`
  * draw it on screen: `keyboard_create()`
* Submit button
  * object: `lv_obj_t * submit_btn`
  * event callback: `submit_event_cb(lv_obj_t * submit_btn, lv_event_t submit_event)`
* Mouse pointer object
  * driver: `lv_indev_drv_t indev_drv_mouse`
  * mouse pointer: `lv_obj_t * cursor_obj`
  * read the mouse input: `my_input_read(lv_indev_drv_t * drv, lv_indev_data_t*data)`
* Popup the message box
  * `popupMessage(const char* innerText)` 
      

To begin, add the LVGL library and the variables that we will need.
```cpp
   #include <Portenta_LittleVGL.h>

   int16_t mouseX = 0;            // Mouse coord X
   int16_t mouseY = 0;            // Mouse coord Y
   uint8_t mouseButtons = 0;      // Mouse buttons
   bool textAreaFocused = false;  //Know when the text area is focused, so it allows to input trough the keyboard
```

Then declare the widgets and events from the list below.
```cpp
   //Create all the widgets and configure them
   void createWidgets();
   
   //Popup message creator, it will create the message with the custom text, and a button to close that popup
   void popupMessage(const char* innerText);
   
   //Widgets objects and events
   //Text area
   static lv_obj_t * textArea;
   static void textAreaEventHandler(lv_obj_t * textArea, lv_event_t textAreaEvent);

   //Submit button, it will create a popup message with the text from the text area
   static lv_obj_t * submitButton;
   static void submitButtonEventHandler(lv_obj_t * submitButton, lv_event_t submitEvent);

   //Launch keyboard button, in case you dont connect any usb keyboard to the portenta, you can write with the screen keyboard from LVGL
   static lv_obj_t * launchButton;
   static void launchButtonEventHandler(lv_obj_t * launchButton, lv_event_t buttonEvent);

   //LVGL's keyboard widget, virtual on-screen keyboard
   static lv_obj_t * keyboard;
   static void keyboardEventHandler(lv_obj_t * keyboard, lv_event_t keyboardEvent);
   static void keyboardCreate();

   //Mouse driver, gets the mouse data and interact with the rest of the widgets
   static lv_indev_drv_t mouseIndevDriver;
   static lv_obj_t * mouseCursor;
   bool mouseRead(lv_indev_drv_t * mouseIndevDriver, lv_indev_data_t * data);
```

### Move to define each function from above
`createWidgets()`
```cpp
   void createWidgets() {
     // Mouse pointer driver init
     lv_indev_drv_init(&mouseIndevDriver);
     mouseIndevDriver.type = LV_INDEV_TYPE_POINTER;
     mouseIndevDriver.read_cb = mouseRead;
     lv_indev_t * my_indev_mouse = lv_indev_drv_register(&mouseIndevDriver);

     // Mouse pointer
     mouseCursor = lv_label_create(lv_scr_act(), NULL);
     lv_label_set_text(mouseCursor, LV_SYMBOL_GPS);
     lv_indev_set_cursor(my_indev_mouse, mouseCursor); // connect the object to the driver

     //Submit button
     submitButton = lv_btn_create(lv_scr_act(), NULL);
     lv_obj_align(submitButton, NULL, LV_ALIGN_CENTER, 185, -150);
     lv_obj_set_event_cb(submitButton, submitButtonEventHandler);
     //Text for the submit button
     lv_obj_t * submitButtonText = lv_label_create(submitButton, NULL);
     lv_label_set_text(submitButtonText, "Submit");

     //Launch keyboard button
     launchButton = lv_btn_create(lv_scr_act(), NULL);
     lv_obj_set_event_cb(launchButton, launchButtonEventHandler);
     lv_obj_align(launchButton, NULL, LV_ALIGN_CENTER, 185, -100);
     lv_obj_t * launchButtonText = lv_label_create(launchButton, NULL);
     lv_label_set_text(launchButtonText , LV_SYMBOL_KEYBOARD);

     //Text Area
     textArea = lv_textarea_create(lv_scr_act(), NULL);
     lv_obj_set_size(textArea, 200, 100);
     lv_obj_align(textArea, NULL, LV_ALIGN_CENTER, 0, -120);
     lv_textarea_set_placeholder_text(textArea, "LVGL and Arduino PRO");
     lv_textarea_set_text(textArea, "");    /*Set an initial text*/
     lv_obj_set_event_cb(textArea, textAreaEventHandler);
     lv_textarea_set_cursor_click_pos(textArea, true);
     lv_textarea_set_cursor_hidden(textArea, true);
     lv_textarea_set_text_sel(textArea, true);
   }
```

Followed by the **popup message box** creator
`popupMessage`
```cpp
   // popup message creator, with custom text in the parameters
   void popupMessage(const char* innerText) {
     static const char * options[] = {"OK", ""}; //Button matrix, second space empty
     innerText += '\0';

     /* Create the message box as a child of the modal background */
     lv_obj_t * messageBox = lv_msgbox_create(lv_scr_act(), NULL);
     lv_msgbox_add_btns(messageBox, options);
     lv_msgbox_set_text(messageBox, innerText);
     lv_obj_align(messageBox, NULL, LV_ALIGN_CENTER, 0, 0);
   }
```

Now each event handler from the **Buttons**

Launch Button with the event handler `launchButtonEventHandler` will be launch the virtual keyboard ben pressed
```cpp
   // Launch keyboard button callback, it will create a keyboard to interact with the text area
   static void launchButtonEventHandler(lv_obj_t * launchButton, lv_event_t launchButtonEvent) {
     if (launchButtonEvent == LV_EVENT_CLICKED) {
       keyboardCreate();
     }
   }
```

Submit Button with the event handler `submitButtonEventHandler` will popup a message box with the content from the text field
```cpp
   // Submit button callback, it will send the content from the text area to a new popup message
   static void submitButtonEventHandler(lv_obj_t * submitButton, lv_event_t submitButtonEvent) {
     if (submitButtonEvent == LV_EVENT_CLICKED) {
       const char * newText = lv_textarea_get_text(textArea) ;  //the text in the message box
       popupMessage(newText);
     }
   }
```

The **keyboard** functions

Event handler `keyboardEventHandler` gets if the cancel (Cross) button or the accept (tick) button are pressed, and remove the keyboard if cancel or do the same as the submit button if accept

```cpp
   // LVGL's keyboard widget callback, its not needed to configure each KEY, just we add the feature to exit and submit from the keyboard, with the cross and tick buttons (cancel button, and confirm button)
   static void keyboardEventHandler(lv_obj_t * keyboard, lv_event_t keyboardEvent) {
     lv_keyboard_def_event_cb(keyboard, keyboardEvent);
     if (keyboardEvent == LV_EVENT_CANCEL) {
       lv_keyboard_set_textarea(keyboard, NULL);
       lv_obj_del(keyboard);
       keyboard = NULL;
     } else if (keyboardEvent == LV_EVENT_APPLY) {
       const char * newText = lv_textarea_get_text(textArea) ;  //the text in the message box
       popupMessage(newText);
     }
   }
```

Defining the `keyboardCreate()` to launch the keyboard on-screen when the launch button is pressed
```cpp
   //Create keyboard widget
   static void keyboardCreate(void) {
     keyboard = lv_keyboard_create(lv_scr_act(), NULL);
     lv_keyboard_set_cursor_manage(keyboard, true);
     lv_obj_set_event_cb(keyboard, keyboardEventHandler);
     lv_keyboard_set_textarea(keyboard, textArea);
   }
```

For the **text field** we are looking if the user is focused on the text area by clicking it, if so we will allow to the **USB keyboard** to input characters
```cpp
   //This event handler callback, used to know when the Text area is being focused by the user, so it allows the usb keyboard to interact with it
   static void textAreaEventHandler(lv_obj_t * textArea, lv_event_t textAreaEvent) {
     if (textAreaEvent ==  LV_EVENT_FOCUSED) {
       textAreaFocused = true;
       lv_textarea_set_cursor_hidden(textArea, false);
     } else if (textAreaEvent ==  LV_EVENT_DEFOCUSED) {
       textAreaFocused = false;
       lv_textarea_set_cursor_hidden(textArea, true);
     }
   }
```

The last, the mouse pointer for the LVGL mouse driver, save the data of the coordinates of the cursor(mouseX and mouseY) and the buttons that are being pressed (mouseButtons)
```cpp
   //Function to get the data from the Mouse, to the LVGL's mouse driver
   bool mouseRead(lv_indev_drv_t * mouseIndevDriver, lv_indev_data_t * data) {
     static uint32_t lastButton = 0;   /*Store the last pressed button*/
     int buttonPressed = mouseButtons - 1;        /*Get the ID (0,1,2...) of the pressed button*/

     data->point.x = mouseX;
     data->point.y = mouseY;

     //If left mouse button is being clicked
     if (btn_pr >= 0) {              /*Is there a button press? (E.g. -1 indicated no button was pressed)*/
       lastButton = buttonPressed;           /*Save the ID of the pressed button*/
       data->state = LV_INDEV_STATE_PR;  /*Set the pressed state*/
     } else {
       data->state = LV_INDEV_STATE_REL; /*Set the released state*/
     }

     data->btn_id = lastButton;            /*Save the last button*/

     return false; /*No buffering now so no more data read*/
   }
```

## 4. Add the Mouse and Keyboard receivers

To finish the sketch the file define the RPC calls from the M4
by going to `lvgl_interaction.ino` after the `loop()` function

The **USB keyboard** callback ´onKey´ will check if the Text area is focused, if so it will add the character from the key that has been pressed
```cpp
   //Keyboard callback, in case the Text area is focused (mouse clicked in it) it can bypass the input to it 
   void onKey(char ch) {
     if (textAreaFocused) {
       lv_textarea_add_char(textArea, ch);
     }
   }
```

The **USB mouse** callback ´onMouse´ will save the coordinates and the buttons pressed
```cpp
   // Mouse callback, store the mouse vector that is going to be used by LVGL's mouse driver
   void onMouse(uint8_t buttons, int8_t x, int8_t y) {
     mouseX += x;
     mouseY += y;
     if (mouseX < 0) {
       mouseX = 0;
     }
     if (mouseY < 0) {
       mouseY = 0;
     }
     mouseButtons = buttons;
   }
```

The last one will initialize RPC and attach the RPC messages from the M4 to a function inside the M7, called `initInputs`
```cpp
   // init RPC an attach the RPC messages to the functions
   void initInputs() {
     RPC1.begin();
     RPC1.bind("on_mouse", onMouse);
     RPC1.bind("on_key", onKey);
   }
```
