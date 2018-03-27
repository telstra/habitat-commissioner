const SWAGGER = {
  "swagger": "2.0",
  "info": {
    "version": "1.0",
    "title": "Habitat Commissioner",
    "description": "Express REST API for moving data between orgs and environments in apigee",
    "license": {
      "name": "MIT",
      "url": "http://github.com/gruntjs/grunt/blob/master/LICENSE-MIT"
    }
  },
  "host": "localhost:8080",
  "basePath": "/",
  "tags": [
    {
      "name": "authorization",
      "description": "Authenticate with the HC API"
    },
    {
      "name": "user",
      "description": "Operations about user"
    },
    {
      "name": "misc",
      "description": "Miscellaneous operations"
    },
    {
      "name": "api products",
      "description": "Everything about API products",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api/api-products-1"
      }
    },
    {
      "name": "api proxies",
      "description": "Everything about API proxies",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api/apis-0"
      }
    },
    {
      "name": "caches",
      "description": "Everything about caches",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api/caches"
      }
    },
    {
      "name": "companies",
      "description": "Everything about companies",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api/companies-0"
      }
    },
    {
      "name": "developers",
      "description": "Everything about developers",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api/developers-0"
      }
    },
    {
      "name": "kvms",
      "description": "Everything about KVMs",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api-services/content/environment-keyvalue-maps"
      }
    },
    {
      "name": "monetization currencies",
      "description": "Everything about supported currencies",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api-reference/content/monetization-apis#currency"
      }
    },
    {
      "name": "monetization packages",
      "description": "Everything about packages and rate plans",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api-reference/content/monetization-apis#api-packages"
      }
    },
    {
      "name": "notification email templates",
      "description": "Everything about notification email templates",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api-reference/content/monetization-apis#event-notifications"
      }
    },
    {
      "name": "reports",
      "description": "Everything about reports",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api/reports"
      }
    },
    {
      "name": "shared flows",
      "description": "Everything about shared flows",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs-apis.apigee.io/apis/shared-flows-management-api-reference/index"
      }
    },
    {
      "name": "target servers",
      "description": "Everything about target servers",
      "externalDocs": {
        "description": "Apigee docs",
        "url": "https://docs.apigee.com/api/api_resources/51-targetservers"
      }
    }
  ],
  "schemes": [
    "http"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "paths": {
    "/auth/login": {
      "post": {
        "description": "Login to the Habitat Commissioner and receive a token",
        "summary": "login",
        "tags": [
          "authorization"
        ],
        "operationId": "login",
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/x-www-form-urlencoded"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Apigee username"
          },
          {
            "name": "password",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Apigee password"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/LoginResponse"
            },
            "examples": {
              "application/json": {
                "code": 200,
                "message": "Hello, username",
                "data": {
                  "token": "token"
                }
              }
            }
          }
        }
      }
    },
    "/user": {
      "get": {
        "description": "Get all information for the logged in user",
        "summary": "Get the logged in user",
        "tags": [
          "user"
        ],
        "operationId": "getUser",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      },
      "put": {
        "description": "Update the user settings for Apigee API hostname, repo parent directory path and which orgs to hit in Apigee",
        "summary": "Update user configuration",
        "tags": [
          "user"
        ],
        "operationId": "updateConfig",
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "user config",
            "description": "Basic user configuration",
            "schema": {
              "type": "object",
              "properties": {
                "apiHostName": {
                  "type": "string"
                },
                "repoParentDirectory": {
                  "type": "string"
                },
                "orgs": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          },
          {
            "in": "header",
            "name": "token",
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      },
      "delete": {
        "description": "Delete the logged in user",
        "summary": "Delete the logged in user",
        "tags": [
          "user"
        ],
        "operationId": "deleteUser",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/user/repos": {
      "get": {
        "description": "Get the names of each directory in the repo parent directory",
        "summary": "Get repo directories",
        "tags": [
          "user"
        ],
        "operationId": "getRepos",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "code": {
                  "description": "",
                  "example": 200,
                  "type": "integer",
                  "format": "int32"
                },
                "message": {
                  "description": "",
                  "example": "Repo directories",
                  "type": "string"
                },
                "data": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/proxy": {
      "put": {
        "description": "Update proxy settings for the user",
        "summary": "Update proxy settings",
        "tags": [
          "user"
        ],
        "operationId": "updateProxySettings",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "proxy config",
            "description": "Proxy configuration",
            "schema": {
              "type": "object",
              "properties": {
                "enable": {
                  "type": "boolean"
                },
                "username": {
                  "type": "string"
                },
                "password": {
                  "type": "string"
                },
                "scheme": {
                  "type": "string"
                },
                "host": {
                  "type": "string"
                },
                "port": {
                  "type": "string"
                }
              }
            }
          },
          {
            "in": "header",
            "name": "token",
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      }
    },
    "/user/ssl": {
      "post": {
        "description": "Enable SSL for the user so they can use the Apigee management API using an SSL key and cert",
        "summary": "Enable SSL",
        "tags": [
          "user"
        ],
        "operationId": "enableSSL",
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/x-www-form-urlencoded"
        ],
        "parameters": [
          {
            "name": "passphrase",
            "in": "formData",
            "type": "string",
            "description": "SSL passphrase"
          },
          {
            "name": "key",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "SSL key. Must be a .pem file"
          },
          {
            "name": "cert",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "SSL cert. Must be a .pem file"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access_token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      },
      "delete": {
        "description": "Disable SSL for the user. This will also delete any previously uploaded key and cert files from the server",
        "summary": "Disable SSL",
        "tags": [
          "user"
        ],
        "operationId": "disableSSL",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      }
    },
    "/user/tests": {
      "post": {
        "description": "Upload a postman collection and environment",
        "summary": "Upload Postman tests",
        "tags": [
          "user"
        ],
        "operationId": "uploadPostmanTest",
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/x-www-form-urlencoded"
        ],
        "parameters": [
          {
            "name": "name",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Name for the test suite"
          },
          {
            "name": "collection",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Postman collection. Must be a .json file"
          },
          {
            "name": "environment",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Postman environment. Must be a .json file"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      }
    },
    "/user/tests/{test_id}": {
      "get": {
        "description": "Get the details of an uploaded postman collection and environment by ID",
        "summary": "Get postman test",
        "tags": [
          "user"
        ],
        "operationId": "getTest",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "test_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "Postman test id"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "code": {
                  "description": "",
                  "example": 200,
                  "type": "integer",
                  "format": "int32"
                },
                "message": {
                  "description": "",
                  "example": "Details for test test_id",
                  "type": "string"
                },
                "data": {
                  "type": "object",
                  "properties": {
                    "collection": {
                      "type": "object",
                      "description": "Postman test collection"
                    },
                    "environment": {
                      "type": "object",
                      "description": "Postman test environment"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "description": "Update the collection and/ or environment files for an existing upload",
        "summary": "Update existing postman test",
        "tags": [
          "user"
        ],
        "operationId": "updatePostmanTest",
        "produces": [
          "application/json"
        ],
        "consumes": [
          "application/x-www-form-urlencoded"
        ],
        "parameters": [
          {
            "name": "name",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Name for the test suite"
          },
          {
            "name": "collection",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Postman collection. Must be a .json file"
          },
          {
            "name": "environment",
            "in": "formData",
            "required": true,
            "type": "string",
            "description": "Postman environment. Must be a .json file"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "test_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "The Postman test ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      },
      "delete": {
        "description": "Delete a postman collection and environment",
        "summary": "Delete a Postman test",
        "tags": [
          "user"
        ],
        "operationId": "deletePostmanTest",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "test_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "The Postman test ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/UserResponse"
            }
          }
        }
      }
    },
    "/api": {
      "get": {
        "description": "Get the base name of all Habitat Commissioner API endpoints",
        "summary": "Get endpoints",
        "tags": [
          "misc"
        ],
        "operationId": "getEndpoints",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "code": {
                  "description": "",
                  "example": 200,
                  "type": "integer",
                  "format": "int32"
                },
                "message": {
                  "description": "",
                  "example": "All HC base endpoints",
                  "type": "string"
                },
                "data": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/envs": {
      "get": {
        "description": "Get the environments for each org set in the user configuration",
        "summary": "Get environments",
        "tags": [
          "misc"
        ],
        "operationId": "getEnvs",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "code": {
                  "description": "",
                  "example": 200,
                  "type": "integer",
                  "format": "int32"
                },
                "message": {
                  "description": "",
                  "example": "Org and envs from apigee",
                  "type": "string"
                },
                "data": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "org": {
                        "type": "string"
                      },
                      "env": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/env/{org}": {
      "get": {
        "description": "Get the environments for a single org",
        "summary": "Get environments in an organization",
        "tags": [
          "misc"
        ],
        "operationId": "getOrgEnvs",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "org",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "organization name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "code": {
                  "description": "",
                  "example": 200,
                  "type": "integer",
                  "format": "int32"
                },
                "message": {
                  "description": "",
                  "example": "Environments for org",
                  "type": "string"
                },
                "data": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/postman_test/{test_id}": {
      "get": {
        "description": "Run a postman test",
        "summary": "Run a Postman test",
        "tags": [
          "misc"
        ],
        "operationId": "runPostmanTest",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "test_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "Postman test ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/apiProducts/apigee/list": {
      "get": {
        "description": "List all of the API products in Apigee at the specified org",
        "summary": "List API products",
        "tags": [
          "api products"
        ],
        "operationId": "listProducts",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": ""
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": ""
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            },
            "examples": {
              "application/json": {
                "code": 200,
                "message": "Message",
                "data": {
                  "apigeeData": "apigeeData"
                }
              }
            }
          }
        },
        "security": [

        ],
        "x-unitTests": [
          {
            "request": {
              "method": "GET",
              "uri": "/apiProducts/apigee/list?org={{org}}",
              "headers": {
                "token": "{{token}}"
              }
            },
            "expectedResponse": {
              "x-allowExtraHeaders": true,
              "x-bodyMatchMode": "RAW",
              "x-arrayOrderedMatching": false,
              "x-arrayCheckCount": false,
              "x-matchResponseSchema": true,
              "headers": {
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                "Access-Control-Allow-Methods": "POST, GET, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Origin": "*",
                "Connection": "keep-alive",
                "Content-Length": 1269,
                "Content-Type": "application/json; charset=utf-8",
                "Date": "Tue, 19 Dec 2017 02:08:08 GMT",
                "ETag": "W/\"4f5-lJJJZcAEIH8jiJcI6DR0v6Wu20k\"",
                "X-Powered-By": "Express"
              },
              "body": "{\n    \"code\": 200,\n    \"message\": \"Message\",\n    \"data\": {\n    \"apigeeData\": \"apigeeData\"\n  }\n}"
            },
            "x-testShouldPass": true,
            "x-testEnabled": true,
            "x-testName": "listProducts",
            "x-testDescription": "List all of the API products in Apigee at the specified org"
          }
        ],
        "x-operation-settings": {
          "CollectParameters": false,
          "AllowDynamicQueryParameters": false,
          "AllowDynamicFormParameters": false,
          "IsMultiContentStreaming": false
        }
      }
    },
    "/apiProducts/apigee/details/{product_name}": {
      "get": {
        "description": "Details of single API product from Apigee",
        "summary": "Get an API product",
        "tags": [
          "api products"
        ],
        "operationId": "getProduct",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "product_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "product name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/apiProducts/repo/list": {
      "get": {
        "description": "List of all API products in the specified repo under the specified org",
        "summary": "List API products in the repo",
        "tags": [
          "api products"
        ],
        "operationId": "listRepoProducts",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/apiProducts/repo/details/{product_name}": {
      "get": {
        "description": "Details of a single API product from the repo",
        "summary": "Get API product from repo",
        "tags": [
          "api products"
        ],
        "operationId": "getRepoProduct",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "product_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "product name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/apiProducts/repo": {
      "post": {
        "description": "Export API products from the specified org to the specified repo",
        "summary": "Export API Products",
        "tags": [
          "api products"
        ],
        "operationId": "exportProducts",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/apiProducts/apigee": {
      "put": {
        "description": "Updates existing API products in Apigee with data from the repo",
        "summary": "Update API products",
        "tags": [
          "api products"
        ],
        "operationId": "updateProducts",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "post": {
        "description": "Import API products from the specified repo to the specified org in Apigee",
        "summary": "Import API products",
        "tags": [
          "api products"
        ],
        "operationId": "importProducts",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/apiProducts/{product_name}": {
      "delete": {
        "description": "Delete an API product from Apigee",
        "summary": "Delete API product",
        "tags": [
          "api products"
        ],
        "operationId": "deleteProduct",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "product_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "product name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/apigee/list": {
      "get": {
        "description": "List all of the proxies in the specified org in Apigee",
        "summary": "List proxies",
        "tags": [
          "api proxies"
        ],
        "operationId": "listProxies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/apigee/details/{proxy_name}": {
      "get": {
        "description": "Details of a proxy in the specified org in Apigee",
        "summary": "Get proxy",
        "tags": [
          "api proxies"
        ],
        "operationId": "getProxy",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/apigee/list/{proxy_name}": {
      "get": {
        "description": "List the revisions of an proxy in Apigee",
        "summary": "List proxy revisions",
        "tags": [
          "api proxies"
        ],
        "operationId": "listProxyRevisions",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/apigee/details/{proxy_name}/{revision_number}": {
      "get": {
        "description": "Details of a single proxy revision in the specified org in Apigee",
        "summary": "Get proxy revision",
        "tags": [
          "api proxies"
        ],
        "operationId": "getProxyRevision",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/apigee/deployments/{proxy_name}": {
      "get": {
        "description": "Get each deployment of specified proxy in Apigee",
        "summary": "Get proxy deployments",
        "tags": [
          "api proxies"
        ],
        "operationId": "getProxyDeployments",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/repo/list": {
      "get": {
        "description": "List of all proxy directories in the specified repo",
        "summary": "List proxies in repo",
        "tags": [
          "api proxies"
        ],
        "operationId": "listRepoProxies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/repo/details/{proxy_name}": {
      "get": {
        "description": "Details of a single proxies configuration file in the repo",
        "summary": "Get a proxy from the repo",
        "tags": [
          "api proxies"
        ],
        "operationId": "getRepoProxy",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/repo": {
      "post": {
        "description": "Export proxies from Apigee into the repo",
        "summary": "Export proxies",
        "tags": [
          "api proxies"
        ],
        "operationId": "exportProxies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ExportProxiesRequest"
              }
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/apigee": {
      "post": {
        "description": "Import proxies from the repo into Apigee. We also deploy the proxy into the specified environment",
        "summary": "Import proxies",
        "tags": [
          "api proxies"
        ],
        "operationId": "importProxies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/deploy/{proxy_name}/{revision_number}": {
      "post": {
        "description": "Deploy a revision in Apigee",
        "summary": "Deploy proxy",
        "tags": [
          "api proxies"
        ],
        "operationId": "deployProxy",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/undeploy/{proxy_name}/{revision_number}": {
      "delete": {
        "description": "Undeploy a proxy revision",
        "summary": "Undeploy proxy",
        "tags": [
          "api proxies"
        ],
        "operationId": "undeployProxy",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/{proxy_name}/{revision_number}": {
      "delete": {
        "description": "Delete a proxy revision",
        "summary": "Delete proxy revision",
        "tags": [
          "api proxies"
        ],
        "operationId": "deleteProxyRevision",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/proxies/{proxy_name}": {
      "delete": {
        "description": "Delete a proxy from Apigee",
        "summary": "Delete proxy",
        "tags": [
          "api proxies"
        ],
        "operationId": "deleteProxy",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "proxy_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "proxy name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/caches/apigee/list": {
      "get": {
        "description": "List all caches in Apigee at the specified org and env",
        "summary": "List caches",
        "tags": [
          "caches"
        ],
        "operationId": "listCaches",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/caches/apigee/details/{cache_name}": {
      "get": {
        "description": "Details of a single cache in Apigee",
        "summary": "Get cache",
        "tags": [
          "caches"
        ],
        "operationId": "getCache",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "cache_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "cache name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/caches/repo/list": {
      "get": {
        "description": "List of all caches at the specified env in the specified repo",
        "summary": "List caches in the repo",
        "tags": [
          "caches"
        ],
        "operationId": "listRepoCaches",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/caches/repo/details/{cache_name}": {
      "get": {
        "description": "Details of a single cache in the repo",
        "summary": "Get cache from the repo",
        "tags": [
          "caches"
        ],
        "operationId": "getRepoCache",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "cache_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "cache name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/caches/repo": {
      "post": {
        "description": "Export caches from Apigee into the repo",
        "summary": "Export caches",
        "tags": [
          "caches"
        ],
        "operationId": "exportCaches",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/caches/apigee": {
      "put": {
        "description": "Update existing caches in Apigee with data from the repo",
        "summary": "Update caches",
        "tags": [
          "caches"
        ],
        "operationId": "updateCaches",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "post": {
        "description": "Import caches from the repo into Apigee",
        "summary": "Import caches",
        "tags": [
          "caches"
        ],
        "operationId": "importCaches",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/caches/{cache_name}": {
      "delete": {
        "description": "Delete a cache from Apigee",
        "summary": "Delete cache",
        "tags": [
          "caches"
        ],
        "operationId": "deleteCache",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "cache_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "cache name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/apigee/list": {
      "get": {
        "description": "Get a list of all companies in Apigee",
        "summary": "List companies",
        "tags": [
          "companies"
        ],
        "operationId": "listCompanies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/apigee/details/{company_name}": {
      "get": {
        "description": "Get a list of all companies in Apigee",
        "summary": "Get a company",
        "tags": [
          "companies"
        ],
        "operationId": "getCompany",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/repo/list": {
      "get": {
        "description": "Get a list of all companies in the repo",
        "summary": "List company apps in the repo",
        "tags": [
          "companies"
        ],
        "operationId": "listRepoCompanies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/repo/details/{company_name}": {
      "get": {
        "description": "Get the details of a single company from the repo",
        "summary": "Get the details of a single company from the repo",
        "tags": [
          "companies"
        ],
        "operationId": "getRepoCompany",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/repo": {
      "post": {
        "description": "Export companies from Apigee to the repo. Also exports any apps for each company",
        "summary": "Export companies and company apps from Apigee",
        "tags": [
          "companies"
        ],
        "operationId": "exportCompanies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/apigee": {
      "post": {
        "description": "Import companies from the repo to Apigee",
        "summary": "Import companies from the repo to Apigee",
        "tags": [
          "companies"
        ],
        "operationId": "importCompanies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "put": {
        "description": "Update existing companies in Apigee with data from the repo",
        "summary": "Update existing companies in Apigee with data from the repo",
        "tags": [
          "companies"
        ],
        "operationId": "updateCompanies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/apigee/{company_name}": {
      "post": {
        "description": "Import company apps from the repo into Apigee",
        "summary": "Import company apps from the repo into Apigee",
        "tags": [
          "companies"
        ],
        "operationId": "importCompanyApps",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "put": {
        "description": "Update existing apps for a company in Apigee with data from the repo",
        "summary": "Update existing apps for a company in Apigee with data from the repo",
        "tags": [
          "companies"
        ],
        "operationId": "updateCompanyApps",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/apigee/list/{company_name}": {
      "get": {
        "description": "Get all apps for a specified company in Apigee",
        "summary": "List company apps",
        "tags": [
          "companies"
        ],
        "operationId": "listCompanyApps",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/apigee/details/{company_name}/{app_name}": {
      "get": {
        "description": "Get all apps for a specified company in Apigee",
        "summary": "Get a company app",
        "tags": [
          "companies"
        ],
        "operationId": "getCompanyApp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          },
          {
            "name": "app_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "app name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/repo/list{company_name}": {
      "get": {
        "description": "Get all apps for a company in the repo",
        "summary": "Get all apps for a company in the repo",
        "tags": [
          "companies"
        ],
        "operationId": "listRepoCompanyApp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/repo/details/{company_name}/{app_name}": {
      "get": {
        "description": "Get the details for a company app from the repo",
        "summary": "Get a company app from the repo",
        "tags": [
          "companies"
        ],
        "operationId": "getRepoCompanyApp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          },
          {
            "name": "app_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "app name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/{company_name}": {
      "delete": {
        "description": "Delete a company in Apigee",
        "summary": "Delete company",
        "tags": [
          "companies"
        ],
        "operationId": "deleteCompany",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/companies/{company_name}/{app_name}": {
      "delete": {
        "description": "Delete an a company app",
        "summary": "Delete company app",
        "tags": [
          "companies"
        ],
        "operationId": "deleteCompanyApp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "company_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "company name"
          },
          {
            "name": "app_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "app name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/apigee/list": {
      "get": {
        "description": "List all developers in Apigee",
        "summary": "List developers",
        "tags": [
          "developers"
        ],
        "operationId": "listDevelopers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/apigee/details/{developer_email}": {
      "get": {
        "description": "Details of a developer",
        "summary": "Get a developer",
        "tags": [
          "developers"
        ],
        "operationId": "getDeveloper",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "developer_email",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer email or ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/repo/list": {
      "get": {
        "description": "Get all developers from the repo",
        "summary": "List developers in the repo",
        "tags": [
          "developers"
        ],
        "operationId": "listRepoDevelopers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/repo/details/{developer_id}": {
      "get": {
        "description": "Get the details of a developer from the repo",
        "summary": "Details of a developer from the repo",
        "tags": [
          "developers"
        ],
        "operationId": "getRepoDevelopers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "developer_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer ID"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/repo": {
      "post": {
        "description": "Export developers from Apigee. Also exports apps for each developer. The request body can be developer emails or IDs",
        "summary": "Export developers and developer apps from Apigee",
        "tags": [
          "developers"
        ],
        "operationId": "exportDevelopers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/apigee": {
      "post": {
        "description": "Import developers into Apigee from the repo. Each element in the body is the develper ID",
        "summary": "Import developers into Apigee",
        "tags": [
          "developers"
        ],
        "operationId": "importDevelopers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "put": {
        "description": "Update existing developers in Apigee with data from the repo. Each element in the body is the develper ID",
        "summary": "Update developers in Apigee",
        "tags": [
          "developers"
        ],
        "operationId": "updateDevelopers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/apigee/{developer_id}": {
      "post": {
        "description": "Import developer apps into Apigee from the repo. Each element in the body is an app name",
        "summary": "Import developer apps into Apigee",
        "tags": [
          "developers"
        ],
        "operationId": "importDeveloperApps",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "developer_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer ID"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "put": {
        "description": "Update existing developer apps in Apigee with data from the repo. Each element in the request body is the app name",
        "summary": "Update developer apps in Apigee",
        "tags": [
          "developers"
        ],
        "operationId": "updateDeveloperApps",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "developer_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer ID"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/apigee/list/{developer_email}": {
      "get": {
        "description": "All apps for a specified developer",
        "summary": "List developer apps",
        "tags": [
          "developers"
        ],
        "operationId": "listDeveloperApps",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "developer_email",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer email or ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/apigee/details/{developer_email}/{app_name}": {
      "get": {
        "description": "Details of a developer app",
        "summary": "Get developer app",
        "tags": [
          "developers"
        ],
        "operationId": "getDeveloperApp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "developer_email",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer email or ID"
          },
          {
            "name": "app_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "app name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/{developer_email}": {
      "delete": {
        "description": "Delete a developer from Apigee",
        "summary": "Delete a developer",
        "tags": [
          "developers"
        ],
        "operationId": "deleteDeveloper",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "developer_email",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer email or ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/developers/{developer_email}/{app_name}": {
      "delete": {
        "description": "Delete a developer app",
        "summary": "Delete developer app",
        "tags": [
          "developers"
        ],
        "operationId": "deleteDeveloperApp",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "developer_email",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "developer email or ID"
          },
          {
            "name": "app_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "app name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/apigee/list": {
      "get": {
        "description": "List all KVMs in the specified environment in Apigee",
        "summary": "List KVMs",
        "tags": [
          "kvms"
        ],
        "operationId": "listKvms",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/apigee/list/{kvm_name}": {
      "get": {
        "description": "Get a list of all the entries for a specified KVM in Apigee",
        "summary": "List KVM entries",
        "tags": [
          "kvms"
        ],
        "operationId": "listKvmEntries",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/apigee/details/{kvm_name}": {
      "get": {
        "description": "Details of a single KVM in Apigee",
        "summary": "Get KVM",
        "tags": [
          "kvms"
        ],
        "operationId": "getKVM",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/apigee/details/{kvm_name}/{entry_name}": {
      "get": {
        "description": "Get the details of a single KVM entry in Apigee",
        "summary": "Get KVM entry",
        "tags": [
          "kvms"
        ],
        "operationId": "getKvmEntry",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          },
          {
            "name": "entry_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "entry name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/repo/list": {
      "get": {
        "description": "List of KVMs in the specified environment from the specified repo",
        "summary": "List KVMs in the repo",
        "tags": [
          "kvms"
        ],
        "operationId": "listRepoKvms",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/repo/list/{kvm_name}": {
      "get": {
        "description": "List of all entries for a single KVM in the repo",
        "summary": "List KVM entries for repo KVM",
        "tags": [
          "kvms"
        ],
        "operationId": "listRepoKvmEntries",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/repo/details/{kvm_name}": {
      "get": {
        "description": "Details of KVM in the repo",
        "summary": "Get repo KVM",
        "tags": [
          "kvms"
        ],
        "operationId": "getRepoKvm",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/repo/details/{kvm_name}/{entry_name}": {
      "get": {
        "description": "Get the details for a single KVM entry in the repo",
        "summary": "Get KVM entry for a KVM from repo",
        "tags": [
          "kvms"
        ],
        "operationId": "getRepoKvmEntry",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          },
          {
            "name": "entry_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "entry name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/apigee": {
      "post": {
        "description": "Export KVMs from the repo into Apigee",
        "summary": "Import KVMs",
        "tags": [
          "kvms"
        ],
        "operationId": "importKvms",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/apigee/{kvm_name}": {
      "put": {
        "description": "Update an existing KVM entry using data from the repo",
        "summary": "Update a KVM entry",
        "tags": [
          "kvms"
        ],
        "operationId": "updateKvmEntry",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "post": {
        "description": "Create new entries in an existing KVM in Apigee using data from the repo",
        "summary": "Create a new KVM entry",
        "tags": [
          "kvms"
        ],
        "operationId": "createKvmEntry",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/{kvm_name}": {
      "delete": {
        "description": "Delete a KVM in Apigee",
        "summary": "Delete KVM",
        "tags": [
          "kvms"
        ],
        "operationId": "deleteKvm",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/kvms/{kvm_name}/{entry_name}": {
      "delete": {
        "description": "Delete a KVM entry from an existing KVM in Apigee",
        "summary": "Delete KVM entry",
        "tags": [
          "kvms"
        ],
        "operationId": "deleteKvmEntry",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "kvm_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "KVM name"
          },
          {
            "name": "entry_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "Entry name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationCurrencies/apigee/list": {
      "get": {
        "description": "List all supported currencies in the specified org in Apigee",
        "summary": "List currencies",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "listCurrencies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationCurrencies/apigee/details/{currency_id}": {
      "get": {
        "description": "Get details of a specified supported currency in Apigee",
        "summary": "Get a currency",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "getCurrency",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "currency_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "currency ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationCurrencies/repo/list": {
      "get": {
        "description": "List of all currencies in the specified org from the specified repo",
        "summary": "List currencies from repo",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "listRepoCurrencies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationCurrencies/repo/details/{currency_id}": {
      "get": {
        "description": "Details of a single currency from the repo",
        "summary": "Get a currency from the repo",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "getRepoCurrency",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": ""
          },
          {
            "name": "currency_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "currency ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationCurrencies/repo": {
      "post": {
        "description": "Export supported currencies from Apigee to the repo",
        "summary": "Export currencies",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "exportCurrencies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationCurrencies/apigee": {
      "put": {
        "description": "Update an existing supported currency in Apigee with data from the repo",
        "summary": "Update currencies",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "updateCurrencies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "post": {
        "description": "Import currencies from the repo to Apigee",
        "summary": "Import currencies",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "importCurrencies",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationCurrencies/{currency_id}": {
      "delete": {
        "description": "Delete a supported currency from Apigee",
        "summary": "Delete currency",
        "tags": [
          "monetization currencies"
        ],
        "operationId": "deleteCurrency",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "currency_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "currency ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/apigee/list": {
      "get": {
        "description": "List packages in Apigee in the specified org",
        "summary": "List packages",
        "tags": [
          "monetization packages"
        ],
        "operationId": "listPackages",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/apigee/details/{package_id}": {
      "get": {
        "description": "Get details of a specified package from Apigee",
        "summary": "Get a package",
        "tags": [
          "monetization packages"
        ],
        "operationId": "getPackage",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/apigee/list/{package_id}": {
      "get": {
        "description": "Get the rate plans for a specified package in Apigee",
        "summary": "Get rate plans for a package",
        "tags": [
          "monetization packages"
        ],
        "operationId": "getPackageRatePlans",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/apigee/details/{package_id}/{rate_plan_id}": {
      "get": {
        "description": "Details of a rate plan from Apigee",
        "summary": "Get a rate plan",
        "tags": [
          "monetization packages"
        ],
        "operationId": "getRatePlan",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          },
          {
            "name": "rate_plan_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "rate plan ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/repo/list": {
      "get": {
        "description": "List packages in the specified org from the specified repo",
        "summary": "List repo packages",
        "tags": [
          "monetization packages"
        ],
        "operationId": "listRepoPackages",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/repo/details/{package_id}": {
      "get": {
        "description": "Details for a package from the repo",
        "summary": "Get a package from the repo",
        "tags": [
          "monetization packages"
        ],
        "operationId": "getRepoPackages",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/rate-plans": {
      "get": {
        "description": "List all rate plans in the specified repo",
        "summary": "List all rate plans in the repo",
        "tags": [
          "monetization packages"
        ],
        "operationId": "listAllRepoRatePlans",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/repo/list/{package_id}": {
      "get": {
        "description": "List all rate plans for a specified package in the repo",
        "summary": "Get the rate plans for a package from the repo",
        "tags": [
          "monetization packages"
        ],
        "operationId": "getRepoPackageRatePlans",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/repo/details/{package_id}/{rateplan_id}": {
      "get": {
        "description": "Details for a specified rate plan within a specified package from the repo",
        "summary": "Get a rate plan from the repo",
        "tags": [
          "monetization packages"
        ],
        "operationId": "getRepoRatePlan",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          },
          {
            "name": "rateplan_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "rate plan ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/repo": {
      "post": {
        "description": "Export packages from the specified org in Apigee to the repo. Will also export all the rate plans for the specified package",
        "summary": "Export packages",
        "tags": [
          "monetization packages"
        ],
        "operationId": "exportPackages",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/apigee": {
      "post": {
        "description": "Import packages from the repo to Apigee. Also imports the rate plan data for the package",
        "summary": "Import packages",
        "tags": [
          "monetization packages"
        ],
        "operationId": "importPackages",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/apigee/{package_id}": {
      "post": {
        "description": "Create new rate plans for an existing package in Apigee using rate plan data from the repo",
        "summary": "Create new rate plans in a package",
        "tags": [
          "monetization packages"
        ],
        "operationId": "createRatePlan",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/apigee/{package_id}/{rate_plan_id}": {
      "post": {
        "description": "Create a future rate plan for an existing rate plan in Apigee using rate plan data from the repo. The rate_plan_id must exist in the repo and also be an existing rate plan in Apigee belonging to the specified package_id",
        "summary": "Create a future rate plan",
        "tags": [
          "monetization packages"
        ],
        "operationId": "createFutureRatePlan",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          },
          {
            "name": "rate_plan_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "rate plan ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/product/{package_id}": {
      "post": {
        "description": "Add an API product from the repo to an existing package in Apigee. The product with the same ID must also exist in Apigee",
        "summary": "Add API products to a package",
        "tags": [
          "monetization packages"
        ],
        "operationId": "addProducts",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/product/{package_id}/{product_id}": {
      "delete": {
        "description": "Delete an API product from a package in Apigee",
        "summary": "Remove an API product from a package",
        "tags": [
          "monetization packages"
        ],
        "operationId": "deleteProductFromPackage",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          },
          {
            "name": "product_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "product ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/{package_id}": {
      "delete": {
        "description": "Delete a package from Apigee",
        "summary": "Delete a package",
        "tags": [
          "monetization packages"
        ],
        "operationId": "deletePackage",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/monetizationPackages/{package_id}/{rate_plan_id}": {
      "delete": {
        "description": "Expires a rate plan in a package in Apigee. The expiry will be set to the current time in UTC format",
        "summary": "Expire a rate plan",
        "tags": [
          "monetization packages"
        ],
        "operationId": "expireRatePlan",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "package_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "package ID"
          },
          {
            "name": "rate_plan_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "rate plan ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/notification-email-templates/apigee/list": {
      "get": {
        "description": "List of email templates from the specified org in Apigee",
        "summary": "List email templates",
        "tags": [
          "notification email templates"
        ],
        "operationId": "listEmailTemplates",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/notification-email-templates/apigee/details/{template_id}": {
      "get": {
        "description": "Details of a template from Apigee",
        "summary": "Get an email template",
        "tags": [
          "notification email templates"
        ],
        "operationId": "getEmailTemplate",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "template_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "email template ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/notification-email-templates/repo/list": {
      "get": {
        "description": "List of templates from the repo",
        "summary": "List email templates from the repo",
        "tags": [
          "notification email templates"
        ],
        "operationId": "listRepoEmailTemplates",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/notification-email-templates/repo/details/{template_id}": {
      "get": {
        "description": "Details of a template from the specified repo",
        "summary": "Get an email template from the repo",
        "tags": [
          "notification email templates"
        ],
        "operationId": "getRepoEmailTemplate",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "template_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "email template ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/notification-email-templates/repo": {
      "post": {
        "description": "Export email templates from Apigee to the repo",
        "summary": "Export templates",
        "tags": [
          "notification email templates"
        ],
        "operationId": "exportEmailTemplates",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/notification-email-templates/apigee": {
      "put": {
        "description": "Update an existing email template in Apigee using data from the repo",
        "summary": "Update email templates",
        "tags": [
          "notification email templates"
        ],
        "operationId": "updateEmailTemplates",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "post": {
        "description": "Import email templates to Apigee using data from the repo",
        "summary": "Import email templates",
        "tags": [
          "notification email templates"
        ],
        "operationId": "importEmailTemplates",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/reports/apigee/list": {
      "get": {
        "description": "List reports from the specified org in Apigee",
        "summary": "List reports",
        "tags": [
          "reports"
        ],
        "operationId": "listReports",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/reports/apigee/details/{report_name}": {
      "get": {
        "description": "Details of a report in Apigee",
        "summary": "Get report",
        "tags": [
          "reports"
        ],
        "operationId": "getReport",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "report_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "report name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/reports/repo/list": {
      "get": {
        "description": "List reports in the specified repo",
        "summary": "List reports",
        "tags": [
          "reports"
        ],
        "operationId": "listRepoReports",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/reports/repo/details/{report_name}": {
      "get": {
        "description": "Details of a report in the repo",
        "summary": "Get report from the repo",
        "tags": [
          "reports"
        ],
        "operationId": "getRepoReport",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "report_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "report name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/reports/repo": {
      "post": {
        "description": "Export reports from Apigee to the repo",
        "summary": "Export reports",
        "tags": [
          "reports"
        ],
        "operationId": "exportReports",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/reports/apigee": {
      "put": {
        "description": "Update existing reports in Apigee with data from the repo",
        "summary": "Update reports",
        "tags": [
          "reports"
        ],
        "operationId": "updateReports",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "post": {
        "description": "Import reports from the repo to Apigee",
        "summary": "Import reports",
        "tags": [
          "reports"
        ],
        "operationId": "importReports",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/reports/{report_id}": {
      "delete": {
        "description": "Delete a report from Apigee",
        "summary": "Delete report",
        "tags": [
          "reports"
        ],
        "operationId": "deleteReport",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "report_id",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "report ID"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/apigee/list": {
      "get": {
        "description": "List shared flows from the specified org in Apigee",
        "summary": "List shared flows",
        "tags": [
          "shared flows"
        ],
        "operationId": "listSharedFlows",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/apigee/details/{sharedflow_name}": {
      "get": {
        "description": "Details of a shared flow in Apigee",
        "summary": "Get shared flow",
        "tags": [
          "shared flows"
        ],
        "operationId": "getSharedFlow",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "sharedflow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/apigee/list/{sharedflow_name}": {
      "get": {
        "description": "List of revision for a speicifed shared flow",
        "summary": "List shared flow revisions",
        "tags": [
          "shared flows"
        ],
        "operationId": "listSharedFlowRevisions",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "sharedflow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/apigee/details/{sharedflow_name}/{revision_number}": {
      "get": {
        "description": "Details of a single shared flow revision in Apigee",
        "summary": "Get a shared flow revision",
        "tags": [
          "shared flows"
        ],
        "operationId": "getSharedFlowRevision",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": ""
          },
          {
            "name": "sharedflow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/apigee/deployments/{shared_flow_name}": {
      "get": {
        "description": "Get each deployment of a specified shared flow in Apigee",
        "summary": "Get shared flow deployments",
        "tags": [
          "shared flows"
        ],
        "operationId": "getSharedFlowDeployments",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "shared_flow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/repo/list": {
      "get": {
        "description": "List of shared flows in the specified repo",
        "summary": "List shared flows in the repo",
        "tags": [
          "shared flows"
        ],
        "operationId": "listRepoSharedFlows",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/repo/details/{shared_flow_name}": {
      "get": {
        "description": "Details of a single shared flow in the repo",
        "summary": "Get a shared flow from the repo",
        "tags": [
          "shared flows"
        ],
        "operationId": "getRepoSharedFlow",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "shared_flow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/repo": {
      "post": {
        "description": "Export shared flows from Apigee to the repo",
        "summary": "Export shared flows",
        "tags": [
          "shared flows"
        ],
        "operationId": "exportSharedFlows",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ExportSharedFlowsRequest"
              }
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/apigee": {
      "post": {
        "description": "Import shared flows from the repo to Apigee. Will also deploy the new shared flow",
        "summary": "Import shared flows",
        "tags": [
          "shared flows"
        ],
        "operationId": "importSharedFlows",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/deploy/{shared_flow_name}/{revision_number}": {
      "post": {
        "description": "Deploy a shared flow revision in Apigee",
        "summary": "Deploy a shared flow revision",
        "tags": [
          "shared flows"
        ],
        "operationId": "deploySharedFlow",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "shared_flow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/undeploy/{shared_flow_name}/{revision_number}": {
      "delete": {
        "description": "Undeploy a shared flow revision in Apigee",
        "summary": "Undeploy a shared flow",
        "tags": [
          "shared flows"
        ],
        "operationId": "undeploySharedFlow",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "shared_flow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/{sharedflow_name}/{revision_number}": {
      "delete": {
        "description": "Delete a shared flow revision from Apigee",
        "summary": "Delete a shared flow revision",
        "tags": [
          "shared flows"
        ],
        "operationId": "deleteSharedFlowRevision",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "sharedflow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          },
          {
            "name": "revision_number",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "revision number"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/sharedFlows/{shared_flow_name}": {
      "delete": {
        "description": "Delete a shared flow from Apigee",
        "summary": "Delete a shared flow",
        "tags": [
          "shared flows"
        ],
        "operationId": "deleteSharedFlow",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "shared_flow_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "shared flow name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/targetServers/apigee/list": {
      "get": {
        "description": "List of target servers from the specified environment in Apigee",
        "summary": "List target servers",
        "tags": [
          "target servers"
        ],
        "operationId": "listTargetServers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/targetServers/apigee/details/{target_server_name}": {
      "get": {
        "description": "Details of a target server from Apigee",
        "summary": "Get a target server",
        "tags": [
          "target servers"
        ],
        "operationId": "getTargetServer",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "target_server_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "target server name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/targetServers/repo/list": {
      "get": {
        "description": "List target servers from the specified repo",
        "summary": "List target servers in the repo",
        "tags": [
          "target servers"
        ],
        "operationId": "listRepoTargetServers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/targetServers/repo/details/{target_server_name}": {
      "get": {
        "description": "Details of a target server in the repo",
        "summary": "Get a target server from the repo",
        "tags": [
          "target servers"
        ],
        "operationId": "getRepoTargetServer",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "target_server_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "target server name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/targetServers/repo": {
      "post": {
        "description": "Export target servers from apigee to the repo",
        "summary": "Export target servers",
        "tags": [
          "target servers"
        ],
        "operationId": "exportTargetServers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/targetServers/apigee": {
      "put": {
        "description": "Update target servers in Apigee",
        "summary": "Update target servers",
        "tags": [
          "target servers"
        ],
        "operationId": "updateTargetServers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      },
      "post": {
        "description": "Import target servers from the repo to apigee",
        "summary": "Import target servers",
        "tags": [
          "target servers"
        ],
        "operationId": "importTargetServers",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "repo",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "repo name"
          },
          {
            "name": "Body",
            "in": "body",
            "required": true,
            "description": "",
            "schema": {
              "$ref": "#/definitions/ApigeeRequest"
            }
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    },
    "/targetServers/{target_server_name}": {
      "delete": {
        "description": "Delete a target server from Apigee",
        "summary": "Delete a target server",
        "tags": [
          "target servers"
        ],
        "operationId": "deleteTargetServer",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "org",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "org name"
          },
          {
            "name": "env",
            "in": "query",
            "required": true,
            "type": "string",
            "description": "env name"
          },
          {
            "name": "token",
            "in": "header",
            "required": true,
            "type": "string",
            "description": "access token"
          },
          {
            "name": "target_server_name",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "target server name"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/ApigeeResponse"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "LoginResponse": {
      "title": "loginResponse",
      "example": {
        "code": 200,
        "message": "Hello, username",
        "data": {
          "token": "token"
        }
      },
      "type": "object",
      "properties": {
        "code": {
          "description": "",
          "example": 200,
          "type": "integer",
          "format": "int32"
        },
        "message": {
          "description": "",
          "example": "Hello, username",
          "type": "string"
        },
        "data": {
          "type": "object",
          "properties": {
            "token": {
              "description": "access token",
              "example": "token",
              "type": "string"
            }
          }
        }
      },
      "required": [
        "code",
        "message",
        "data"
      ]
    },
    "UserResponse": {
      "title": "getUserResponse",
      "example": {
        "code": 200,
        "message": "username",
        "data": {
          "username": "username",
          "apiBasicAuthCredentials": "Basic apigee-access-token",
          "config": {
            "orgs": [
              "org"
            ],
            "repoParentDirectory": "absolute\\path\\to\\repo\\parent",
            "apiHostName": "apigee.management.api.host/v1",
            "ssl": {
              "enable": true,
              "passphrase": "ssl-passphrase",
              "key": "path\\to\\key",
              "cert": "path\\to\\cert"
            },
            "proxy": {
              "enable": true,
              "username": "proxy-username",
              "password": "proxy-password",
              "scheme": "http",
              "host": "proxy.host",
              "port": 8080
            },
            "tests": [
              {
                "id": "test-id",
                "name": "My postman tests",
                "collection": "MyPostmanTest.postman_collection.json",
                "environment": "MyPostmanTest.postman_environment.json"
              }
            ]
          }
        }
      },
      "type": "object",
      "properties": {
        "code": {
          "description": "",
          "example": 200,
          "type": "integer",
          "format": "int32"
        },
        "message": {
          "description": "",
          "example": "username",
          "type": "string"
        },
        "data": {
          "$ref": "#/definitions/User"
        }
      },
      "required": [
        "code",
        "message",
        "data"
      ]
    },
    "ApigeeResponse": {
      "title": "apigeeResponse",
      "type": "object",
      "properties": {
        "code": {
          "description": "",
          "example": 200,
          "type": "integer",
          "format": "int32"
        },
        "message": {
          "description": "",
          "example": "Context sensitive message",
          "type": "string"
        },
        "data": {
          "description": "Generally reflects the response directly from the Apigee management API. May be an object or an array",
          "type": "object"
        }
      }
    },
    "ApigeeRequest": {
      "type": "array",
      "items": {
        "type": "string",
        "description": "item name or ID",
        "example": "item-name-or-id"
      }
    },
    "User": {
      "title": "user",
      "example": {
        "username": "username",
        "apiBasicAuthCredentials": "Basic apigee-access-token",
        "config": {
          "orgs": [
            "org"
          ],
          "repoParentDirectory": "absolute\\path\\to\\repo\\parent",
          "apiHostName": "apigee.management.api.host/v1",
          "ssl": {
            "enable": true,
            "passphrase": "ssl-passphrase",
            "key": "path\\to\\key",
            "cert": "path\\to\\cert"
          },
          "proxy": {
            "enable": true,
            "username": "proxy-username",
            "password": "proxy-password",
            "scheme": "http",
            "host": "proxy.host",
            "port": 8080
          },
          "tests": [
            {
              "id": "test-id",
              "name": "My postman tests",
              "collection": "MyPostmanTest.postman_collection.json",
              "environment": "MyPostmanTest.postman_environment.json"
            }
          ]
        }
      },
      "type": "object",
      "properties": {
        "username": {
          "description": "",
          "example": "username",
          "type": "string"
        },
        "apiBasicAuthCredentials": {
          "description": "",
          "example": "Basic apigee-access-token",
          "type": "string"
        },
        "config": {
          "$ref": "#/definitions/UserConfig"
        }
      },
      "required": [
        "username",
        "apiBasicAuthCredentials",
        "config"
      ]
    },
    "UserConfig": {
      "title": "Config",
      "example": {
        "orgs": [
          "org"
        ],
        "repoParentDirectory": "absolute\\path\\to\\repo\\parent",
        "apiHostName": "apigee.management.api.host/v1",
        "ssl": {
          "enable": true,
          "passphrase": "ssl-passphrase",
          "key": "path\\to\\key",
          "cert": "path\\to\\cert"
        },
        "proxy": {
          "enable": true,
          "username": "proxy-username",
          "password": "proxy-password",
          "scheme": "http",
          "host": "proxy.host",
          "port": 8080
        },
        "tests": [
          {
            "id": "test-id",
            "name": "My postman tests",
            "collection": "MyPostmanTest.postman_collection.json",
            "environment": "MyPostmanTest.postman_environment.json"
          }
        ]
      },
      "type": "object",
      "properties": {
        "orgs": {
          "description": "",
          "example": [
            "org"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "repoParentDirectory": {
          "description": "",
          "example": "absolute\\path\\to\\repo\\parent",
          "type": "string"
        },
        "apiHostName": {
          "description": "",
          "example": "apigee.management.api.host/v1",
          "type": "string"
        },
        "ssl": {
          "$ref": "#/definitions/UserSsl"
        },
        "proxy": {
          "$ref": "#/definitions/UserProxy"
        },
        "tests": {
          "description": "",
          "example": [
            {
              "id": "test-id",
              "name": "My postman tests",
              "collection": "MyPostmanTest.postman_collection.json",
              "environment": "MyPostmanTest.postman_environment.json"
            }
          ],
          "type": "array",
          "items": {
            "$ref": "#/definitions/UserTest"
          }
        }
      },
      "required": [
        "orgs",
        "repoParentDirectory",
        "apiHostName",
        "ssl",
        "proxy",
        "tests"
      ]
    },
    "UserSsl": {
      "title": "Ssl",
      "example": {
        "enable": true,
        "passphrase": "ssl-passphrase",
        "key": "path\\to\\key",
        "cert": "path\\to\\cert"
      },
      "type": "object",
      "properties": {
        "enable": {
          "description": "",
          "example": true,
          "type": "boolean"
        },
        "passphrase": {
          "description": "",
          "example": "ssl-passphrase",
          "type": "string"
        },
        "key": {
          "description": "",
          "example": "path\\to\\key",
          "type": "string"
        },
        "cert": {
          "description": "",
          "example": "path\\to\\cert",
          "type": "string"
        }
      },
      "required": [
        "enable",
        "passphrase",
        "key",
        "cert"
      ]
    },
    "UserProxy": {
      "title": "Proxy",
      "example": {
        "enable": true,
        "username": "proxy-username",
        "password": "proxy-password",
        "scheme": "http",
        "host": "proxy.host",
        "port": 8080
      },
      "type": "object",
      "properties": {
        "enable": {
          "description": "",
          "example": true,
          "type": "boolean"
        },
        "username": {
          "description": "",
          "example": "proxy-username",
          "type": "string"
        },
        "password": {
          "description": "",
          "example": "proxy-password",
          "type": "string"
        },
        "scheme": {
          "description": "",
          "example": "http",
          "type": "string"
        },
        "host": {
          "description": "",
          "example": "proxy.host",
          "type": "string"
        },
        "port": {
          "description": "",
          "example": 8080,
          "type": "string"
        }
      },
      "required": [
        "enable",
        "username",
        "password",
        "scheme",
        "host",
        "port"
      ]
    },
    "UserTest": {
      "title": "Test",
      "example": {
        "id": "test-id",
        "name": "My postman tests",
        "collection": "MyPostmanTest.postman_collection.json",
        "environment": "MyPostmanTest.postman_environment.json"
      },
      "type": "object",
      "properties": {
        "id": {
          "description": "",
          "example": "test-id",
          "type": "string"
        },
        "name": {
          "description": "",
          "example": "My postman tests",
          "type": "string"
        },
        "collection": {
          "description": "",
          "example": "MyPostmanTest.postman_collection.json",
          "type": "string"
        },
        "environment": {
          "description": "",
          "example": "MyPostmanTest.postman_environment.json",
          "type": "string"
        }
      },
      "required": [
        "id",
        "name",
        "collection",
        "environment"
      ]
    },
    "ExportProxiesRequest": {
      "title": "exportProxiesRequest",
      "example": {
        "name": "{{proxy_name}}",
        "revision_number": "{{revision_number}}"
      },
      "type": "object",
      "properties": {
        "name": {
          "description": "",
          "example": "{{proxy_name}}",
          "type": "string"
        },
        "revision_number": {
          "description": "",
          "example": "{{revision_number}}",
          "type": "string"
        }
      },
      "required": [
        "name",
        "revision_number"
      ]
    },
    "ExportSharedFlowsRequest": {
      "title": "exportSharedFlowsRequest",
      "example": {
        "name": "{{shared_flow_name}}",
        "revision_number": "{{revision_number}}"
      },
      "type": "object",
      "properties": {
        "name": {
          "description": "",
          "example": "{{shared_flow_name}}",
          "type": "string"
        },
        "revision_number": {
          "description": "",
          "example": "{{revision_number}}",
          "type": "string"
        }
      },
      "required": [
        "name",
        "revision_number"
      ]
    }
  }
}

export default SWAGGER;