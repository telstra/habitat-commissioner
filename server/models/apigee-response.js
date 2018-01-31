/**
 * Creates response data to be returned from the HC API
 */
class ApigeeResponse {
  constructor(res, message) {
    this.code = res ? res.statusCode || 200 : 200;
    this.message = message || res.statusMessage || res.message || '';
    this.data = this.parseResponseData(res);
  }

  parseResponseData(res) {
    var result = 'Operation complete. Please review the logs for more information';
    if (res) {
      if (res.body) {
        try {
          result = JSON.parse(res.body);
        }
        catch (e) {
          result = res.body;
        }
      } else {
        res.statusMessage ?
          result = res.statusMessage :
          result = res;
      }
    }
    return result;
  }
}

module.exports = ApigeeResponse;