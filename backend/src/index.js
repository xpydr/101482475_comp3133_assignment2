require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const connectDB = require('./db/connection');

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      req
    };
  },
  introspection: true,
  playground: true
});

const startServer = async () => {
  try {
    await connectDB();
    
    const { url } = await server.listen(PORT);
    console.log(`Server ready at ${url}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
