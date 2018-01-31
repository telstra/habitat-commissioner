# Additional Operations
Some items allow for additional operations to be performed on them.

#### Repo View
- **Key value maps: Entry** Each individual key value map entry has two additional options that require the KVM to already exist in Apigee. **Add this entry** will create a new entry in the KVM in Apigee using the data for the selected KVM entry. **Update this entry** will take the name value of the KVM entry and attempt to update the value of the entry of the existing KVM in Apigee with the value of the entry in the repo

- **Monetization rate plans:** You are able to create future rate plans for existing rate plans in Apigee using data from the repo. The rate plan ID must be the same in the Repo and in Apigee in order for this to work. The future rate plan will be scheduled at whatever is latest: The original rates plans end date, the original rates plans start date or the current time.


#### Apigee View
- **Delete:** Available to most items in the Apigee view. Will attempt to delete the item from Apigee.

- **Key value maps: Entry** Delete a single entry from a KVM in Apigee

- **Monetization Packages:** **Add rate plans** will display a selection of rate plans pulled from the Repo which you can select and add to the package in Apigee. **Add API Products** allows you to pick from all of the API products available in selected org and add them to the package. **Remove an API product** will delete a selected API product from the package.

- **Monetization rate plans:** Attempt to end date the selected rate plan. The end date will be set as the current time.

- **Proxy or Shared Flow revision:** Deploy, undeploy or delete the selected proxy/ shared flow revision