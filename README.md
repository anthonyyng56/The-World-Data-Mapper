# The World Data Mapper (MERN Stack)
##### Created by Anthony Ng
### Overview
The World Data Mapper is a full stack web application for creating maps of regions around the world under user authenticated profiles. 
### How To Run The World Data Mapper
##### Mongo URI Setup
1. Create a MongoDB account.
2. Create a new organization, a new project within this organization, and a new cluster within this project by selecting the free tier option.
3. When the cluster is finished configuring, click "connect" and add your IP address. 
4. Select "choose a connection method" and "connect your application". 
5. Copy the "mongodb+srv..." string and place in your username and password where specified before placing this string in the .env file in the quotation marks of MONGO_URI = "" on line 4. 
6. On the MongoDB site, click the collections tab and select "Create Database." Name the database "TheWorldDataMapper" and the collection name "users". After clicking create and letting the database process, click the plus button next to the new database and add a collection named "maps". 
##### Yarn and Running Application
1. Clone this repository and run "yarn" in the main directory and in the client directory. 
2. Navigate back to the main directory and run the command "npm start" to run this web application in your browser. 