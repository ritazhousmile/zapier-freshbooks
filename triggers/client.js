const subscribeHook = (z, bundle) => {

  // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
  const data = {
    url: bundle.targetUrl,
    username: bundle.inputData.username,
    email: bundle.inputData.email
  };

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: 'https://api.freshbooks.com/events/account/{{bundle.inputData.account_id}}/events/callbacks',
    method: 'POST',
    body: JSON.stringify(data)
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
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

const getClient = (z, bundle) => {
  // bundle.cleanedRequest will include the parsed JSON object (if it's not a
  // test poll) and also a .querystring property with the URL's query string.
  const client = {
    fname: bundle.cleanedRequest.first_name,
    lname: bundle.cleanedRequest.lname,
    email: bundle.cleanedRequest.email,
    organization: bundle.cleanedRequest.organization,
    username: bundle.cleanedRequest.username,
    mob_phone: bundle.cleanedRequest.mob_phone,
    p_street: bundle.cleanedRequest.p_street,
    p_city: bundle.cleanedRequest.p_city,
    p_province: bundle.cleanedRequest.p_province,
    p_code: bundle.cleanedRequest.p_code,
    language: bundle.cleanedRequest.language,
    currency_code: bundle.cleanedRequest.currency_code,
  };

  return [client];
};

const getFallbackRealClient = async (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  z.console.log(bundle.inputData)
  const options = {
    url: 'https://api.freshbooks.com/accounting/account/{{bundle.inputData.account_id}}/users/clients',
    // params: {
    //   style: bundle.inputData.style
    // }
  };

  let response = await z.request(options);

    if (response.status !==200) {
    throw new Error('bad request ' + response.content);
    }
  let clients = response.json.response.result.clients
  z.console.log(clients[0])
  return clients
};



// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'client',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'client',
  display: {
    label: 'New Client',
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

    perform: getClient,
    performList: getFallbackRealClient,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample:  {
        "accounting_systemid": "AQW5qM",
        "allow_late_fees": true,
        "allow_late_notifications": true,
        "bus_phone": "",
        "company_industry": null,
        "company_size": null,
        "currency_code": "USD",
        "direct_link_token": null,
        "email": "chiefastro@gmail.com",
        "fax": "",
        "fname": "",
        "has_retainer": null,
        "home_phone": "4132308026",
        "id": 124011,
        "language": "en",
        "last_activity": null,
        "last_login": null,
        "level": 0,
        "lname": "",
        "mob_phone": "",
        "note": null,
        "notified": false,
        "num_logins": 0,
        "organization": "knowledge roundtable",
        "p_city": "Madbury",
        "p_code": "03823",
        "p_country": "United States",
        "p_province": "New Hampshire",
        "p_street": "276 littleworth rd",
        "p_street2": "",
        "pref_email": true,
        "pref_gmail": false,
        "retainer_id": null,
        "role": "client",
        "s_city": "",
        "s_code": "",
        "s_country": "",
        "s_province": "",
        "s_street": "",
        "s_street2": "",
        "signup_date": "2020-01-02 21:41:47",
        "statement_token": null,
        "subdomain": null,
        "updated": "2020-01-02 16:41:48",
        "userid": 124011,
        "username": "3hp83Pg9qv",
        "vat_name": null,
        "vat_number": "",
        "vis_state": 0
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
  }
};
