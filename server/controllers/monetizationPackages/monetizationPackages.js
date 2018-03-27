const express = require("express");
const router = express.Router();
var moment = require("moment");
var path = require("path");

// middlewares
const verifyJWT = require("../../middlewares/verify-jwt");
const validateHostName = require("../../middlewares/validate-host-name");
const validateRepo = require("../../middlewares/validate-repo");
const validateOrg = require("../../middlewares/validate-org");
const validateBody = require("../../middlewares/validate-body");
const validateEntryExists = require("../../middlewares/validate-entry-exists");
const validatePackageName = require("../../middlewares/validate-package-name");

// helpers
const responseHelper = require("../../helpers/response-helper");
const fileHelper = require("../../helpers/file-helper");

// models
const apigee = require("../../models/apigee");
var ApigeeResponse = require("../../models/apigee-response");

// called on every request
router.use("/", verifyJWT, validateOrg, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/monetization-packages`;
  res.locals.repoExtension = `/config/org/${
    res.locals.org
  }/monetizationPackages.json`;
  res.locals.ratePlanPath = `${res.locals.user.config.repoParentDirectory}/${
    req.query.repo
  }/config/org/${res.locals.org}/monetizationPackageRateplans.json`;
  next();
});

// get list of packages from apigee
router.get("/apigee/list", validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(res.locals.apiEndpoint, res.locals.user, true);
    responseHelper.handleResponse(res, `Packages from apigee`, data);
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from apigee
router.get(
  "/apigee/details/:packageId",
  validateHostName,
  async (req, res, next) => {
    try {
      var data = await apigee.get(
        `${res.locals.apiEndpoint}/${req.params.packageId}`,
        res.locals.user,
        true
      );
      responseHelper.handleResponse(
        res,
        `Details for package ${req.params.packageId}`,
        data
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// get list of rate plans in a package in apigee
router.get(
  "/apigee/list/:packageId",
  validateHostName,
  async (req, res, next) => {
    try {
      responseHelper.handleResponse(
        res,
        `Rate plans for package ${req.params.packageId}`,
        await apigee.get(
          `${res.locals.apiEndpoint}/${
            req.params.packageId
          }/rate-plans?showPrivate=true&current=false`,
          res.locals.user,
          true
        )
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// details of a rate plan in a package in apigee
router.get(
  "/apigee/details/:packageId/:rateplanId",
  validateHostName,
  async (req, res, next) => {
    try {
      responseHelper.handleResponse(
        res,
        `Rate plans for package ${req.params.packageId}`,
        await apigee.get(
          `${res.locals.apiEndpoint}/${req.params.packageId}/rate-plans/${
            req.params.rateplanId
          }`,
          res.locals.user,
          true
        )
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// read from repo
router.get("/repo/list", validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(
      res,
      `Packages from repo`,
      await fileHelper.read(res.locals.repoFilePath)
    );
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from the repo
router.get("/repo/details/:packageId", validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(
      res,
      `Data for ${req.params.packageId} from repo`,
      data[data.findIndex(x => x.id === req.params.packageId)] || "Not found"
    );
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get all the rates plans in the repo
router.get(`/rate-plans`, validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(
      res,
      `All rate plans in repo`,
      await fileHelper.read(res.locals.ratePlanPath)
    );
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get a list of the rate plans for a package from the repo
router.get("/repo/list/:packageId", validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.ratePlanPath);
    responseHelper.handleResponse(
      res,
      `Rate plans for ${req.params.packageId}`,
      data.reduce(
        (a, e, i) =>
          e.monetizationPackage.id === req.params.packageId ? a.concat(e) : a,
        []
      )
    );
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of a rate plan from the repo
router.get(
  "/repo/details/:packageId/:rateplanId",
  validateRepo,
  async (req, res, next) => {
    try {
      var data = await fileHelper.read(res.locals.ratePlanPath);
      responseHelper.handleResponse(
        res,
        `Details for rate plan ${req.params.rateplanId} from repo`,
        data.find(
          x =>
            x.monetizationPackage.id === req.params.packageId &&
            x.id === req.params.rateplanId
        )
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// create new package. When we import the package, we also import the rate plan data for that package.
router.post(
  "/apigee",
  validateRepo,
  validateBody,
  validateEntryExists,
  validatePackageName,
  async (req, res, next) => {
    try {
      var results = [];

      await Promise.all(
        req.body.map(async packageId => {
          var data = await fileHelper.read(res.locals.repoFilePath);
          var package = data.find(x => x.id === packageId);

          // import the package data
          delete package.id;
          package.organization.id = res.locals.org;
          var newPackage = package;
          var packageResponse = await apigee.post(
            res.locals.apiEndpoint,
            res.locals.user,
            true,
            package
          );
          newPackage = packageResponse.body;

          // get the rateplan data from the repo
          var data = await fileHelper.read(
            res.locals.repoFilePath.replace(
              "monetizationPackages",
              "monetizationPackageRateplans"
            )
          );
          var ratePlans = data.filter(
            x => x.monetizationPackage.id === packageId
          );

          // import the rate plan data
          var ratePlanResults = [];
          await Promise.all(
            ratePlans.map(async ratePlan => {
              // update the rate plan data
              delete ratePlan.id;
              ratePlan.monetizationPackage.id = newPackage.id;
              ratePlan.organization.id = res.locals.org;
              ratePlan.startDate = moment(moment.utc()).format(
                "YYYY-MM-DD HH:mm:ss"
              );

              // update each the organization.id for each object in the ratePlanDetails array.
              ratePlan.ratePlanDetails.forEach(details => {
                details.organization.id = res.locals.org;
              });

              // create the rate plan
              ratePlanResults.push(
                new ApigeeResponse(
                  await apigee.post(
                    `${res.locals.apiEndpoint}/${newPackage.id}/rate-plans`,
                    res.locals.user,
                    true,
                    ratePlan
                  )
                )
              );
            })
          );
          results.push({
            [newPackage.id]: {
              package: new ApigeeResponse(packageResponse),
              rateplans: ratePlanResults
            }
          });
        })
      );

      responseHelper.handleResponse(
        res,
        "Create new package and rate plans in apigee",
        results
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// create rateplans in a package
router.post(
  "/apigee/:packageId",
  validateHostName,
  validateRepo,
  validateBody,
  async (req, res, next) => {
    try {
      var results = [];

      // read the rate plan data from the repo
      var fileData = await fileHelper.read(res.locals.ratePlanPath);

      await Promise.all(
        req.body.map(async el => {
          var data = fileData.find(x => x.id === el);

          if (data) {
            // update the rate plan data
            delete data.id;
            data.monetizationPackage.id = req.params.packageId;
            data.organization.id = res.locals.org;
            data.startDate = moment(moment.utc())
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss");

            // update the organization.id for each object in the ratePlanDetails array.
            data.ratePlanDetails.forEach(details => {
              details.organization.id = res.locals.org;
            });

            // create the rate plan
            results.push(
              new ApigeeResponse(
                await apigee.post(
                  `${res.locals.apiEndpoint}/${
                    req.params.packageId
                  }/rate-plans`,
                  res.locals.user,
                  true,
                  data
                )
              )
            );
          }
        })
      );
      responseHelper.handleResponse(
        res,
        `Create rate plans for package ${req.params.packageId}`,
        results
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// create a future rate plan
router.post(
  "/apigee/:packageId/:rateplanId",
  validateHostName,
  validateRepo,
  async (req, res, next) => {
    try {
      // get the package
      var response = await apigee.get(
        `${res.locals.apiEndpoint}/${req.params.packageId}`,
        res.locals.user,
        true
      );
      var package;
      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        package = JSON.parse(response.body);
      } else {
        // cancel the request if we dont get the package for whatever reason
        return responseHelper.handleError(res, response);
      }

      //read in the rate plan data from the repo
      var fileData = await fileHelper.read(res.locals.ratePlanPath);

      // confirm the rate plan exists in the repo
      var rateplan = fileData.find(x => x.id === req.params.rateplanId);
      if (!rateplan) {
        return responseHelper.handleError(res, {
          statusCode: 404,
          statusMessage: `${req.params.rateplanId} not found in ${
            res.locals.ratePlanPath
          }!`
        });
      }

      // check that each product in the package is in the rate plan data
      package.product.forEach(product => {
        if (!rateplan.ratePlanDetails.find(x => x.product.id === product.id)) {
          // return if a product in the rate plan is not in package
          return responseHelper.handleError(res, {
            statusCode: 404,
            statusMessage: `${product.id} not found in ${
              req.params.rateplanId
            } rate plan details!`
          });
        }
      });

      // update the rateplan data before posting
      // if the rate plan has an end date we set the future rate plan to the end date + 30 seconds.
      // if the start date is greater than today then we set the start date of the future rate plan to tomorrow
      // otherwsie we set the start date to the start of today
      delete rateplan.id;
      rateplan.startDate = rateplan.endDate
        ? moment(moment.utc(rateplan.endDate))
            .add(30, "s")
            .format("YYYY-MM-DD HH:mm:ss")
        : moment(moment.utc(rateplan.startDate)) >
          moment(moment.utc()).startOf("day")
          ? moment(moment.utc(rateplan.startDate))
              .add(1, "days")
              .format("YYYY-MM-DD HH:mm:ss")
          : moment(moment.utc())
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss");
      rateplan.organization.id = res.locals.org;
      rateplan.ratePlanDetails.forEach(r => {
        r.organization.id = res.locals.org;
      });
      rateplan.parentRatePlan = { id: req.params.rateplanId };
      delete rateplan.endDate;

      // create the future rate plan
      var result = await apigee.post(
        `${res.locals.apiEndpoint}/${req.params.packageId}/rate-plans/${
          req.params.rateplanId
        }/revision`,
        res.locals.user,
        true,
        rateplan
      );
      responseHelper.handleResponse(
        res,
        `Create future rate plan ${req.params.rateplanId} in package ${
          req.params.packageId
        }`,
        result
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// add api products to a package
router.post(
  "/product/:packageId",
  verifyJWT,
  validateOrg,
  validateBody,
  async (req, res, next) => {
    try {
      var results = [];

      // check that each project exists first
      await Promise.all(
        req.body.map(async product => {
          await apigee.get(
            `${res.locals.org}/apiproducts/${product}`,
            res.locals.user
          );
        })
      );

      // add each product to the package
      await Promise.all(
        req.body.map(async product => {
          results.push(
            new ApigeeResponse(
              await apigee.post(
                `${res.locals.apiEndpoint}/${
                  req.params.packageId
                }/products/${product}`,
                res.locals.user,
                true,
                {}
              )
            )
          );
        })
      );

      responseHelper.handleResponse(
        res,
        `Add products to package ${req.params.packageId}`,
        results
      );
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

// write data from apigee to the repo
router.post("/repo", validateRepo, validateBody, async (req, res, next) => {
  try {
    // data to write
    var packageData = [];
    var ratePlanData = [];
    var results = [];

    await Promise.all(
      req.body.map(async packageId => {
        // get the package data from apigee
        var response = await apigee.get(
          `${res.locals.apiEndpoint}/${packageId}`,
          res.locals.user,
          true
        );
        var package;

        if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
          package = JSON.parse(response.body);
        }

        if (package) {
          // overwrite the package.product object with just the id
          package.product.forEach(p => {
            package.product[package.product.indexOf(p)] = { id: p.id };
          });

          // overwrite the package.organization object with just the org id
          package.organization = { id: package.organization.id };

          // add the transformed package data to the data array for writing
          packageData.push(package);

          // get the rate plan data for the package
          var response = await apigee.get(
            `${
              res.locals.apiEndpoint
            }/${packageId}/rate-plans?showPrivate=true&current=false`,
            res.locals.user,
            true
          );

          if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
            // transform the data so we dont write any unnecessary data
            var ratePlan = JSON.parse(response.body).ratePlan;
            ratePlan.forEach(rateplan => {
              rateplan.currency = { id: rateplan.currency.id };
              rateplan.monetizationPackage = {
                id: rateplan.monetizationPackage.id
              };
              rateplan.organization = { id: rateplan.organization.id };
              rateplan.ratePlanDetails.forEach(r => {
                delete r.id;
                r.currency = { id: r.currency.id };
                r.organization = { id: r.organization.id };
                if (r.product) {
                  r.product = { id: r.product.id };
                }
                r.ratePlanRates.forEach(rpr => {
                  delete rpr.id;
                });
              });
            });
            ratePlanData = ratePlanData.concat(ratePlan);
          }
          results.push({
            [packageId]: { package: package, rateplans: ratePlan }
          });
        }
      })
    );

    // write the package data to the repo
    await fileHelper.write(res.locals.repoFilePath, packageData);

    // write the rateplan data to the repo
    await fileHelper.write(
      res.locals.repoFilePath.replace(
        "monetizationPackages",
        "monetizationPackageRateplans"
      ),
      ratePlanData
    );

    // finish
    responseHelper.handleResponse(
      res,
      `Wrote monetization package and rate plan data to repo`,
      results
    );
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a product from a package
router.delete("/product/:packageId/:productId", async (req, res, next) => {
  try {
    var result = await apigee.delete(
      `${res.locals.apiEndpoint}/${req.params.packageId}/products/${
        req.params.productId
      }`,
      res.locals.user,
      true
    );
    responseHelper.handleResponse(
      res,
      `Delete product ${req.params.productId} from package ${
        req.params.packageId
      }`,
      result
    );
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete package
router.delete("/:packageId", async (req, res, next) => {
  try {
    var result = await apigee.delete(
      `${res.locals.apiEndpoint}/${req.params.packageId}`,
      res.locals.user,
      true
    );
    responseHelper.handleResponse(
      res,
      `Delete monetization package ${req.params.packageId}`,
      result
    );
  } catch (e) {
    responseHelper.handleError(res, e);
  }
});

// expire a rate plan
router.delete(
  "/:packageId/:rateplanId",
  validateHostName,
  async (req, res, next) => {
    try {
      var response = await apigee.get(
        `${res.locals.apiEndpoint}/${req.params.packageId}/rate-plans/${
          req.params.rateplanId
        }`,
        res.locals.user,
        true
      );

      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        var rateplan = JSON.parse(response.body);

        rateplan.endDate = moment(moment.utc()).format("YYYY-MM-DD HH:mm:ss");
        var result = await apigee.put(
          `${res.locals.apiEndpoint}/${req.params.packageId}/rate-plans/${
            req.params.rateplanId
          }`,
          res.locals.user,
          true,
          rateplan
        );

        responseHelper.handleResponse(
          res,
          `Expire rate plan ${req.params.rateplanId}`,
          result
        );
      } else {
        responseHelper.handleError(res, response);
      }
    } catch (e) {
      responseHelper.handleError(res, e);
    }
  }
);

module.exports = router;
