# ConjAR-Web

This project is built based on [A-Frame](https://aframe.io) with [Node.js](https://nodejs.org/en/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1. Install Node.js v8.9.4

2. Install npm v5.7.1

### Installing

If you have everything in the prerequisites, to get the project up and running on a **MacOS / Linux** machine, you have to navigate to the project folder and:

Install dependency node modules:
```
npm install
```
Generate certificates:
```
openssl req -x509 -newkey rsa:4096 -keyout certificates/key.pem -out certificates/cert.pem -days 365 -nodes
```
Then start the server, the http server is listening on port 3000, and the https server is listening on port 3443:
```
npm start 
```
If you are running **Windows**, you may want to download **OpenSSL** from [here](https://wiki.openssl.org/index.php/Binaries) to generate key.pem and cert.pem and place them in the /certificates directory.

Then proceed to install dependency node modules:
```
npm install
```
And finally start the server, the http server is listening on port 3000, and the https server is listening on port 3443:
```
npm start 
```

## Demo

Live demo currently not available. Go [here](localhost:3000) for a working demo after set up is complete.

## Authors

* **Zhang Tianrui** - *Initial work* - [MasterFelix15](https://github.com/MasterFelix15)
