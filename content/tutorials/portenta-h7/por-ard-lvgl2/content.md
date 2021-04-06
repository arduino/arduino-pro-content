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
-   USB-C hub with HDMI ([The one used to build this tutorial](https://www.dustinhome.se/product/5011166993/travel-port-usb-c-total))
-   External monitor 
-   HDMI cable 
-   USB Mouse
-   USB Keyboard (optional)


# The implementation of interaction...

Usually what makes the difference when using GUIs between each other, is how the user can interact and manipulate the data and how the user feels the way of communicating trough the GUI.

In order to be more handful computer use peripherals like the mouse or the keyboard, in this case, by using LVGL you can use them, but also you can use other components such as rotary encoders, keypads, buttons and much more that connected to your Portenta will allow you to create iterations as custom as your project need.

# Making the interactive GUI 

This tutorial will guide you to program the Portenta M4 and M7 processors to build a basic user interface using the LVGL, the USBhost and the RPC Libraries that you will have to download using the Arduino Library Manager. While going through this tutorial you will:

1. Upload a sketch file to the Portenta **M4 processor** to get the data from the USB inputs (mouse and keyboard) trough the USB hub.
2. Upload a sketch file to the Portenta **M7 processor** to draw the interface, this sketch will also receive data from the M4 processor trough RPC with the information acquired via the USB inputs.
3. Use an USB-HUB to connect an external monitor, a mouse and/or keyboard and to power the Portenta.

Once the USB-HUB is powered externally, a graphical user interface with a button and a text-area will be displayed on the screen, then you will be able to interact with those items (widgets) by using the mouse and the keyboard connected to the USB-HOST.

![por_ard_lvgl_tutorial_steps](assets/por_ard_lvgl_tutorial_steps.svg)

## 1. The structure of the processors and sketches

As introduced above, the interface will use both of the cores of the Portenta board (M4 and M7). It means that you will need to upload different sketches to the each one of the cores:

   * M4
      * lvgl_mouse_m4.ino - getting the input data from mouse and/or keyboard and sending it through RPC to the M7 
   * M7
      * lvgl_interaction.ino - call the widgets.h and inputs.h custom made functions for the receiving data from the M4, and display the LVGL output
      * widgets.h - all the LVGL widgets on screen and events/callbacks of them, plus LVGL's mouse driver

> **Note:** Check the [Dual Core Processing tutorial](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-dcp) for more info about how to program and access to the cores of Portenta

## 2. Create the structure and getting started

In order to create the interface, let's start programming the Portenta M7 processor, to do so you will need to create some files. First, create a new file called "lvgl_interaction.ino" and include the following libraries:

```cpp
   #include "RPC_internal.h"
   #include "USBHost.h"
   #include "widgets.h"
```

Then, in the `setup()` you need to initialise some needed features (Video driver, LVGL, Inputs)
```cpp
   void setup() {
     // put your setup code here, to run once:
     Serial1.begin(115200);
     initInputs();
     portenta_init_video();
     createWidgets();
   }
```
Later on, let's define `initInputs()` to initialise the RPC for the **USB Mouse and Keyboard**, and `createWidgets()` to have in place the entire interface.

Then, the `loop()` function will be focusing on the LVLG's task handler to update the screen with the content and displaying the changes and events happening on it.

```cpp
   void loop() {
      // put your main code here, to run repeatedly:
      lv_task_handler();
   }
```

> **Note:** In order to be able to update the screen and the task manager, we must include the `lv_task_handler();` function inside the `loop()` function.



## 3. Creating the interface

Once we have the main structure of the program filled, let's go now to create the screen interface in a new tab called "widgets.h". This interface will show on the screen a text field - where users can visualize the text inputs from the keyboard- and two buttons, the "submit" button that will throw a popup box with the text visualized on the text field, and the other that will launch a virtual keyboard from LVGL allowing the user to fully interact with the interface by using just a mouse.

### LVGL widget's events
To understand the logic behind the LVGL interface, you need to know that it works with **callbacks**, also called **event handlers**, which are functions that are triggered when a specific event happens, e.g. the `myButtonEventHandler` function will be called when there has happened a mouse click over a widget on the screen. 

The widgets can be attached to custom callbacks by using the command `lv_obj_set_event_cb( WIDGET, CALLBACK() )`

> **Note:** Sometimes depending on the widget, the event that triggers the callback needs to be defined inside the *event callback* (Look inside `keyboardEventHandler`, it has `lv_keyboard_def_event_cb` to attach the *EVENT* to the current callback)

When you attach a callback using `lv_obj_set_event_cb( WIDGET, EVENT_HANDLER )` , you are letting LVGL know that the widget introduced as parameter has linked a function that is going to handle (according to the EVENT_HANDLER stack) what happens when the trigger is activated. Such EVENTS could be:

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
[image, with the interface labeled with the names]()

Now that you know the logic behind the LVGL callbacks, let's start programming the interface by creating the "widgets.h" tab in the  `lvgl_interaction.ino` sketch. 

It is time now to know what is needed in order to make the interface work, this part contains the functions, LVGL widgets, configuration, events and callbacks:

* Draw the widgets on screen 
  * createWidgets() : This will instantiate all the widgets 
* Text Area (text input to fill)
  * object: `lv_obj_t * textArea`
  * event callback: `event_handler_textArea(lv_obj_t * textArea, lv_event_t textAreaEvent)`
* Submit button
  * object: `lv_obj_t * submitButton`
  * event callback: `submit_event_cb(lv_obj_t * submitButton, lv_event_t submitEvent)`
* Launch Keyboard button
  * object: `lv_obj_t * launchButton`
  * event callback: `submit_event_cb(lv_obj_t * launchButton, lv_event_t buttonEvent)`
* Virtual Keyboard (from LVGL)
  * object: `lv_obj_t * keyboard`
  * event callback: `keyboard_event_cb(lv_obj_t * keyboard, lv_event_t keyboardEvent)`
  * draw it on screen: `keyboard_create()`
* Mouse pointer object
  * driver: `lv_indev_drv_t mouseIndevDriver`
  * mouse pointer: `lv_obj_t * mouseCursor`
  * read the mouse input: `mouseRead(lv_indev_drv_t * mouseIndevDriver, lv_indev_data_t * data)`
* Popup the message box
  * `popupMessage(const char* innerText)` 
    

Now that you know what are the steps you need to follow, let's begin by adding the LVGL library and the variables that will be need.
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

### Defining each one of the function declared above
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

Followed by the **popup message box** creator:
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

Now each event handler for each one of the **Buttons**:

Launch Button with the event handler `launchButtonEventHandler` will launch the virtual keyboard when the user press it.
```cpp
   // Launch keyboard button callback, it will create a keyboard to interact with the text area
   static void launchButtonEventHandler(lv_obj_t * launchButton, lv_event_t launchButtonEvent) {
     if (launchButtonEvent == LV_EVENT_CLICKED) {
       keyboardCreate();
     }
   }
```

Submit Button with the event handler `submitButtonEventHandler` will popup a message box with the content from the text field.
```cpp
   // Submit button callback, it will send the content from the text area to a new popup message
   static void submitButtonEventHandler(lv_obj_t * submitButton, lv_event_t submitButtonEvent) {
     if (submitButtonEvent == LV_EVENT_CLICKED) {
       const char * newText = lv_textarea_get_text(textArea) ;  //the text in the message box
       popupMessage(newText);
     }
   }
```

The **keyboard** functions:

Event handler `keyboardEventHandler` gets if the cancel (Cross) button or the accept (tick) button are pressed, and remove the keyboard if cancel or do the same as the submit button if accept.

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

Defining the `keyboardCreate()` to launch the keyboard on-screen when the launch button is pressed.
```cpp
   //Create keyboard widget
   static void keyboardCreate(void) {
     keyboard = lv_keyboard_create(lv_scr_act(), NULL);
     lv_keyboard_set_cursor_manage(keyboard, true);
     lv_obj_set_event_cb(keyboard, keyboardEventHandler);
     lv_keyboard_set_textarea(keyboard, textArea);
   }
```

For the **text field** we are looking if the user is focused on the text area by clicking it, if so we will allow to the **USB keyboard** to input characters.
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

To finish with the functions, the mouse pointer for the LVGL mouse driver, save the data of the coordinates of the cursor(mouseX and mouseY) and the buttons that are being pressed (mouseButtons)
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

To finish the sketch you'll need to define the RPC calls from the M4, to do so, in the `lvgl_interaction.ino` tab, after the `loop()` function, you need to add:

The **USB keyboard** callback `onKey` that will check if the Text area is focused, if so it will add the character from the key that has been pressed.

```cpp
   //Keyboard callback, in case the Text area is focused (mouse clicked in it) it can bypass the input to it 
   void onKey(char ch) {
     if (textAreaFocused) {
       lv_textarea_add_char(textArea, ch);
     }
   }
```

The **USB mouse** callback `onMouse` that will save the coordinates and the buttons pressed.

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

and the `initInputs` that will initialize RPC and attach the RPC messages from the M4 to a function inside the M7.

```cpp
   // init RPC an attach the RPC messages to the functions
   void initInputs() {
     RPC1.begin();
     RPC1.bind("on_mouse", onMouse);
     RPC1.bind("on_key", onKey);
   }
```

With this you are done with the sketch, now it is time to compile it and upload it to the Portenta M7 processor. Once you are done, let's start with the sketch that gets the inputs from the mouse and the keyboard connected to the USB-HOST, all this will be handled but the Portenta M4 processor.

## 4. Creating the Mouse and Keyboard RPC senders

Following the structure above, the **Portenta M4** will handle the USB inputs (mouse and keyboard) and send the required data to the **Portenta M7** using **RPC**. To program this workflow let's create a new sketch called *lvgl_mouse_m4.ino*.

The sketch will contain the next functions
* Mouse
    * `mouseCallback(tusbh_ep_info_t* ep, const uint8_t* mouse)`  
        This function handle the mouse buttons and the relative change of position
* Keyboard
    * `keyboardCallback(tusbh_ep_info_t* ep, const uint8_t* keys)`  
        Get the input keys, proccess them and send the correct character.

> **Note**: These functions are defined in the `Portenta_USBhost.h` wrapper because it needs to be defined for the USB API structure of the USB library, defining them is needed to create the logic of those events.

### Including the needed libraries

At the beginning of the sketch, let's include RPC library and the USB host wrapper that reduces the extra needed code. Then it is needed to use an `#ifndef` statement to ensure the sketch upload to the M4 (in case you didn't select the correct Core it will print a compile error)

```cpp
    #include "Portenta_USBhost.h"
    #include "RPC_internal.h"

    #ifndef CORE_CM4
    #error "This sketch should be compiled for Portenta (M4 core)"
    #endif
```

### Initialization

Inside the `setup()` function let's initialise the USB protocol and look for the connected USB hub

```cpp
    void setup() {
        // put your setup code here, to run once:
        USBhost_init();
        RPC.begin();
    }
```
### Mouse handler

To finish, it is needed that to create  some new functions outside the `loop()`function, that in this sketch will be empty.

The first function that will be created is the one that get's the data from the mouse, this data will be split in 3 bytes:
* byte 1: Mouse buttons
* byte 2: Mouse X relative position
* byte 3: Mouse Y relative position

```cpp
    static int mouseCallback(tusbh_ep_info_t* ep, const uint8_t* mouse) {
        uint8_t btn = mouse[0];
        int8_t x = ((int8_t*)mouse)[1];
        int8_t y = ((int8_t*)mouse)[2];
        RPC1.call("on_mouse", btn, x, y);
    }
```

### Keyboard Handler

The second function to be created is the `parseKeyboardInput` function, it will get the character of the pressed key, then will send the data to the **M7 processor** using a **RPC call**

```cpp
  static int keyboardCallback(tusbh_ep_info_t* ep, const uint8_t* keys)
  {
    char sendCharacter;
    sendCharacter = parseKeyboardInput(keys);
    RPC1.call("on_key", sendCharacter);
    return 0;
  }
```

Once these functions have been added, the sketch is finished, it is time now to upload it to the Portenta M4 Processor.

## Testing it out

After uploading both of the sketches to each one of the processors of the Portenta board, you will need to set the following connections:

![Connection schema](assets/por_ard_lvgl_cover.svg)

Once the USB-HUB is powered externally, a graphical user interface with a button and a text-area will be displayed on the screen, then you will be able to interact with those items (widgets) by using the mouse and the keyboard connected to the USB-HOST.

## Conclusion

This tutorial shows how to build a simple user interface programming both cores of your Portenta and interact with it by connecting a mouse and/or a keyboard to it. While going through the tutorial you have created a different widgets that allow the user to interact with them, but also learnt how the the callbacks that handle the different events triggered by the peripherals work.

## Next steps

Now that you know how to build widgets that update and show text on the screen and that react to the mouse clicks, you can add more of them to show various information or try out different LVGL widgets.

**Authors:** Pablo Marquínez, Jose Garcia
**Reviewed by:** Jose Garcia [2021-03-21]
**Last revision:** 
