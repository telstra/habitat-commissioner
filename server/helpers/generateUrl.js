var fs = require('fs'),
  request = require('request');

/**
 * Set the proxy settings for the request if the user has proxy enabled
 * @param {User} userData logged in users configuration data
 */
exports.request = (userData) => {
  if(userData.config.proxy.enable) {
    var proxy = userData.config.proxy;
    return request.defaults({ 'proxy': `${proxy.scheme}://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}` });
  } else {
    return request;
  }
};

/**
 * Send a request to the configured Apigee management API
 * @param {string} resourcePath Apigee management API resource path
 * @param {User} userData logged in users configuration data
 * @param {boolean} isMonetization True if the request requires a monetization API call
 * @param {*} body POST or PUT data
 */
exports.urlOptions = (resourcePath, userData, isMonetization, body) => {
  if (!userData) { return {}; }
  var url;

  if (userData.config.apiHostName.indexOf("api.enterprise.apigee") >= 0) { // If external apigee return normal url
    isMonetization
      ? url = `https://${userData.config.apiHostName}/mint/organizations`
      : url = `https://${userData.config.apiHostName}/organizations`;
  } else {
    isMonetization
      ? url = `https://${userData.config.apiHostName}/mataap/mint/organizations`
      : url = `https://${userData.config.apiHostName}/mataap/o`;
  }

  return {
    url: `${url}/${resourcePath}`,
    headers: {
      'Authorization': userData.apiBasicAuthCredentials
    },
    key: userData.config.ssl.enable ? fs.readFileSync(userData.config.ssl.key) : null,
    cert: userData.config.ssl.enable ? fs.readFileSync(userData.config.ssl.cert) : null,
    passphrase: userData.config.ssl.enable ? userData.config.ssl.passphrase : null,
    body: body ? body : null,
    json: body ? true : false
  }
};