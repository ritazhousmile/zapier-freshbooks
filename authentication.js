

const getAccessToken = (z, bundle) => {
  const promise = z.request(`https://api.freshbooks.com/auth/oauth/token?`, {
    method: 'POST',
    body: {
      // extra data pulled from the users query string
      accountDomain: bundle.cleanedRequest.querystring.accountDomain,
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: bundle.inputData.redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }

  });

  // Needs to return at minimum, `access_token`, and if your app also does refresh, then `refresh_token` too
  return promise.then(response => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }
    z.console.log(response.content)
    const result = JSON.parse(response.content);
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token
    };
  });
};


const refreshAccessToken = async(z, bundle) => {
  const response = await z.request ({
    url: `https://my.freshbooks.com/service/auth/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${bundle.authData.refresh_token}&grant_type=refresh_token&redirect_uri=${bundle.inputData.redirect_uri}`,
    method: 'POST'
  })
  // z.console.log('Refresh Response', response)
  if (response.status !==200) {
    throw new Error('Unable to fetch access token: ' + response.content);
  }
  return response.json;
};

const testAuth = (z /*, bundle */) => {
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  const promise = z.request({
    method: 'GET',
    url: `https://api.freshbooks.com/auth/api/v1/users/me`
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then(response => {
    if (response.status === 401) {
      throw new Error('The access token you supplied is not valid');
    }
    z.console.log(z.JSON.parse(response.content))
    let info = z.JSON.parse(response.content)
    let first_name = info.response.profile.first_name
    let last_name = info.response.profile.last_name
    let full_name = first_name + " " + last_name
    // z.console.log(first_name)
    // z.console.log(last_name)
    // z.console.log(full_name)
    return full_name;
  });
};

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    // Step 1 of the OAuth flow; specify where to send the user to authenticate with your API.
    // Zapier generates the state and redirect_uri, you are responsible for providing the rest.
    // Note: can also be a function that returns a string
      authorizeUrl: {
        method: 'GET',
        url: `https://my.freshbooks.com/service/auth/oauth/authorize?`,
        params: {
          client_id: '{{process.env.CLIENT_ID}}',
          state: '{{bundle.inputData.state}}',
          redirect_uri: '{{bundle.inputData.redirect_uri}}',
          response_type: 'code'
        }
      },
      // Step 2 of the OAuth flow; Exchange a code for an access token.
      // This could also use the request shorthand.
      getAccessToken: getAccessToken,
      // {
      //   method: 'POST',
      //   url: `https://my.freshbooks.com/service/auth/oauth/token?`,
      //   body: {
      //     code: '{{bundle.inputData.code}}',
      //     client_id: '{{process.env.CLIENT_ID}}',
      //     client_secret: '{{process.env.client_secret}}',
      //     redirect_uri: '{{bundle.inputData.redirect_uri}}',
      //     grant_type: 'authorization_code'
      //   }
      //   headers: {
      //     'Content-Type': 'application/JSON'
      //   }
      // }

      refreshAccessToken: refreshAccessToken,
      scope: '',
      autoRefresh: true

  },
    // (Optional) If the access token expires after a pre-defined amount of time, you can implement
    // this method to tell Zapier how to refresh it.
    // refreshAccessToken: refreshAccessToken,
    // If you want Zapier to automatically invoke `refreshAccessToken` on a 401 response, set to true
    // autoRefresh: true
    // If there is a specific scope you want to limit your Zapier app to, you can define it here.
    // Will get passed along to the authorizeUrl
    // scope: '',

  // The test method allows Zapier to verify that the access token is valid. We'll execute this
  // method after the OAuth flow is complete to ensure everything is setup properly.
    test: testAuth,


  // assuming "username" is a key returned from the test
  connectionLabel: testAuth
};
