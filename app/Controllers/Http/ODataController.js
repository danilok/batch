'use strict'

const env = use('Env')
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
      const data = []

      result.forEach(async batchRes => {
        const res = await batchRes;
        data.push(res.value);
      });

      logger.debug('<== ODataController.batchRequest()');
      return response.status(200).send(data);
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
        //collection: "Regions", //"Employees",
        collection: "Employees",
        method: "GET"
        // withContentLength: true, for SAP OData, please set this flag as true
      })
    ])

    const dados = result.map(async res => {
      const resposta = await res.json();
      return resposta;
    });
    return dados;
  }
}

module.exports = ODataController
