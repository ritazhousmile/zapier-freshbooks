const InvoiceCreate = require('./creates/invoice');
const ClientCreate = require('./creates/client');
const InvoiceTrigger = require('./triggers/invoice');

const authentication = require('./authentication');
const ClientTrigger = require('./triggers/client');

// To include the Authorization header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  return request;
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [includeBearerToken],

  afterResponse: [],

  resources: {},

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [InvoiceTrigger.key]: InvoiceTrigger,
    [ClientTrigger.key]: ClientTrigger,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [InvoiceCreate.key]: InvoiceCreate,
    [ClientCreate.key]: ClientCreate,
    // [clientCreate.key]: clientCreate,
  }
};

// Finally, export the app.
module.exports = App;
