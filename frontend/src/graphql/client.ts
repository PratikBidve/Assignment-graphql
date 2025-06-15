import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Extensions: ${JSON.stringify(extensions)}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    console.error('Operation:', operation);
  }
});

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  console.log('Current token in authLink:', token);
  
  // Return the headers to the context so httpLink can read them
  const authHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };
  console.log('Sending headers:', authHeaders);
  return { headers: authHeaders };
});

// Type definitions
const typeDefs = `
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    createdAt: String!
    updatedAt: String!
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
  }

  input EmployeeFilter {
    name: String
    class: String
    minAge: Int
    maxAge: Int
  }
`;

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          employees: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  typeDefs,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
  connectToDevTools: true,
});