import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from '../db/schema';

const sql = neon(process.env.DATABASE_URL || '');

const db = drizzle(sql, { schema });

const main = async () => {
	try {
		// console.log('데이터베이스 Seeding');

		await db.delete(schema.courses);
		await db.delete(schema.userProgress);
		await db.delete(schema.units);
		await db.delete(schema.lessons);
		await db.delete(schema.challenges);
		await db.delete(schema.challengeOptions);
		await db.delete(schema.challengeProgress);
		await db.delete(schema.userSubscription);

		// console.log('Seeding 끝');
	} catch (error) {
		console.error(error);
		throw new Error('데이터베이스 seed에 실패했어요ㅜㅡㅜ');
	}
};

main();
