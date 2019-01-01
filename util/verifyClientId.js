const googleKeys = require('../config/google/keys')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(googleKeys.clientId);

module.exports = async function verifyClientId(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleKeys.clientId,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  if (payload.aud === googleKeys.clientId) {
    return payload;
    // return res.json({payload : payload});
  } else {
    var unintentionlogin = "The token id contains unmatched client id to this application";
    return {errors: unintentionlogin};
  }
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
};

