'use strict'

const logger = use('Logger')
const odata = require("@odata/client");
require("@odata/client/lib/polyfill")

class ODataController {
  async batchRequest({ request, response }) {
    logger.debug('==> ODataController.batchRequest()');

    try {
      const TestServiceURL = "https://services.odata.org/V4/Northwind/Northwind.svc/$metadata"
      const client = odata.OData.New({
        metadataUri: TestServiceURL,
        version: 'v4'
        // variant: "c4c"
      })

      const result = await this.runner(client);
      console.log(result);

      logger.debug('<== ODataController.batchRequest()');
      return response.status(200).send(result);
    }
    catch (error) {
      logger.error(error);
      return response.status(500).send(error);
    }
  }

  async runner(client) {
    // execute reqeusts and return mocked responses
    const result = await client.execBatchRequests([
      client.newBatchRequest({
        collection: "Customers",
        method: "GET"
        //withContentLength: true, for SAP OData, please set this flag as true
      }),
      client.newBatchRequest({
        collection: "Regions",
        //collection: "Employees",
        method: "GET"
        // withContentLength: true, for SAP OData, please set this flag as true
      })
    ])

    // https://flaviocopes.com/javascript-async-await-array-map/
    // https://futurestud.io/tutorials/node-js-how-to-run-an-asynchronous-function-in-array-map
    return await Promise.all(result.map(async res => {
      const resJson = await res.json();
      return resJson.value;
    }));
  }
}

module.exports = ODataController
