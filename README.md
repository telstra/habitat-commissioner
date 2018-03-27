# Habitat Commissioner
REST API for migrating API components from one Apigee org to another quickly, easily and with more control. The Habitat Commissioner currently allows for the migration of:

- API products
- API proxies
- Caches
- Key value maps
- Supported currencies
- Packages and rate plans
- Notification email templates
- Reports
- Shared flows
- Target servers

Using the HC you can also manage Companies, Developers and company and developer apps.

The HC can pull API component defintions down from Apigee and write these to a local file system. You can then import these definitions into other orgs and environments to quickly migrate your API's.

A full swagger spec can be found [here](./swagger/swagger.yaml)

The Habitat Commissioner requires [node.js and NPM](https://nodejs.org/en/) to be installed and was built using node v8.1.3 and npm v5.0.3.

### Getting started
Create a directory somewhere on your system with additional directories inside. The HC will write data to and read data from these additional directories which can the be used as source code repositories for your APIs. 


After creating the repo parent directory and child directories, clone this repo and open it in your terminal and run
```
npm install
```
Once the install is finished run
```
npm start
```
This will start the express server and the Habitat Commissioner API can be used at http://localhost:8080


If you would like to use the front end application you will need to open two terminals in the Habitat Commissioner diretory. In one terminal run
```
npm run build
```
This will start a live reload server of the application code. Alternatively run
```
npm run build:prod
```
To build a production version of the front end code without live reloading functions.

In the other terminal run
```
npm start
```
To start the express server.

Navigating to http://localhost:8080 in your browser will take you to the Habitat Commissioner front end application.


### How to use
Take the example of moving an API product from a development org in Apigee to a production one. Using the Habitat commissioner to do this you would:

- Create a parent repo directory, we'll call it **repos**, and place an existing source code repository inside or create a new one.
- Login to the HC and use the *Export API products* API endpoint to export API products from Apigee into your repo. The request will looks something like this:
```
POST http://localhost:8080/apiProducts/repo?org=myDevOrg&repo=myRepo
```
and the body:
```
[
	"some product",
	"some product 2"
]
```
*org* is the Apigee org you are getting the API product data from, *myRepo* is the directory inside the repo parent directory that you want to write the API product data to.

When you execute this API call the HC will create a few new directories in *myRepo*: /config/org/**myDevOrg**/apiProducts.json. This file will not contain the definitions for *some product* and *some product 2*

- Create a directory in the config/org directory with the same name as the org you want to move the API product to, eg. **myProdOrg**.

- Using the HC call the *Import API products* API endpoint to import products from the repo into Apigee. The request will looks similar to this:
```
http://localhost:8080/apiProducts/apigee?org=myProdOrg&repo=myRepo
```
body: 
```
[
	"some product",
	"some product 2"
]
```
Where *myProdOrg* is the name of the org within Apigee that you want to move data to.

- *some product* and *some product 2* will now be **myProdOrg** exactly as they were in **myDevOrg**


This is a very simple end to end example of what the main use of the Habitat Commissioner does. For a more detailed explanation of all of the HC API endpoints please see the [swagger](./swagger/swagger.yaml) included in this repo          


### Habitat Commissioner front example application
To help demonstrate the functionality of the Habitat Commissioner this repo also includes a front end application that implements all of the functionality of the API. At our organization, we use this application to migrate our API's from development orgs into production.


To start a live development server of the front end application open a second terminal and run
```
npm run build
```
The application code will now be rebuilt as you save changes. However, because they are being served by the express server the page will need to be refresed for any changes to be seen. Any changes to server side will code will require the server to be restarted in order to take effect.


#### Front end user guide
|                                                             |                                                                   |
| ----------------------------------------------------------- |:-----------------------------------------------------------------:| 
| [Initial set up](./docs/setup.md)                            | Set up and configuration for the HC API                           |
| [Settings options in the header](./docs/header_options.md)   | Use the header bar to create your HC API query parameters         |
| [Selecting an item from the sider bar](./docs/item.md)       | Get an items details and begin using the HC to migrate            |
| [Item queues](./docs/queues.md)                               | Set up queues for procuring, creating and updating Apigee items   |
| [Additional options](./docs/additional_options.md)            | Additional options for specific Apigee components                 |
| [Winston logger](./docs/logger.md)                            | Use the logging capabilites of the HC API to track your API calls |
| [Automated testing](./docs/testing.md)                        | Import existing postman collections and environments and run end to end tests |
| [Data viusalization](./docs/visuals.md)                       | Visualize your API's with D3.js                                   |

### Expanding on the Habitat Commissioner API and front end app
A tutorial on expanding the Habitat Commissioner to include additionally functionality can be found [here](./docs/tutorial/intro.md). In this tutorial we add functionality to procure, create and update companies and company apps.