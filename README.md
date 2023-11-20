# Train schedule API

The primary purpose of this repository is providing a static source of data (JSON files) for the <a href="https://github.com/Marija-Kov/train-schedule">Train Schedule</a> app. <br>
On top of that, it is an actual web API that can be consumed with HTTP requests.

## Functionality

### I - Organizing data into usable resources

The API contains a program that uses extracted train schedule data to generate 2 endpoints (JSON files).
<br>
To try it out locally:
<br>
1. Install <a href="https://nodejs.org/en">Node.js</a> on your machine;
2. Clone repository;
3. Install dependencies - ``` npm install```
4. In the root directory, running:
   ```
   cd helpers && ts-node runFunctions.ts
   ```
   will generate ```stations.json``` and ```trains.json``` .

### II - Serving data

The API exposes endpoints for accessing data related to trains and train stations.

To try it out locally, navigate to the root directory and run: ```nodemon server.ts``` .

#### Train routes

- ```/trains```  will expose all trains with details;
- ```/trains/[trainId]```, where trainId is a <a href="https://github.com/Marija-Kov/train-schedule-23-api/blob/build-api/helpers/extractedData.ts">4-digit number</a>, will get a single train;
- ```/trains/[directionId]```, where [directionId](#directionId) is either number 1 or 2, will get all trains that go in the given direction;
- ```/trains/[directionId]/[activity]```, where activity can be either ```ed``` (every day), ```wd``` (weekday - Monday to Friday) or ```wh``` (weekends and holidays only), will get trains going in the given direction on specified days;

Example: ```localhost:3003/trains/2/ed``` will get all trains going in direction 2 every day.

#### Station routes

- ```/stations``` will expose the details of every station;
- ```/stations/[stationName]```, where stationName can be any station from the [list](#listOfStations), will get the details of a single station. In the URL, station name must be specified in lowercase, letter-only and hyphenated if consisting of more than 1 word.;
- ```/stations/[stationName]/[directionId]``` will get all the departures from the specified station in the specified direction;
- ```/stations/[stationName]/[directionId]/[activity]``` will get the departures from the specified station in the specified direction on specified days;

Example: ```localhost:3003/stations/novi-beograd/2/wd``` will get all the weekday departures from Novi Beograd station in direction 2.
<br><br>
## Appendix

#### Direction Id <a name = "directionId"></a>
 - ```1``` - refers to direction Batajnica - Ovca;
 - ```2``` - refers to direction Ovca - Batajnica;
#### Station Names <a name = "listOfStations"></a>

Below is the ordered list of train stations typed as they should be used in the URL: <br>
1. ```batajnica``` 
2. ```kamendin```
3. ```zemunsko-polje```
4. ```altina```
5. ```zemun```
6. ```tosin-bunar```
7. ```novi-beograd```
8. ```beograd-centar```
9. ```karadjordjev-park```
10. ```vukov-spomenik```
11. ```pancevacki-most```
12. ```krnjaca-most```
13. ```krnjaca-ukr```
14. ```sebes```
15. ```ovca```




