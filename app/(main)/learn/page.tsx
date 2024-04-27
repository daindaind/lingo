import FeedWrapper from '@/components/feed-wrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import { getUserProgress } from '@/db/queries';
import { redirect } from 'next/navigation';

import { Header } from './header';

const LearnPage = async () => {
	const userProgressData = getUserProgress();

	const [userProgress] = await Promise.all([userProgressData]);

	if (!userProgress || !userProgress.activeCourse) {
		redirect('/courses');
	}

	return (
		<div className="flex gap-[48px] px-6">
			<FeedWrapper>
				<Header title="spanish" />
			</FeedWrapper>
			<StickyWrapper>
				<UserProgress
					activeCourse={{ title: 'Spanish', imageSrc: '/es.svg' }}
					hearts={5}
					points={100}
					hasActiveSubscription={false}
				/>
			</StickyWrapper>
		</div>
	);
};

export default LearnPage;
