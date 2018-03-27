### Update existing items in Apigee

Using the HC we can make modifications to the data inside the repo and then use that data to update the value of the same component in Apigee, as long as the identifier in Apigee and in the repo are the same.

Again, we'll be making two different routes for companies and company apps to perform this functionality. Lets start with the company route:

```
// update a company in apigee
router.put('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      results.push(new ApigeeResponse(
        await apigee.put(`${res.locals.apiEndpoint}/${el}`, res.locals.user, false, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished updating companies`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});
```

This is almost identical to our import route with the exception of it now being a **PUT** call and calling the **apigee.put()** inside the Apigee model. Everything else is the same, we pass in the **org**, **repo** and an array of string identifiers for the companies we want to update. **These names must be in both the repo and in Apigee**.

We can copy and paste this and make a few modifications to make our **update company apps** route:

```
// update a company app in apigee
router.put('/apigee/:company', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath.replace('companies', 'companyApps'));
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      if (data) {
        results.push(new ApigeeResponse(
          await apigee.put(`${res.locals.apiEndpoint}/${req.params.company}/apps/${el}`, res.locals.user, false, data)
        ));
      }
    }));
    responseHelper.handleResponse(res, `Finished updating company apps`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});
```

This time, the route changes so that we include the **company name** that we want to modify the apps for in the request parameters and the request body is an array of the app names. We also change the repo file we read from by replacing **companies** with **companyApps** to read from the **companyApps.json** file.

And its as easy as that, we can now update existing items in Apigee using data from our repo.

Next up [we will modify the front end code so that we can make these new calls throught the HC front end app](./front-end.md).

[Back to tutorial home](./intro.md)