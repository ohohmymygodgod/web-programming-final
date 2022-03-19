require('dotenv-defaults').config()
const mongoose = require('mongoose')

const { GraphQLServer, PubSub } = require('graphql-yoga');

const Message = require('./models/message')
const Query = require('./models/Query')
const Mutation = require('./models/Mutation')
const Subscription = require('./models/Subscription')

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

console.log('MongoDB connected!')

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription
  },
  context: {
    db,
    pubsub
  }
})

const PORT = process.env.port || 4000
// Serving server on port 4000
server.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`)
})
