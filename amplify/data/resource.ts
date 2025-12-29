import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Team: a.model({
    name: a.string().required(),
    description: a.string(),
    players: a.json(), // Store the players array as JSON
    // Store the team sheet configuration as a JSON string for now, 
    // or we could break it down into more models (Players, Positions, etc.)
    // For simplicity in this step, we'll just store the metadata.
    // The existing app uses local state, we'll need to serialize that eventually.
  })
  .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
