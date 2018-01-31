# Setting HC options using the header bar
At the top of the main screen in the HC app is header bar. From left to right, this bar allows you to set:

<img src="images/header_bar.PNG" alt="Header bar"/>
           
- **View:** Either Apigee or Repo. When in Apigee view you are accessing data from Apigee, when in Repo view you are accessing data from the repo set in the **Local Repo** option.
- **Organization:** The organization to perform data operations in. In Apigee view this is the organization in Apigee, in Repo view this is the /config/org/**organization** folder from the repo set in the **Local Repo** option.
- **Environment:** The environment to perform data operations in. This option remains blank until a valid **organization** is selected. In Apigee view this is the environment for the specified org in Apigee, in Repo view this is the /config/env/**environment** folder from the repo set in the **Local Repo** option.
- **Local Repo:** Select from a list of repo directories contained within the [parent repo directory](./setup.md). Data operations will occur within this directory


After selecting values for all of the options in the header bar the [side bar](./item.md) will be populated with data pertaining to the selected view. From the sidebar you can select individual Apigee items and perform data operations on them.