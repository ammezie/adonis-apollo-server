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
    graphql (options, request, response) {
        if (!options) {
            throw new Error('Apollo Server requires options.')
        }

        return runHttpQuery([request], {
            method: request.method(),
            options: options,
            query: request.method() === 'POST' ? request.post() : request.get()
        }).then((gqlResponse) => {
            return response
              .header("content-type", "application/json")
              .send(gqlResponse)
        }, error => {
            if ('HttpQueryError' !== error.name) {
                throw error
            }

            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    response.header(header, error.headers[header])
                })
            }

            response.status(error.statusCode)
                    .send(error.message)
        })
    }

    graphiql (options, request, response) {
        if (!options) {
            throw new Error('Apollo Server GraphiQL requires options.')
        }

        const query = request.originalUrl()

        return GraphiQL.resolveGraphiQLString(query, options, request).then(graphiqlString => {
            response.header('Content-Type', 'text/html')
                    .send(graphiqlString)
        }, error => response.send(error))
    }
}

module.exports = ApolloServer
