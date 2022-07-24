module.exports = {
  FIREBASE_KEY: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_KEY_ID,
    private_key: process.env.FIREBASE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_KEY_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT,
  },
};
