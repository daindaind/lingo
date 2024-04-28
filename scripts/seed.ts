import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from '../db/schema';

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
	try {
		console.log('데이터베이스 Seeding');

		await db.delete(schema.courses);
		await db.delete(schema.userProgress);

		await db.insert(schema.courses).values([
			{
				id: 1,
				title: 'Spanish',
				imageSrc: '/es.svg',
			},
			{
				id: 2,
				title: 'Italian',
				imageSrc: '/it.svg',
			},
			{
				id: 3,
				title: 'French',
				imageSrc: '/fr.svg',
			},
			{
				id: 4,
				title: 'Croatian',
				imageSrc: '/hr.svg',
			},
		]);

		console.log('Seeding 끝');
	} catch (error) {
		console.error(error);
		throw new Error('데이터베이스 seed에 실패했어요ㅜㅡㅜ');
	}
};

main();
