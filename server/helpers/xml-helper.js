var fs = require('fs'),
  xml2js = require('xml2js'),
  logger = require('../helpers/logger-helper');

/**
 * Use the config.json file from a proxy to update the XML files of a proxy before importing it to Apigee
 * @param {*} path path to the XML file
 * @param {*} endpoint name of the XML object to update
 * @param {*} proxyConnection nested object in the XML to update
 * @param {*} proxyObject the object in the config.json file
 */
exports.updateProxyInformation = (path, endpoint, proxyConnection, proxyObject) => {
  return new Promise((resolve, reject) => {
    parser = new xml2js.Parser();
    fs.readFile(path, (err, xmlData) => {
      if (xmlData) {
        // the XML is parsed to JSON as a bunch of arrays, which is why the formatting is pretty annoying here
        parser.parseString(xmlData, (err, result) => {
          if (result[endpoint][proxyConnection] && result[endpoint][proxyConnection].length > 0) {
            var connection = result[endpoint][proxyConnection][0];

            proxyObject.tokens.forEach(token => {
              var xpathKey = token.xpath.split(`${proxyConnection}/`).pop().split('/').shift();

              if (typeof connection[xpathKey][0] === 'object') {
                Object.keys(connection[xpathKey][0]).forEach(key => {
                  if (token.xpath.substring(token.xpath.lastIndexOf('/') + 1) === key)
                    connection[xpathKey][0][key][0] = token.value;
                });
              } else {
                // this one feels risky
                connection[xpathKey][0] = token.value;
              }
            });
          }

          //convert back to xml
          var builder = new xml2js.Builder();
          var xml = builder.buildObject(result);

          //write it back to the xml file
          fs.writeFile(path, xml, (err) => {
            logger.verbose(`Updated proxy information for ${proxyObject.name}`);
            resolve();
          });
        });
      } else {
        logger.error({statusCode: 404, message: `Could not find file ${proxyObject.name}. File doesnt exist!`});
        resolve();
      }
    });
  });
};

/**
 * Convert an XML file to JSON
 * @param {string} resourcePath path to XML file to convert
 */
exports.toJSON = (resourcePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(resourcePath, (err, xml) =>{
      if(err) {
        return reject(err);
      }
      var parser = new xml2js.Parser();
      parser.parseString(xml, (err, res) => {
        if(err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  });
};