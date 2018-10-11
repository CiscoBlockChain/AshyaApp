# Ashya Device App

This is an application that runs on a RP3 or IoT device.  This is the web GUI for the application.


## Start Device Collector 

For this to work the Python Web Service needs to be running on the same node.  This code is found in the [Cisco BlockChain Repo](https://github.com/CiscoBlockChain/web-service)

Information on starting the collector service can be seen [in the README](https://github.com/CiscoBlockChain/web-service)

Once it is running you can test it is running by running: 

```
curl localhost:5050/contract
```
If it just started there should be no contract returned.  Once we know this is working, we can start the device app.

## Start Device App

The Ashya Device app can be started by running: 

```
npm start
```

In the source directory.  This should launch the web application to create the device contract. 


