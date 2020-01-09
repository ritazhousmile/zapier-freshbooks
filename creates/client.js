// create a particular client by name
const createClient = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: `https://api.freshbooks.com/accounting/account/${bundle.inputData.account_id}/users/clients`,
    body: JSON.stringify({
    client: {
        email: bundle.inputData.email,
        fname: bundle.inputData.fname,
        lname: bundle.inputData.lname,
        note: bundle.inputData.note,
        home_phone: bundle.inputData.home_phone,
        language: bundle.inputData.language,
        organization: bundle.inputData.organization,
        mob_phone: bundle.inputData.mob_phone,
        work_phone: bundle.inputData.work_phone,
        p_street: bundle.inputData.p_street,
        p_city: bundle.inputData.p_city,
        p_state: bundle.inputData.p_state,
        p_country: bundle.inputData.p_country

      }
    })
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'create_client',
  noun: 'Client',

  display: {
    label: 'Create Client',
    description: 'Creates a client.'
  },

  operation: {
    inputFields: [
      {
        key: 'account',
        required: true,

        label: "Account Dynamic Dropdown",
        dynamic: "account.id.account_name"
      },
      {key: 'email', required: true},
      {key: 'fname', label: "First Name"},
      {key: 'lname', label: "Last Name"},
      {key: 'note', label: "Label"},
      {key: 'home_phone', label: "Home Phone"},
      {key: 'mob_phone', label: "Moble Phone"},
      {key: 'language', label: "Language"},
      {key: 'work_phone', label: "Work Phone"},
      {key: 'organization', label: "Organization"},
      {key: 'p_street', label: "Primary Street"},
      {key: 'p_city', label: "Primary city"},
      {key: 'p_state', label: "Primary State"},
      {key: 'p_country', label: "Primary Country"}
    ],
    perform: createClient,

    sample: {
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
        "updated": "2020-01-03 11:46:44",
        "userid": 124011,
        "username": "3hp83Pg9qv",
        "vat_name": null,
        "vat_number": "",
        "vis_state": 0
      },

    // outputFields: [
    //   {key: 'id', label: 'ID'},
    //   {key: 'name', label: 'Name'}
    // ]
  }
};
