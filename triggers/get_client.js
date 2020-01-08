// triggers on getclient with a certain tag
const triggerGetclient = async (z, bundle) => {
  const options = {
    url: `https://api.freshbooks.com/accounting/account/${bundle.inputData.account_id}/users/clients`,
  };

  let response = await z.request(options);

  if (response.status !== 200) {
    throw new Error('bad request' + response.content);
  }


  let clients = []
  z.console.log(response.json.response.result.clients)
  response.json.response.result.clients.forEach((client) => {
    clientObj= {}
    clientObj.id = client.id
    clientObj.name = client.username
    clients.push(clientObj)
    }
  )
z.console.log(clients)
  return clients
};

module.exports = {
  key: 'get_client',
  noun: 'Getclient',

  display: {
    label: 'Get Getclient',
    description: 'Triggers on a new getclient.'
  },

  operation: {
    inputFields: [

    ],
    perform: triggerGetclient,

    sample: {
      id: 1,
      name: 'Test'
    },

    // outputFields: [
    //   {key: 'id', label: 'ID'},
    // //   {key: 'name', label: 'Name'}
    // ]
  }
};
