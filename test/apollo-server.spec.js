'use strict'

/**
 * adonis-apollo-server
 *
 * (c) Chimezie Enyinnaya <meziemichael@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { ioc } = require('@adonisjs/fold')

const ApolloServer = require('../src/ApolloServer')
const ApolloServerProvider = require('../providers/ApolloServerProvider')

test('throws error if called without schema', (assert) => {
    const provider = new ApolloServerProvider(ioc)
    provider.register()
    const apolloServer = ioc.use('ApolloServer')

    assert.throws(() => apolloServer.graphql(undefined), 'Apollo Server requires options.')
})