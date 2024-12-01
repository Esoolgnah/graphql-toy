import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import resolvers from './resolvers/index.js';
import schema from './schema/index.js';
import { readDB } from './dbController.js';

const startServer = async () => {
  const app = express();

  // CORS 설정
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  // Apollo Server 초기화
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: () => ({
      db: {
        messages: readDB('messages'),
        users: readDB('users'),
      },
    }),
  });

  // Apollo Server 시작
  await server.start();

  // GraphQL 미들웨어 적용
  server.applyMiddleware({ app, path: '/graphql' });

  // Express 서버 실행
  app.listen(8000, () => {
    console.log(
      `Server listening at http://localhost:8000${server.graphqlPath}`,
    );
  });
};

// 서버 시작
startServer();
