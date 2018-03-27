# Expanding on the Habitat Commissioner API and front end app
The Habitat Commissioner seperates each API component into its own file, but ultimately calls upon many different reusable functions to perform data operations like reading and writing files and making Apigee management API calls. This tutorial will show how to extend on the companies controller to include functionality for getting data from Apigee, creating new entries in Apigee and updating existing data on Apigee.

Let's start with **./server/controllers/companies.js**. Inside this file we can see a whole bunch of [Express](https://expressjs.com/) routes that make up the majortiy of the HC API. The first two routes in this file are:

```
// called on every request
router.use('/', verifyJWT, validateOrg, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/companies`;
  res.locals.repoExtension = `/config/org/${res.locals.org}/companies.json`;
  next();
});
```
```
// list all companies in apigee
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.get(res.locals.apiEndpoint, res.locals.user);
    responseHelper.handleResponse(res, `Companies from apigee`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});
```

The top route is called by accessing **http://localhost:8080/companies** and, by placing it above all other routes, is called on every request made at the **/companies** endpoint. 

Inside this route we call on a few **middleware** functions, located inside the **./server/middlewares** folder that both verify the JSON web token passed in with the request and enusre the value of the org passed in the request query parameters is valid. Each middleware calls **next()** when it has passed successfully and the next middleware is called. Once all middlewares have passed successfuly the code inside the route is executed. In this route we define some variables inside the **res.locals** object, which will persist across the entirety of a single request. 

- **res.locals.apiEndpoint** is the path we use to call the Apigee management API for this API item. In this case we need to call **/org/companies**. The **res.locals.org** variable is assigned inside the **validateOrg** middleware.
- **res.locals.repoExtension** is the path where we will read and write data to and from inside the repo. Here we set up the path to **companies.json** inside the repo.

Once we're finished with that **next()** is called and the route the user is trying to access is finally called. 

The other route shown above is **http://localhost:8080/companies/apigee/list** and is a **GET** request, defined by using **router.get()**. Inside this route we use the res.locals object to make a get request to the Apigee management API using the **Apigee** model, definied inside **./server/models/apigee.js**. By using **async and await** we the **responseHelper.handleResponse()** function is not called until the **apigee.get()** function has completed. Because **apigee.get()** returns a promise, we can wrap the whole thing up in a try catch and any errors will be caught by the catch inside the route and sent back to the user as the API response.

The entire HC API works like this, each time a route is called a default route is called that verifies the user and assigns some variables, then the next route is called that performs its functionality using the different models contained in the **./server/models** directory. We utilize various **helpers** for functions like reading and writing files, returning data to the user and performing data operations on XML files etc.

Lets now work on modifying the code inside **./server/controllers/companies.js** to include some additional functionality specific to companies that will use the reusable HC API components to implement this funtionailty as painlessly (hopefully) as possible.

|                                                 |                                                                   |
| ----------------------------------------------- |:-----------------------------------------------------------------:| 
| [Export items](./export.md)                     | Export Apigee items and write their definitions to the repo       |
| [Create new items in Apigee](./import.md)       | Create new items in Apigee using data from the repo               |
| [Update existing items in Apigee](./updating.md)| Update existing items in Apigee using data from the repo          |
| [Modifying the front end](./front-end.md)       | Modify the front end code to reflect the API changes made         |