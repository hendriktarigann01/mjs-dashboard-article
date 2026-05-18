const app = require("../../../index.js");

module.exports = async (req, res) => {
  // Ensure Netlify Function supports Express parsing/response methods.
  // Express uses Node's req/res; Netlify provides compatible objects.
  return app.handle(req, res);
};
