import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CombinedComponents } from './components/CombinedComponents/CombinedComponents.jsx'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import './index.css'

const globalClient = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={globalClient}>
      <CombinedComponents />
    </ApolloProvider>
  </StrictMode>
)
