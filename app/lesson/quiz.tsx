'use client';

import { useState } from 'react';

import { challengeOptions, challenges } from '@/db/schema';

import { Header } from './header';

type Props = {
	initialLessenId: number;
	initialHearts: number;
	initialPercentage: number;
	userSubscription: any; //TODO: repace with subscription DB type
	initialLessonChallenges: (typeof challenges.$inferSelect & {
		completed: boolean;
		challengeOptions: (typeof challengeOptions.$inferSelect)[];
	})[];
};

const Quiz = ({
	initialLessenId,
	initialHearts,
	initialPercentage,
	userSubscription,
	initialLessonChallenges,
}: Props) => {
	const [hearts, setHearts] = useState(initialHearts);
	const [percentage, setPercentage] = useState(initialPercentage);
	return (
		<Header
			hearts={hearts}
			percentage={percentage}
			hasActiveSubscription={!!userSubscription?.isActive}
		/>
	);
};

export default Quiz;
