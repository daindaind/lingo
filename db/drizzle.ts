import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const DATABASE_URL =
	process.env.DATABASE_URL ||
	'postgresql://lingo_owner:VKzf1CMhiE7P@ep-morning-bird-a5ad94d4.us-east-2.aws.neon.tech/lingo?sslmode=require';
const sql = neon(DATABASE_URL!);
const db = drizzle(sql, { schema });

export default db;
