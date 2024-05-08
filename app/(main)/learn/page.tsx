import FeedWrapper from '@/components/feed-wrapper';
import { Promo } from '@/components/Promo';
import { Quests } from '@/components/quests';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import {
	getCourseProgress,
	getLessonPercentage,
	getUnits,
	getUserProgress,
	getUserSubscription,
} from '@/db/queries';
import { lessons, units as unitSchema } from '@/db/schema';
import { redirect } from 'next/navigation';

import { Header } from './header';
import { Unit } from './unit';

const LearnPage = async () => {
	const userProgressData = getUserProgress();
	const unitsData = getUnits();
	const lessonProgressData = getCourseProgress();
	const lessonPercentageData = getLessonPercentage();
	const userSubscriptionData = getUserSubscription();

	const [
		userProgress,
		units,
		courseProgress,
		lessonPercentage,
		userSubscription,
	] = await Promise.all([
		userProgressData,
		unitsData,
		lessonProgressData,
		lessonPercentageData,
		userSubscriptionData,
	]);

	if (!userProgress || !userProgress.activeCourse) {
		redirect('/courses'); // return 할 필요 없음
	}

	if (!courseProgress) {
		redirect('/courses');
	}

	const isPro = !!userSubscription?.isActive;

	return (
		<div className="flex gap-[48px] px-6">
			<FeedWrapper>
				<Header title={userProgress.activeCourse.title} />
				{units.map(unit => (
					<div key={unit.id} className="mb-10">
						<Unit
							id={unit.id}
							order={unit.order}
							description={unit.description}
							title={unit.title}
							lessons={unit.lessons}
							activeLesson={
								courseProgress?.activeLesson as
									| (typeof lessons.$inferSelect & {
											unit: typeof unitSchema.$inferSelect;
									  })
									| undefined
							}
							activeLessonPercentage={lessonPercentage || 0}
						/>
					</div>
				))}
			</FeedWrapper>
			<StickyWrapper>
				<UserProgress
					activeCourse={userProgress.activeCourse}
					hearts={userProgress.hearts}
					points={userProgress.points}
					hasActiveSubscription={isPro}
				/>
				{!isPro && <Promo />}
				<Quests points={userProgress.points} />
			</StickyWrapper>
		</div>
	);
};

export default LearnPage;
