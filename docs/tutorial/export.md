#### Export items
Lets set up a route inside **./server/controllers/companies.js** to get company data from Apigee and write it to the repo. When we export a company we're also going to export any apps that belong to this company.

```
// export a company. Also export any apps for the company
router.post('/repo', validateHostName, validateRepo, validateBody, async (req, res, next) => {});
```

This will be our route. Its a **POST** call that will require the **repo** we want to write to in the query parameters, this is just the name of the directory, and also an array of strings in the request body. These strings are the company names in Apigee that we want to export.

A few middleware functions are performed before we execute any code inside the route. First we validate the host name, which ensures the Apigee management API base url has been set by the user. Next we validate the repo ensuring that a repo name has been passed in the request query parameters and that it exists inside the repo parent directory. Finally we validate the request body. Once all of these have successfully executed we enter into the route code itself.

Everything we do in the HC is based on Promises so we can wrap all the code inside a route inside a try catch block. This way, any function call that returns a rejected promise will be caught by the catch block and return the appropriate error to the user. This lets up do all error handling on all routes with just one line of code.

```
// export a company. Also export any apps for the company
router.post('/repo', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    // do export operations here
  }
  catch (e) {
    // catch any errors that occur inside the try block
    responseHelper.handleError(res, e);
  }
});
```

Exporting the companies, writing them to a file and sending the results back to the user can all be done by calling reusable functions:

```
// export a company. Also export any apps for the company
router.post('/repo', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    // set up an array to store the results in
    var data = [];

    // iterate through each string in the request body using Promise.all
    // The code after this loop wont execute until all promises in each loop are resolved
    await Promise.all(req.body.map(async (el) => {
        // get the company info
        var response = await apigee.get(`${res.locals.apiEndpoint}/${el}`, res.locals.user);
        
        // only push successful data
        if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
          data.push(JSON.parse(response.body));
        }
      }
    }));

    // write the data to the repo
    await fileHelper.write(res.locals.repoFilePath, data);

    // return to the user
    responseHelper.handleResponse(res, `Exported API products to repo`, data);
  }
  catch (e) {
    // catch any errors that occur inside the try block
    responseHelper.handleError(res, e);
  }
});
```

And thats it, all of the companies we wanted the data for will be written to **/config/{org}/companies.json** inside our repo. 

This route as it is isn't that different from many other routes, however we can now extend on this to perform some specific functionality by getting any company apps for a company as well.

There's lots of ways to do this, but in this tutorial we will create a second array for storing applicaton data and add app data to it if we successfully get a companies details and that company has apps associated with it. We will then write this appData to a seperate file called **companyApps.json** by replacing **companies** in our repo file path with **companyApps**. Finally, we will return to the user an object that holds the company data and any app data we wrote to the repo.

```
// export a company. Also export any apps for the company
router.post('/repo', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    // set up an array to store the results in
    var data = [];
    var appData = [];

    // iterate through each string in the request body using Promise.all
    // The code after this loop wont execute until all promises in each loop are resolved
    await Promise.all(req.body.map(async (el) => {
      // get the company info
      var response = await apigee.get(`${res.locals.apiEndpoint}/${el}`, res.locals.user);

      // successful get
      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        // parse the response.body to get the company data
        let company = JSON.parse(response.body);

        // push the company to the data array
        data.push(company);

        // get any apps too if there are any
        if (company.apps.length > 0) {

          // use Promise.all again. A normal for loop wont work since the apigee.get function is asynchronous.
          // this way we wait for each call to finish before proceeding with any code here
          await Promise.all(company.apps.map(async (app) => {
            // get the app data
            let appResponse = await apigee.get(`${res.locals.apiEndpoint}/${el}/apps/${app}`, res.locals.user);

            // push successful data
            if (!(appResponse.statusCode >= 400 && appResponse.statusCode <= 500)) {
              appData.push(JSON.parse(appResponse.body));
            }
          }));
        }
      }
    }));

    // write company data to the repo
    await fileHelper.write(res.locals.repoFilePath, data);

    // write app data to the repo
    await fileHelper.write(res.locals.repoFilePath.replace('companies', 'companyApps'), appData);

    // return all data to the user
    responseHelper.handleResponse(res, `Exported companies and company apps`, { companies: data, apps: appData });
  }
  catch (e) {
    // catch any errors that occur inside the try block
    // Theres a lot of potential now for errors to occur since we make lots of management API calls in this route now but any
    // that occur will be handled by this single line of code
    responseHelper.handleError(res, e);
  }
});
```

Now thats looking pretty complete, we can export a company and any app data out of Apigee and straight into our repo, building the necessary folder structure automatically if we need to. 

Designing all the routes like this might not be the most ideal approach for your own uses, since code can get repeated across the different files and each file can get quite large. However, it allows to easily make routes with specific functionality, such as exporting apps for companies, which is something you wouldn't necessarily want to do for API products, for example.

Next up we'll take a look at [importing the data we just exported back into Apigee](./import.md).

[Back to tutorial home](./intro.md)
