/**
 * Error object returned to the client whenever an error occurs in the HC API. Requires an error object to be constructed
 */
class ApigeeError {
  constructor(e) {
    this.code = e.statusCode || 500;
    this.message = e.body ? e.body.message : e.statusMessage || e.message || e || 'An error occurred';
    this.error = e.body ? JSON.parse(e.body) : e || 'An unexpected error occured. Please review the logs for additional details';
  }
}

module.exports = ApigeeError;