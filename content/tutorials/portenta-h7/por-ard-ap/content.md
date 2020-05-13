
# Portenta H7 as a WiFi Access Point
Portenta H7 comes with an on-board WiFi and a bluetooth Module that allows to develop IoT applications that require wireless connectivity and Internet access. Turning the board into an access point allows it to create a WiFi network on its own and allows other devices to connect to it. In  this tutorial you will learn to set up your board as an access point web server and remotely control the red, green and blue LEDs on the built-in RGB LED by accessing an HTML page on your mobile device’s browser. 

## What you will learn
-   About the built-in WiFi + Bluetooth module.
-   How a  client-server model works 
-   How to create an HTTP communication channel between the board and an external device. 

## Required hardware and software
-   Portenta H7 board (<https://store.arduino.cc/portenta-h7>)
-   One USB C cable (either USB A to USB C or USB C to USB C)
-   Arduino IDE 1.8.10+  or Arduino Pro IDE 0.0.4 +
-   A smart phone

# Access Point Configuration
The Portenta H7 features a  [Murata 1DX](https://wireless.murata.com/type-1dx.html), which is  a high performance chipset which supports  WiFi 802.11b/g/n + Bluetooth 5.1 BR/EDR/LE up to 65Mbps PHY data rate on WiFi and 3Mbps PHY data rate on Bluetooth. This module helps to configure the Portenta into three different modes of operation -  an Access Point,  a Station, or both. In this tutorial we will only focus on the access point configuration.

When the  board is configured to operate as an access point, it can create its own wireless LAN ( WLAN ) network. In this mode, the board transmits and receives signals at 2.4 GHz allowing other electronic devices with WiFi capabilities using the same bandwidth to connect to the board.

With the access point set up you create a client server architecture where the board provides a web server communicating with the client devices over HTTP. The connected devices can then make HTTP GET requests to the server to retrieve web pages served by the web server on the board. This makes the Portenta H7 an ideal board for developing IoT solutions where external client devices can send and receive information while more complex processing tasks take place on the server.

![A client device communicating with the Portenta H7 through HTTP ](assets/por_ard_ap_tutorial_core_topic.svg?sanitize=true)

# Setting up the web server
In this tutorial you are going to convert the board into an access point and use it to set up a web server which provides a HTML webpage. This page contains buttons to toggle the red, green and blue colour of the built-in LED.  You will then connect your mobile device to this access point and access this web page through the browser on your mobile phone. Once retrieved, you will be able to control the state of the red, green and blue LED on the built-in RGB LED from your mobile device. 

![A mobile device controlling the different LEDs on the board ](assets/por_ard_ap_tutorial_overview.svg?sanitize=true)

## 1.   The Basic Setup
Begin by plugging in your Portenta board to your computer using a USB-C cable and open the  Arduino IDE or the Arduino Pro IDE. If this is your first time running Arduino sketch files on the board, we suggest you check out how to [set up the Portenta H7 for Arduino](https://www.arduino.cc/pro/tutorials/portenta-h7/por-ard-gs) before you proceed. 

![The Portenta H7 can be connected to the computer using an appropriate USB-C cable](assets/por_tut1_im1.png)

## 2. Create the Web Server Sketch
Next we need to create a web server sketch that will handle the HTTP GET requests and provide the client devices with the HTML web page. The [Wifi.h](https://www.arduino.cc/en/Reference/WiFi) library provides all necessary methods that allows Arduino boards to use their WiFi features provided by the on-board WiFi module. To set up the web server copy the following code, paste it into a new sketch file and name it **simpleWebServer.ino**. 

This sketch describes how the server will handle an incoming HTTP GET request from a client, both to request the HTML web page from the server and the requests to change the LED states using dedicated URLs. 

Here the web page is just a simple HTML page with buttons to toggle the LED states.  The way in which the web page works is: Whenever a button on the web page is pressed, the client device (in this case your phone) sends a HTTP GET request to a URL denoted by a letter, in this case H or L (H stands for HIGH, L stands for LOW) followed by the LED color that should be turned on or off r, g or b. For example to turn on the red LED the URL is /Hr . Once the server receives this request it changes the corresponding LED state, closes the connection and continues to listen to next requests. 

![The sequence of actions in the tutorial’s client-server model](assets/por_ard_ap_sketch_explanation.svg?sanitize=true)

*** **Note: **  Remember that the built-in RGB LEDs  on the Portenta H7 need to be pulled to ground to make them light up. This means that a voltage level of LOW on each of their pins will turn the specific color of the LED on, a voltage level of HIGH will turn them off.***

## 3. Create the arduino_secrets.h tab  

A good practice is to have sensitive data like the SSID and the password required to identify and connect to a certain network within a separate file. Click on the arrow icon below the Serial Monitor button and open a new tab in the Arduino IDE. This will create a new file.

![Open a new tab on the IDE](assets/por_ard_ap_new_tab.png?sanitize=true)

Name the file **arduino_secrets.h** and click OK.

![Name the new tab as arduino_secrets.h the IDE](assets/por_ard_ap_new_tab_name.png?sanitize=true)

Once you’ve created the new tab, you will see an empty page in the IDE. Define two constants `SECRET_SSID`  and `SECRET_PASS` that will hold the name of the WiFi network and the corresponding password. Add the following lines to your **arduino_secrets.h** file:

```cpp
# define SECRET_SSID "PortentaAccessPoint"
# define SECRET_PASS "123Qwerty"
```

*** **Note: ** The SSID (PortentaAccessPoint) and password (123Qwerty) are placeholder strings made for this tutorial. For security reasons you should rename them to something memorisable but not easy to guess. *** 

In order to access the `SECRET_SSID` and `SECRET_PASS` constants in the **simpleWebServer.ino** sketch file, you need to include the header file that you’ve just created. Add the following line to the beginning of **simpleWebServer.ino** sketch file: 

```cpp
# include “arduino_secrets.h”
```

![Including the header file arduino_secrets.h in the sketch file](assets/por_ard_ap_add_headerfile.png?sanitize=true)

## 4. Upload the Code 

Select the **Arduino Portenta H7 (M7 core)** from the **Board** menu and the port the Portenta is connected to. Upload the **simpleWebServer.ino** sketch. Doing so will automatically compile the sketch beforehand.

![Uploading the SimpleWebServer.ino to the Portenta](assets/por_ard_ap_upload_code_m7.png?sanitize=true)

Once you've uploaded the code, open the serial monitor. You will be able to see the IP address of the access point. You will also see the message, `Device disconnected from AP` which means there are no devices connected to the Access point yet.  

![Serial monitor displaying the details of the Access point](assets/por_ard_ap_open_serial_monitor.png?sanitize=true)

## 5. **Connecting to the Portenta Access Point** 

Once the access point is active and ready to be connected with external devices, you will be able to find the **PortentaAccessPoint** on the list of networks on your mobile device. Once you have entered the password you have defined earlier, your smart phone will connect to access point. 

![PortentaAccessPoint shown on the list of available network devices](assets/por_ard_ap_find_ap.png?sanitize=true)

Now open a browser window on your mobile device and copy & paste the URL containing Portenta’s IP address that is displayed on the serial monitor. 

![*The URL containing the IP address of the access point displayed in the serial monitor* ](assets/por_ard_ap_copy_ip_address.png?sanitize=true)

Once you’ve entered the URL, the client sends a GET request to the web server to fetch the HTML web page specified in the code. Once loaded you will see the web page in your mobile browser. 

![The HTML web page accessed on your mobile browser](assets/por_ard_ap_access_webpage.png?sanitize=true)

## 6. Access the Board From your Mobile Device

If you take a look at the serial monitor, you can see the details of the HTTP GET request and other details of the device connected to the access point. The GET request is always in the following format: 

```cpp
GET URL HTTP/1.1
```

The URL is a string of characters sent to the server, in this case /Hx (where x stands for the color of the LED). This request containing the URL is received on the server and it replies with the following HTTP/1.1 response indicating that the connection was successful:

```cpp
HTTP/1.1 200 OK
```

Once the server has responded to this request, it closes the connection and continues listening to next GET requests. 

![The client details displayed on the serial monitor](assets/por_ard_ap_client_details.png?sanitize=true)

You’re now be able to toggle the states of the red, green and blue LED through the buttons displayed on your mobile browser. Everytime you press a button, the client sends a GET request to a URL in the format /Hx or /Lx ,where x can be ‘r’, ‘g’ or ‘b’, depending on the button pressed on the HTML page. The web server then reads the URL requested by the client, changes the state of the LED corresponding to the URL and closes the connection. 

![The GET request details displayed in the serial monitor](assets/por_ard_ap_toggle_LEDS.png?sanitize=true)

# Conclusion

This tutorial shows one of the several capabilities of the on-board WiFi+Bluetooth module by configuring the board as an access point and setting up a web server. You have also learnt how a simple client-server model and the underlying HTTP requests and responses work. 

# Next Steps 

Now that you've learnt how to set up a board as an access point and understand the client-server model, start experimenting with the **simpleWebServer.ino** sketch. This sketch can be tweaked in a variety of ways based on your needs. For example, you can add a slider to the HTML page that changes the blink rate of the built-in RGB LED from your mobile device.

**Author :** Lenard George.  <br>**Reviewed by :** Jose Garcia [2020-04-23].  <br>**Last revision:** Sebastian Hunkeler [2020-05-07]. <br>