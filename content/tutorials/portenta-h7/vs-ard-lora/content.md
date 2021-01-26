# Vision Shield Lora Connectivity for Portenta H7
This tutorial explains how to connect your Portenta H7 to The Things Network (TTN) through the Vision Shield Lora Connectivity. A data communication channel will be enabled between Portenta H7 and a TTN application that will be configured in your TTN console.

## What You Will Learn
-   What LoRaWAN® and TTN are
-   To create a The Things Network (TTN) account.
-   To obtain the device's EUI and App Key
-   How to setup your Portenta H7 and Vision Shield Lora Connectivity to establish a connection with TTN.
-   Send a payload from our device to the TTN.
-   Decode the payload from hexcode to text.
-   To improve the bandwidth usage

## Required Hardware and Software
-   [Portenta H7 board](https://store.arduino.cc/portenta-h7)
-   Vision Shield (Lora Connectivity)
-   1x antenna ([link to store](https://store.arduino.cc/antenna)).
-   Arduino IDE ([online](https://create.arduino.cc/) or [offline](https://www.arduino.cc/en/main/software))
-   An account on [The Things Network (TTN)](https://www.thethingsnetwork.org/)
-   To be within range (10 Km) from an available Lora Gateway. Check availability on [The Things Network map](https://www.thethingsnetwork.org/map)
-   [MKRWAN](https://www.arduino.cc/en/Reference/MKRWAN) library installed.
-   1x micro USB cable.

# LoraWAN and The Things Network

LoRaWAN™, stands for **Long Range Wide Area Network**, which is becoming increasingly popular in the Internet of Things-sphere, due to its capability of sending data over larger distances using minimal battery power and ensuring that data and credentials remain secure. There are also other acronyms that are associated with LoRaWAN™ such as:

- LoRa® which stands for Long Range
- LP WAN which stands for Low Power Wide Area Network

The LoRaWAN™ technology allows things to talk to the Internet without WiFi or 3G / 4G. This means that our Portenta H7 when attached to the Vision Shield (Lora Connectivity), is able to communicate with an online application without relying on WIFI or mobile networks. Instead, our devices connect to an available Lora Gateway to communicate with the internet. As you can see in the [map](https://www.thethingsnetwork.org/map), there are thousands of available gateways all over the world.

As we will see at the end of this guide, data rates may be a restriction, but now let’s have a look at some of the amazing features LoRa® technology comes with:

- **Long range:** Up to 5km in an urban setting, 10km in suburban and up to 80km undisrupted.

- **Power consumption:** Portenta H7 consumes as little as 2.95 μA in Standby mode when configured properly.

- **Security:**  Portenta H7 board comes with a secure element ([NXP SE0502](https://content.arduino.cc/assets/Arduino-Portenta-H7_Datasheet_NXP-SE050.pdf)), which allows us to store data and credentials securely.

Now that we have introduced the communication channel (LoRaWAN™), a platform that interconnects the devices, gateways and online applications is required. For this, The Things Network (TTN) is the most known global platform. TTN is a decentralized and collaborative network that provides thousands of gateways (connection points) around the world. So, we will be using TTN to connect our Portenta H7 and Vision Shield Lora to the internet.

# Configuring the Development Environment
In this section, we will guide you through a step-by-step process of setting up your Portenta board and Vision Shield Lora to communicate with a TTN application.

As stated before, to be able to follow this guide, you need to be under coverage of one of the TTN gateways. You can check for the coverage now if you have not done so yet. If you are not in rage you'll need to build up your own gateway (find help to do so here).

## 1. Create an account and your first app on TTN
Just point your browser to www.thethingsnetwork.org and use the Sign Up button to setup an account. Otherwise just sign in.

Next, then fill all the required fields to complete a new registration (skip this step if you already have a TTN account):

Once done, log to your [console](https://console.thethingsnetwork.org).

In your console you will be able to:

1. Register a new gateway or manage your own. Of course you can use for free one of the thousands of gateways around the world already running!
2. Create or manage your applications: an application is the way to aggregate data from different devices, and then use these data with other online / offline tools.

The setup and configuration of a gateway is not the aim of this guide, so let's proceed selecting APPLICATIONS

Here you'll have listed all your applications. Now create your first app by pressing the "add application" link or "Get started by adding one!"

You have now to fill only the first two fields:

* The first one is the **ID** of your app: this must be lowercase and without spaces.
* The second one is a **Description** of your app, and there's no restrictions on formatting

After completing these two fields, press on the "Add application" button located at the bottom right corner of the page.

After that, the loaded page will show you an overview of the newly created app. Let's see the sections:

* Application Overview and Application EUIS: in order to use this app, you'll need the Application ID and its EUIs.

> Each EUI is a globally unique identifier for networks, gateways applications and devices. The EUIs are used to identify all parts of the LoRaWAN inside the backend server.

* Devices: here you can see and manage all the associated devices (e.g. your Portenta H7 with Vision Shield Lora, Arduino MKR WAN 1300 or MKR WAN 1310), or proceed with the registration of new one.

* Collaborators: here you can see and manage all the app collaborators. To integrate with other collaborative platforms or to manage access rights to the app with other TTN registered profiles.

* Access keys: it's the most sensible information. It is basically the key to gain access to your app, so keep it safe. At the right, there's a little button that allows you to copy the Access Key.

## 2. First registration on TTN
It's now time to connect your Arduino Portenta H7 and Lora Vision Shield to TTN. You'll need to upload code to the board, so as you porbably already know, there are two options:

* Use the [Arduino Web Editor](https://create.arduino.cc/editor) (this is the option this guide will follow)
* Use the [Arduino IDE](https://www.arduino.cc/en/software), this way requires manual installation or updating the Arduino core and libraries.

After connecting your Arduino to the usb port, be sure to have selected the right board "Arduino Portenta H7 (M7 core)" and the right port.

The first code you need to upload and run is from the **MKRWAN** library , and its name is _FirstConfiguration_.

The only line you may need to change before uploading the code is the one that sets the frequency:

```
... // change this to your regional band (eg. US915, AS923, ...)
 if (!modem.begin(EU868)) {    ...
```

Update the frequency code according to your country. You can find more information about frequency by country at [this TTN link](https://www.thethingsnetwork.org/docs/lorawan/frequency-plans.html).

Please, consider that in Australia the boards connect correctly to TTN gateways on AS923 frequencies; AU915 frequencies requires the selection of sub band 2, not yet implemented in the firmware.

Once the sketch completes upload, open the Serial Monitor. The following details will show:

```
Your module version is: ARD-078 1.1.9
Your device EUI is: a8xxxxxxxxxxxx0a
Are you connecting via OTAA (1) or ABP (2)?
```

### Device Registration on TTN
Now we need to go back to our TTN dashboard and open the "Register Device" page. Click on "register device" link at the top of the Devices section.

On the page that shows up we must fill in two fields:

* The first one is the ID of your device: this must be lowercase and without spaces; the ID should be unique, so you can use i.e. the name of the board followed by the first and the last byte of the EUI
* The second one is the EUI: this is exactly the device EUI appeared in the Serial Monitor! So copy that value into this

After pressing the Register button, it will show the Device Overview page. You can now see all the information needed to complete the Arduino setup.

Let's come back to the Serial Monitor and proceed. It will ask for:

* activation mode (that in this case is OTAA),
* the Application EUI
* the App Key.

You can copy these details by clicking on the small icon at the end of the relative rows in the TTN device page.

```
Your module version is: ARD-078 1.1.9
Your device EUI is: a8xxxxxxxxxxxx0a
Are you connecting via OTAA (1) or ABP (2)?
Enter your APP EUI
Enter your APP KEY
```

We will connect via OTAA so, to complete the first question we enter "1" in the serial monitor input box and press ENTER.

>You can go deep into OTA vs ABP activation mode at [this link](https://www.thethingsnetwork.org/docs/devices/registration.html)

Then we introduce the **APP EUI** and the **APP KEY**. If everything has gone fine, you will see this message:

```
Message sent correctly!
```

and the Device status on TTN should update displaying last connection time.


## 3. Use your Portenta H7 and Lora Vision Shield on TTN

Now that our device is registered correctly on TTN we can go ahead and upload a new sketch. This new code will allow you to exchange (send and receive) data with TTN.

As before, the sketch can be found in the **MKRWAN** library. This time we choose: _LoraSendAndReceive_ sketch.

Before uploading, we must fill in the following details in the _Secret_ tab of the sketch:

* the **SECRET_APP_EUI**: Application EUI field from the TTN device overview page
* the **SECRET_APP_KEY**: the App Key field from the same page.

Now you can upload the sketch to the board. The Serial Monitor output will look like this:

```
Your module version is: ARD-078 1.1.9
Your device EUI is: a8xxxxxxxxxxxx0a
Enter a message to send to network
(make sure that end-of-line 'NL' is enabled)
```

>The communication from the device to TTN is called uplink, viceversa the communication starting from TTN to the device, is called downlink

Now open the Data section of the Device page. Every message between your device and TTN will be displayed here.

The _thundericon_ is used to identify an Activation: typically when you turn on your device or you reset it, it will generate a new activation.

You can click on that row and expand it, looking at more detailed information.

**Sending an Uplink Message**

From the Serial Monitor, digit one or two words (i.e. "Hello TTN!") and hit the Send button

the output in the Serial Monitor will be:

```
Sending: Hello TTN! - 48 65 6C 6C 6F 20 54 54 4E 21
Message sent correctly!
No downlink message received at this time.
Enter a message to send to network
(make sure that end-of-line 'NL' is enabled)
```

We can see the message in a few seconds in the APPLICATION DATA page on TTN

You see for each uplink, 2 rows:

the first (the lower one) is the uplink itself; you can recognize that is an uplink also thanks to the arrow up icon; the content is labelled "payload"
the second is a downlink (arrow down icon) that confirms the uplink reception. This downlink is not necessary - unless you need it, of course.
You can click on each row to see message details.

Notice that you've sent the string "Hello TTN!" and it was received a sequence of bytes in hexadecimal notation.

The content is of course the same. Let's use this online tool:

[ASCII to Hex...and other free text conversion tools](https://www.asciitohex.com/)

and try to copy the sequence of bytes into the "Hexadecimal" area, and then press the Convert button

you'll see in the "Text (ASCII / ANSI)" area the content will be converted back to a readable format.

**Sending a Downlink Message**

Come back to the Device Overview page, and scroll to the Downlink section.

You can use the same ASCII to Hex tool to convert a string into a sequence of bytes; i.e. convert

"Hi MKR WAN!"

from Text to Hexadecimal: the result will be

"48 69 20 4d 4b 52 20 57 41 4e 21"

Copy the result into the Payload field and set:

* Scheduling: replace
* Payload (type): bytes
* Fport: 1
* Confirmed: yes

and press the Send button

The downlink is queued waiting for the next uplink: only in that "window" the downlink will sent back to your board.

You'll see it in the Application Data page:

Now try to send something else from your board, and you'll receive the downlink as response:

```
Sending: Hello again! - 48 65 6C 6C 6F 20 61 67 61 69 6E 21
Message sent correctly!
Received: 48 69 20 4D 4B 52 20 57 41 4E 21
```

You'll see as well in the Application Data window the flow (bottom-up) of the queued message, the uplink and the next downlink of the queued message.

As already know, you can click on every rows to expand it and see message details.

TIP if you want to see the received message on your board in plain text, you need to add these 3 rows of code as last, in the loop:

```
for (unsigned int j = 0; j < i; j++) {
   Serial.print(rcv[j]);
 }
 Serial.println();
```

they will output the content in a readable format, i.e.

```
for (unsigned int j = 0; j < i; j++) {
   Serial.print(rcv[j]);
 }
 Serial.println();
```

they will output the content in a readable format, i.e.

```
Sending: Hello for the last time! - 48 65 6C 6C 6F 20 66 6F 72 20 74 68 65 20 6C 61 73 74 20 74 69 6D 65 21
Message sent correctly!
Received: 48 69 20 61 67 61 69 6E 20 4D 4B 52 20 57 41 4E 21
Hi again MKR WAN!
```

### Payload decoding on TTN

You can of course decode the message on TTN as well! There's indeed a section aimed to format the payload.

You can find this section in the Application page, and the section is called "Payload Format"

!

In order to enable the decoding, update the Decoder function, replacing the one already there with the following one:

```
function Decoder(bytes, port) {
 //source: https://flows.nodered.org/flow/845bb5b8cf788939dd261f472c289f77
 var result = "";
 for (var i = 0; i < bytes.length; i++) {
   result += String.fromCharCode(parseInt(bytes[i]));
 }
 return { payload: result, };
}
```

and then press the "save payload functions" button!

!

From now on, you'll see the uplink in plain beside the sequence of bytes! Let's see an example:

!

It will be easier in this way to integrate your TTN Application with other services or tools!

### Improve bandwidth usage

There are policy -not only for technical reason, also for government rules- on how much we can use the bandwidth in uplink and in downlink in LoRaWAN. You can read these TTN interesting guides on this topic:

* [Limitations of LoRaWAN](https://www.thethingsnetwork.org/docs/lorawan/limitations.html)
* [Duty cycle for LoRaWAN devices](https://www.thethingsnetwork.org/docs/lorawan/duty-cycle.html)


As explained earlier, we are using the public community network of TTN. This implies some rules and regulations on Fair Access Policy. The limitations are:

* The uplink airtime to 30 seconds per day (24 hours) per node and
* The downlink messages to 10 messages per day (24 hours) per node.

This is why it is important to minimize bandwidth usage. Below some suggestions:

* Keep the payload (the message) as smaller as possible, and
* Avoid not necessary messages

Let's start from a small thing: removing the confirmation request for the uplink messages from your Arduino. You need to change only this line:

```
err = modem.endPacket(true);
```

to

```
err = modem.endPacket(false);
```

# Conclusion

Congratulations! You have configured Portenta H7 and the Lora Vision Shield on the TTN. We have retrieved the device EUI, used it to register the device in the TTN console, and programmed the board using the data provided by TTN.

As long as we are in range of a TTN gateway, we can now send data over the LoRa® network which can be viewed from anywhere in the world (as long as we have an Internet connection). Now you have the tools and knowledge to take the next steps and develop your own IOT applications.

# Next Steps

-   Test the built in integrations
-   Test the API and the available SDKs libraries

Find all the details here: [TTN Applications](https://www.thethingsnetwork.org/docs/applications/)

# Troubleshooting


**Authors:** Karl Söderby, Ignacio Herrera
**Reviewed by:** ZZ [18.03.2020]  
**Last revision:** AA [27.3.2020]
