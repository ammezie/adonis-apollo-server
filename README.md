# adonis-apollo-server

This package integrates Apollo GraphQL Server with the AdonisJS framework. It allows you to use Apollo server in your AdoinsJS app.

## Setup

### Registering provider

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
    'adonis-apollo-server/providers/ApolloServerProvider'
]
```

That's all! Now you can use the provider by pulling it from IoC container

```js
const ApolloServer = use('ApolloServer')

ApolloServer.graphql({ schema: schema }, request, response)

ApolloServer.graphiql({ endpointURL: '/graphql' }, request, response)
```