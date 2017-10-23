'use strict'

/**
 * adonis-apollo-server
 *
 * (c) Chimezie Enyinnaya <meziemichael@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { HttpQueryError, runHttpQuery } = require('apollo-server-core')
const GraphiQL = require('apollo-server-module-graphiql')

class ApolloServer {
    async graphql (options, request, response) {
        if (!options) {
            throw new Error('Apollo Server requires options.')
        }

        try {
            const gqlResponse = await runHttpQuery([request], {
                method: request.method(),
                options: options,
                query: request.method() === 'POST' ? request.post() : request.get()
            })

            return response.json(gqlResponse)
        } catch (error) {
            if ('HttpQueryError' !== error.name) {
                throw error
            }

            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    response.header(header, error.headers[header])
                })
            }

            return response.status(error.status)
                    .send(error.message)
        }
    }

    async graphiql (options, request, response) {
        if (!options) {
            throw new Error('Apollo Server GraphiQL requires options.')
        }

        const query = request.originalUrl()

        try {
            const graphiqlString = await GraphiQL.resolveGraphiQLString(query, options, request)

            response.header('Content-Type', 'text/html')
                    .send(graphiqlString)
        } catch (error) {
            return response.send(error)
        }
    }
}

module.exports = ApolloServer