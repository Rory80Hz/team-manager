import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define authentication for the app.
 * We enable email login and Google login.
 * 
 * To enable Google Login, you need to:
 * 1. Create a Google Cloud Project and OAuth credentials.
 * 2. Set the secrets in AWS Amplify:
 *    npx amplify sandbox secret set GOOGLE_CLIENT_ID
 *    npx amplify sandbox secret set GOOGLE_CLIENT_SECRET
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
      }
    }
  },
});
