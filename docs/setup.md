# Set up and configuration
When you login to the HC for the first time a new user is created and you will be directed to the Settings page. From here you can configure how the HC will make management API calls to Apigee. 

The settings page is divided into 5 sections:
- **API configuration:** Set the Apigee management API host name, path to parent repo directory and the names of all organization within Apigee that you want to use.
- **Proxy:** If you are behind a proxy, eg. on a corporate network, you can set up the required proxy settings here.
- **SSL:** If your Apigee management API requires mutual SSL you can set the passphrase and upload the necessary key and cert files here.
- **POSTman Tests:** Upload postman test suites here. A test suite needs a name, collection and environment. Test suites created here can be executed via the [Postman tests](./testing.md) page.
- **User settings:** Remove your account details from the HC API here.



###### Front end guide contents
- [Settings options in the header](./header_options.md)
- [Selecting an item from the sider bar](./item.md)
- [Item queues](./queues.md)
- [Additional options](./additional_options.md)
- [Winston logger](./logger.md)
- [Automated testing](./testing.md)
- [Data viusalization](./visuals.md)