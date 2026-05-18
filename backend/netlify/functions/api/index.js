const serverless = require("serverless-http");
const app = require("../../../index.js");
const { connectDb } = require("../../../lib/db.js");

const handler = serverless(app);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDb();
  return handler(event, context);
};
