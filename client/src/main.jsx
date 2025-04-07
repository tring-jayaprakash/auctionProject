import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import './index.css'
import App from './App.jsx';

const URL = import.meta.env.VITE_GRAPHQL_URL

const globalClient = new ApolloClient({
  uri: URL,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={globalClient}>
      <App />
    </ApolloProvider>
  </StrictMode>
)
