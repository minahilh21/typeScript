import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema} from "type-graphql";
import { createConnection} from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
require('dotenv').config();
import { redis } from "./redis";

const port = process.env.PORT || 4000;

var RedisStore = connectRedis(session);
export = session;
declare module 'express-session' {
  interface SessionData {
      userId: any;
  }
}
const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
    authChecker: ({context: {req}}) => {
      return !!req.session.userId;
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({req, res}: any) =>(
      { req, 
        res,
      }),
  });

  const app = Express();
  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );
  app.use(cors({
    credentials: true,
    // origin: "http://localhost:4000",
  }));
  app.set("Access-Control-Allow-Credentials", true);
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: { origin: 'https://studio.apollographql.com', credentials: true } });

  app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/graphql`);
  });
};

main();