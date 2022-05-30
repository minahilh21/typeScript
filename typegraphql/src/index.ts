 import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema} from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

import { redis } from "./redis";


var RedisStore = connectRedis(session);
declare module 'express-session' {
  interface SessionData {
      userId: any;
  }
}
const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver]
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({req}: any) =>({req}),
  });

  const app = Express();
  app.use(cors({
    credentials: true,
    // origin: "http://localhost:3000"
  }));
  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );
  app.set("Access-Control-Allow-Credentials", true);
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4220, () => {
    console.log("server started on http://localhost:4220/graphql");
  });
};

main();