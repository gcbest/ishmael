import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';
import createServer from './createServer';
import db from './db';

config({ path: 'variables.env' });
const server: GraphQLServer = createServer();
