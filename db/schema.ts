import { relations } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/mysql-core';
import { integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	imageSrc: text('image_src').notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
	userProgress: many(userProgress),
	units: many(units), // course는 여러 unit을 가질 수 있다.
}));

export const units = pgTable('units', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(), // unit 1
	description: text('description').notNull(), // Learn the basics of spanish
	courseId: integer('course_id')
		.references(() => courses.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	order: integer('order').notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
	// unit은 오직 단 하나의 course를 갖는다.
	course: one(courses, {
		fields: [units.courseId],
		references: [courses.id],
	}),
	// unit은 여러 lessons를 갖는다.
	lessons: many(lessons),
}));

export const lessons = pgTable('lessons', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	unitId: integer('unit_id')
		.references(() => units.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	order: integer('order').notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
	// lessons는 단 하나의 unit을 갖는다.
	unit: one(units, {
		fields: [lessons.unitId],
		references: [units.id],
	}),
	challenges: many(challenges),
}));

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST']);

export const challenges = pgTable('challenges', {
	id: serial('id').primaryKey(),
	lessonId: integer('lessons_id')
		.references(() => lessons.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	type: challengesEnum('type').notNull(),
	question: text('question').notNull(),
	order: integer('order').notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
	lesson: one(lessons, {
		fields: [challenges.lessonId],
		references: [lessons.id],
	}),
	// challenges는 여러 challengeOptions을 가질 수 있음
	challengeOptions: many(challengeOptions),
	// challenges는 여러 challengeProgress을 가질 수 있음
	challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable('challenge_options', {
	id: serial('id').primaryKey(),
	challengeId: integer('challenge_id')
		.references(() => challenges.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	text: text('text').notNull(),
	correct: boolean('correct').notNull(),
	imageSrc: text('iamge_src'),
	audioSrc: text('audio_src'),
});

export const challengeOptionsRelations = relations(
	challengeOptions,
	({ one }) => ({
		// challengeOptions은 오직 하나의 challenge만 가질 수 있음
		challenge: one(challenges, {
			fields: [challengeOptions.challengeId],
			references: [challenges.id],
		}),
	}),
);

export const challengeProgress = pgTable('challenge_progress', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(), // TODO: confirm this doesn't break
	challengeId: integer('challenge_id')
		.references(() => challenges.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	completed: boolean('completed').notNull().default(false),
});

export const challengeProgressRelations = relations(
	challengeProgress,
	({ one }) => ({
		// challengeProgress는 하나의 challenge를 가짐
		challenge: one(challenges, {
			fields: [challengeProgress.challengeId],
			references: [challenges.id],
		}),
	}),
);

export const userProgress = pgTable('user_progress', {
	userId: text('user_id').primaryKey(),
	userName: text('user_name').notNull().default('User'),
	userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
	activeCourseId: integer('active_course_id').references(() => courses.id, {
		onDelete: 'cascade',
	}),
	hearts: integer('hearts').notNull().default(5),
	points: integer('points').notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
	activeCourse: one(courses, {
		fields: [userProgress.activeCourseId],
		references: [courses.id],
	}),
}));
