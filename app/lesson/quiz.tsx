'use client';

import { useState, useTransition } from 'react';

import { upsertChallengeProgress } from '@/actions/challenge-progress';
import { reduceHearts } from '@/actions/user-progress';
import { challengeOptions, challenges } from '@/db/schema';
import { toast } from 'sonner';

import { Challenge } from './challenge';
import { Footer } from './footer';
import { Header } from './header';
import { QuestionBubble } from './question-bubble';

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
	// initialLessenId,
	initialHearts,
	initialPercentage,
	userSubscription,
	initialLessonChallenges,
}: Props) => {
	const [pending, startTransition] = useTransition();
	const [hearts, setHearts] = useState(initialHearts);
	const [percentage, setPercentage] = useState(initialPercentage);
	const [challenges] = useState(initialLessonChallenges);
	const [activeIndex, setActiveIndex] = useState(() => {
		const uncompletedIndex = challenges.findIndex(
			challenge => !challenge.completed,
		);
		return uncompletedIndex === -1 ? 0 : uncompletedIndex;
	});
	const [selectedOption, setSelectedOption] = useState<number>();
	const [state, setState] = useState<'correct' | 'wrong' | 'none'>('none');

	const challenge = challenges[activeIndex];
	const options = challenge?.challengeOptions ?? [];

	const onNext = () => {
		setActiveIndex(current => current + 1);
	};

	const onSelect = (id: number) => {
		if (state !== 'none') return;

		setSelectedOption(id);
	};

	const onContinue = () => {
		if (!selectedOption) return;

		if (state === 'wrong') {
			setState('none');
			setSelectedOption(undefined);
			return;
		}

		if (state === 'correct') {
			onNext();
			setState('none');
			setSelectedOption(undefined);
			return;
		}

		const correctOption = options.find(option => option.correct);

		if (!correctOption) return;

		if (correctOption.id === selectedOption) {
			startTransition(() => {
				upsertChallengeProgress(challenge.id)
					.then(response => {
						if (response?.error === 'hearts') {
							console.error('Missing hearts');
							return;
						}

						setState('correct');
						setPercentage(prev => prev + 100 / challenges.length);

						if (initialPercentage === 100) {
							setHearts(prev => Math.min(prev + 1, 5));
						}
					})
					.catch(() => toast.error('something wrong. please try again'));
			});
		} else {
			startTransition(() => {
				reduceHearts(challenge.id)
					.then(response => {
						if (response?.error === 'hearts') {
							console.error('Missing hearts');
							return;
						}

						setState('wrong');

						if (!response?.error) {
							setHearts(prev => Math.max(prev - 1, 0));
						}
					})

					.catch(() => toast.error('Something went wrong, please try again.'));
			});
		}
	};

	const title =
		challenge.type === 'ASSIST'
			? 'Select the correct meaning'
			: challenge.question;

	return (
		<>
			<Header
				hearts={hearts}
				percentage={percentage}
				hasActiveSubscription={!!userSubscription?.isActive}
			/>
			<div className="flex-1">
				<div className="h-full flex items-center justify-center">
					<div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0">
						<h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
							{title}
						</h1>
						<div>
							{challenge.type === 'SELECT' && (
								<QuestionBubble question={challenge.question} />
							)}
							<Challenge
								options={options}
								onSelect={onSelect}
								status={state}
								selectedOption={selectedOption}
								disabled={false}
								type={challenge.type}
							/>
						</div>
					</div>
				</div>
			</div>
			<Footer disabled={!selectedOption} status={state} onCheck={onContinue} />
		</>
	);
};

export default Quiz;
