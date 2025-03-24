import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CombinedComponents } from './components/CombinedComponents/CombinedComponents.jsx'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";

// ✅ Correctly instantiate Apollo Client
const globalClient = new ApolloClient({
  link: createHttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ApolloProvider client={globalClient}> */}
      <CombinedComponents />
    {/* </ApolloProvider> */}
  </StrictMode>
)
