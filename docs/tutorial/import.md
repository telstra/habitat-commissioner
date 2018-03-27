### Create new items in Apigee
Now that we have companies and company apps exported into our local repo we can import this data into any org in Apigee we want as long we have access.

Again, there are a number ways you could choose to implement something like this. In this tutorial we'll be seperating the imports into two seperate routes: one for importing companies and one for importing apps.

Our route will be a **POST** call at the **/apigee** endpoint, since we're posting to Apigee, and will require the user to send through an array of strings, the company names in the repo, in the request body. The route will also require the user to send through the **org** they want to post to and the **repo name** that they want to read data from in the request query parameters. Its important to not here that the **org** parameter refers to both the **org in Apigee** and the **folder in the config directory of the repo**.

```
// import a company into apigee
router.post('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    // import operations here
  }
  catch (e) {
    // error handling
    responseHelper.handleError(res, e);
  }
});
```

We use the same basic template for all of our routes: We define the route path and verb, define which middlewares we want to use on the route and finally we wrap the contents of the route up in a try catch block for easy error handling.

We'll be using the Apigee model again to make management API calls and use the file and response helpers to read our data and send a response back to the user:

```
// import a company into apigee
router.post('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    // set up an array to store the results in 
    var results = [];

    // read the company data from the repo
    var fileData = await fileHelper.read(res.locals.repoFilePath);

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);

      // push the result from the apigee.post call into the results array
      results.push(new ApigeeResponse(
        await apigee.post(res.locals.apiEndpoint, res.locals.user, false, data)
      ));
    }));

    // return the response to the user
    responseHelper.handleResponse(res, `Finished importing companies`, results);
  }
  catch (e) {
    // error handling
    responseHelper.handleError(res, e);
  }
});
```

Thats it for importing apps! Its not too different really from our export route, we use Promise.all to iterate through the request body and make a management API call to Apigee to do something with our data. All of the company names that we sent in the request body have been found in the repo and imported into the Apigee org defined in the request query parameters.

We can now pretty much just copy and paste this to create our **import company apps** route:

```
// import a company app into apigee
router.post('/apigee/:company', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var results = [];
    var fileData = await fileHelper.read(res.locals.repoFilePath.replace('companies', 'companyApps'));

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      // get the company app data from the repo
      var data = fileData.find(x => x.name === el);

      // import the company app
      if (data) {
        // update the apps companyName to reflect the company parameter
        data.companyName = req.params.company;

        results.push(new ApigeeResponse(
          await apigee.post(`${res.locals.apiEndpoint}/${req.params.company}/apps`, res.locals.user, false, data)
        ));
      }
    }));
    responseHelper.handleResponse(res, `Finished importing apps for company ${req.params.company}`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});
```

We do a few things differently here. Firstly we replace **companies** in the repoFilePath with **companyApps** since now we're reading from the **companyApps.json** file in the repo. Next, once we find the data in the file, we want to update the **companyName** parameter to match the value of the request parameter **company** passed in by the user. Otherwise, everything else is the same.

Now that we can import companies and company apps into Apigee using data from our repo we want to be able to [update these existing companies and apps in Apigee using modified data from our repo](./updating.md).

[Back to tutorial home](./intro.md)