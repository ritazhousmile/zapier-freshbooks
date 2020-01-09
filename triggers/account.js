// triggers on account with a certain tag
const triggerAccount = async (z, bundle) => {
  z.console.log(bundle.inputData)
  const options = {
    url: 'https://api.freshbooks.com/auth/api/v1/users/me',
  };

  let response = await z.request(options);

    if (response.status !==200) {
    throw new Error('bad request ' + response.content);
    }

  let obj = {}
  obj.id = response.json.response.business_memberships[0].business.account_id
  obj.account_name = response.json.response.business_memberships[0].business.name


  let result = [obj]
  z.console.log("result", result)
  return result
};

module.exports = {
  key: 'account',
  noun: 'Account',

  display: {
    label: 'Get Account',
    description: 'Triggers on a new account.'
  },

  operation: {
    inputFields: [

    ],
    perform: triggerAccount,

    sample: {
     "account_id": "AQW5qM"
    },

  }
};
