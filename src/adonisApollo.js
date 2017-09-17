'use strict'

const { HttpQueryError, runHttpQuery } = require('apollo-server-core')
const GraphiQL = require('apollo-server-module-graphiql')

class AdonisApollo {
    graphql (options) {
        if (!options.graphql) {
            throw new Error('Apollo Server requires options.');
        }

        if (arguments.length > 1) {
            throw new Error("Apollo Server expects exactly one argument, got " + arguments.length);
        }

        return runHttpQuery([request], {
            method: request.method(),
            options: options.graphql,
            query: request.method() === 'POST' ? request.post() : request.get()
        }).then((gqlResponse) => {
            return response.json(gqlResponse)
        }, error => {
            if ('HttpQueryError' !== error.name) {
                throw error
            }

            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    response.header(header, error.headers[header])
                })
            }

            response.status(error.status)
                    .send(error.message)
        })
    }

    graphiql (options) {
        if (!options.graphiql) {
            throw new Error('Apollo Server GraphiQL requires options.');
        }

        const query = request.originalUrl()

        GraphiQL.resolveGraphiQLString(query, options.graphiql, request).then(graphiqlString => {
            response.header('Content-Type', 'text/html')
                    .send(graphiqlString)
        }, error => response.send(error))
    }
}

module.expects = AdonisApollo