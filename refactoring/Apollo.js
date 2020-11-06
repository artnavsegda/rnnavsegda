import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = createHttpLink({
    uri: 'http://192.168.88.23:4000'
  })
  
  const wsLink = new WebSocketLink({
    uri: `ws://192.168.88.23:4000`,
    options: {
      reconnect: true
    }
  })
  
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )
  
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  })

  export { client };