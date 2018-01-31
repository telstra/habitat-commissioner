# Operation Logging
The HC API uses [winston](https://www.npmjs.com/package/winston) to log events to a file as they happen. The HC front end application utilzes [socket.io](https://www.npmjs.com/package/socket.io) and [socket.io-client](https://www.npmjs.com/package/socket.io-client) to display these logs in the app.


The logs are useful in many ways and detailed information of each event can be seen by clicking on 'data' button. This is also the only way to see what the results of each API call were. The management API can fail, but the HC API will not, so the results of each API call are not always immediatly obvious in the front end app. Please use the logger component and 'data' button to review the results of each request sent to the HC API.