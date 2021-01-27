# Connecting the Vision Shield to The Things Network
This tutorial explains how to connect your Portenta H7 to The Things Network (TTN) using the the Vision Shield's Lora Connectivity feature. A data communication channel will be enabled between the H7 and a TTN application that will be configured on your TTN console.

[note]

**Note :** Ensure that you are within range (10 Km) from an available Lora Gateway before you try this tutorial. Check availability on [The Things Network map](https://www.thethingsnetwork.org/map).

[/note]

## You Will Learn
-   About LoRaWAN® and The Things Network,
-   About creating a TTN application,
-   How to establish a connection between the H7 and the TTN,
-   How to send a payload from the H7 to the TTN.

## Required Hardware and Software
-   [Portenta H7 board](https://store.arduino.cc/portenta-h7)
-   [Vision Shield LoRa](https://store.arduino.cc/portenta-vision-shield-lora)
-   [1x Dipole Pentaband antenna](https://store.arduino.cc/antenna) or a UFL Antenna 
-   Arduino IDE ([online](https://create.arduino.cc/) or [offline](https://www.arduino.cc/en/main/software))
-   USB C cable (either USB A to USB C or USB C to USB C)
-   An [account](https://account.thethingsnetwork.org/users/login) with The Things Network

# Configuring the Development Environment
The Vision Shield LoRa can be used for developing edge- computing applications that need to be low power and ensure data privacy. Using the vision the data can be extracted  As the LoRa relies on its own network it consumes less power as compared to Wifi and bluetooth and is more secure. The Vision sheild's LoRa module is the same as the ones found on MKRWan

## 1.  Setting up the Development Environment 

In this section, we will guide you through a step-by-step process of setting up your Portenta board and Vision Shield Lora to communicate with a TTN application. This tutorial will  will first setup a TTN account and create 

As stated before, to be able to follow this guide, you need to be under coverage of one of the TTN gateways. You can check for the coverage now if you have not done so yet. If you are not in rage you'll need to build up your own gateway (find help to do so here).

Just point your browser to www.thethingsnetwork.org and use the Sign Up button to setup an account. Otherwise just sign in.

![vs_ard_things_nw]()

Next, then fill all the required fields to complete a new registration (skip this step if you already have a TTN account):

![vs_ard_things_nw]()



## 2.  Create an app on TTN

Once you have created an account with TTN, go to your [console](https://console.thethingsnetwork.org) you will be able to:

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


## 3. Communication between Portenta H7 and TTN

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

Now open the Data section of the Device page. Every message between your device and TTN will be displayed here. The _thundericon_ is used to identify an Activation: typically when you turn on your device or you reset it, it will generate a new activation. Every raw can be expanded to see more detailed information.

**Sending an Uplink Message**

From the Serial Monitor, digit one or two words (i.e. "Hello TTN!") and hit the Send button. The output in the Serial Monitor will show:

```
Sending: Hello TTN! - 48 65 6C 6C 6F 20 54 54 4E 21
Message sent correctly!
No downlink message received at this time.
Enter a message to send to network
(make sure that end-of-line 'NL' is enabled)
```

We will be able to see the message in a few seconds in the APPLICATION DATA page on TTN.

For each uplink we will see two sections:

* the first (the lower one) is the uplink itself; the arrow up icon indicates it is an uplink and the content is labelled as "payload".
* the second is a downlink (arrow down icon) and its purpose is to confirm uplink reception. This part is optional so it can be disabled to save up data.

Notice that a string "Hello TTN!" was sent but it was received as a sequence of bytes in hexadecimal notation. The content is of course the same, we can use this online tool to convert the data: [ASCII to Hex...and other free text conversion tools](https://www.asciitohex.com/).

**Sending a Downlink Message**

Downlink messages can be sent from the Device Overview page, just scroll down to the Downlink section.

You can use the same ASCII to Hex tool to convert a string into a sequence of bytes; i.e. convert

"Hi Portenta!"

from Text to Hexadecimal the result is:

Copy the result into the Payload field and set:

* Scheduling: replace
* Payload (type): bytes
* Fport: 1
* Confirmed: yes

and press the Send button.

The downlink is queued waiting for the next uplink: only in that "window" the downlink will sent back to your board. So we need to send an uplink from our board again in order to see it in the Application Data page.

Now try to send something else from your board, and you'll receive the downlink as response:

```
Sending: Hello again! - 48 65 6C 6C 6F 20 61 67 61 69 6E 21
Message sent correctly!
Received: 48 69 20 4D 4B 52 20 57 41 4E 21
```

You'll see as well in the Application Data window the flow (bottom-up) of the queued message, the uplink and the next downlink of the queued message.

TIP if you want to see the received message on your board in plain text, you need to add these 3 rows of code as last, in the loop:

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

As the payload comes in a HEX format, it needs to be decoded so a human can interpret the information. This can be done by using an Hex code translator, such as [this one](https://www.qbit.it/lab/hextext.php). We can also automate it directly in the TTN console, by navigating to our application overview, and to the **"Payload Formats"** tab.

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
