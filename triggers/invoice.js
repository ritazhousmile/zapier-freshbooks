const subscribeHook = async (z, bundle) => {

  // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
  const data = {
    "callback": {
        uri: bundle.targetUrl,
        event: "invoice.create",
        account_id: bundle.inputData.account_id
    }
  }

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: 'https://api.freshbooks.com/events/account/{{bundle.inputData.account_id}}/events/callbacks',
    method: 'POST',
    body: data
  };

  const response = await z.request(options)
  // z.console.log(response.json.response.result.invoices)
  // z.console.log(response.json)

  if (response.status !== 200) {
    throw new Error("there is an issue registering the webhook")
  }

  return response
  // You may return a promise or a normal data structure from any perform method.
  // return z.request(options)
  //   .then((response) => JSON.parse(response.content));
};

const unsubscribeHook = (z, bundle) => {
  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.id;

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `https://api.freshbooks.com/events/account/{{bundle.inputData.account_id}}/events/callbacks/${hookId}`,
    method: 'DELETE',
  };

  // You may return a promise or a normal data structure from any perform method.
    return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const getInvoice = (z, bundle) => {
  // bundle.cleanedRequest will include the parsed JSON object (if it's not a
  // test poll) and also a .querystring property with the URL's query string.
  const invoice = {
    status: bundle.cleanedRequest.status,
    create_date: bundle.cleanedRequest.create_date,
    outstanding: bundle.cleanedRequest.outstanding,
    payment_status: bundle.cleanedRequest.payment_status,
    id: bundle.cleanedRequest.id
    // due_date: bundle.cleanedRequest.due_date,
    // invoice_number: bundle.cleanedRequest.invoice_number,
    // customerid: bundle.cleanedRequest.customerid,
    // organization: bundle.cleanedRequest.organization
  };

  return [invoice];
};

const getFallbackRealInvoices = async (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: 'https://api.freshbooks.com/accounting/account/{{bundle.inputData.account_id}}/invoices/invoices',

  };

  let response = await z.request(options);

    if (response.status !==200) {
    throw new Error('bad request ' + response.content);
    }
  let invoices = response.json.response.result.invoices
  return invoices
};



// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'invoice',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'client',
  display: {
    label: 'New Invoice',
    description: 'Trigger when a new client is added.'
  },

  // `operation` is where the business logic goes.
  operation: {

    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    inputFields: [
      {key: 'account_id', type: 'string', helpText: 'Which account do you want to choose'}
    ],

    type: 'hook',

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getInvoice,
    performList: getFallbackRealInvoices,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample:  {
      "accountid": "AQW5qM",
      "accounting_systemid": "AQW5qM",
      "address": "",
      "amount": {
        "amount": "100.00",
        "code": "USD"
      },
      "auto_bill": false,
      "autobill_status": null,
      "basecampid": 0,
      "city": "Madbury",
      "code": "03823",
      "country": "United States",
      "create_date": "2020-01-03",
      "created_at": "2020-01-03 11:46:43",
      "currency_code": "USD",
      "current_organization": "knowledge roundtable",
      "customerid": 124011,
      "date_paid": null,
      "deposit_amount": null,
      "deposit_percentage": null,
      "deposit_status": "none",
      "description": "",
      "discount_description": null,
      "discount_total": {
        "amount": "0.00",
        "code": "USD"
      },
      "discount_value": "0",
      "display_status": "sent",
      "dispute_status": null,
      "due_date": "2020-02-02",
      "due_offset_days": 30,
      "estimateid": 0,
      "ext_archive": 0,
      "fname": "",
      "fulfillment_date": "2020-01-03",
      "generation_date": null,
      "gmail": false,
      "id": 65009,
      "invoice_number": "0000001",
      "invoiceid": 65009,
      "language": "en",
      "last_order_status": null,
      "lname": "",
      "notes": "",
      "organization": "knowledge roundtable",
      "outstanding": {
        "amount": "100.00",
        "code": "USD"
      },
      "ownerid": 1,
      "paid": {
        "amount": "0.00",
        "code": "USD"
      },
      "parent": 0,
      "payment_details": "",
      "payment_status": "unpaid",
      "po_number": "100.00",
      "province": "New Hampshire",
      "return_uri": null,
      "sentid": 1,
      "show_attachments": false,
      "status": 2,
      "street": "276 littleworth rd",
      "street2": "",
      "template": "clean-grouped",
      "terms": null,
      "updated": "2020-01-03 11:46:43",
      "v3_status": "sent",
      "vat_name": null,
      "vat_number": "",
      "vis_state": 0
    }
      }

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    // outputFields: [
    //   {key: 'id', label: 'ID'},
    //   {key: 'createdAt', label: 'Created At'},
    //   {key: 'first_name', label: 'First Name'},
    //   {key: 'last_name', label: 'Last Name'},
    //   {key: 'email', label: 'Email'},
    //   {key: 'mob_phone', label: 'Moble Phone'},
    // ]

};
