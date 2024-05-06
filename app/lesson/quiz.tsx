'use client';

import { useState, useTransition } from 'react';
import Confetti from 'react-confetti';
import { useAudio, useWindowSize } from 'react-use';

import { upsertChallengeProgress } from '@/actions/challenge-progress';
import { reduceHearts } from '@/actions/user-progress';
import { challengeOptions, challenges } from '@/db/schema';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Challenge } from './challenge';
import { Footer } from './footer';
import { Header } from './header';
import { QuestionBubble } from './question-bubble';
import { ResultCard } from './result-card';

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
	const { width, height } = useWindowSize();
	const [finishAudio] = useAudio({ src: '/finish.mp3', autoPlay: true });
	const router = useRouter();
	const [correctAudio, _c, correctControls] = useAudio({ src: '/correct.wav' });
	const [incorrectAudio, _i, incorrectControls] = useAudio({
		src: '/incorrect.wav',
	});
	const [pending, startTransition] = useTransition();
	const [lessonId, setLessonId] = useState();
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
						correctControls.play();
						setState('correct');
						setPercentage(prev => prev + 100 / challenges.length);

						if (initialPercentage === 100) {
							setHearts(prev => Math.min(prev + 1, 5));
						}
					})
					.catch(error => {
						console.error(error);
						toast.error('something wrong. please try again');
					});
			});
		} else {
			startTransition(() => {
				reduceHearts(challenge.id)
					.then(response => {
						if (response?.error === 'hearts') {
							console.error('Missing hearts');
							return;
						}

						incorrectControls.play();
						setState('wrong');

						if (!response?.error) {
							setHearts(prev => Math.max(prev - 1, 0));
						}
					})

					.catch(() => toast.error('Something went wrong, please try again.'));
			});
		}
	};

	if (!challenge) {
		return (
			<>
				{finishAudio}
				<Confetti
					width={width}
					height={height}
					recycle={false}
					numberOfPieces={500}
					tweenDuration={10000}
				/>
				<div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
					<Image
						src="/finish.svg"
						alt="Finish"
						className="block lg:hidden"
						height={50}
						width={50}
					/>
					<h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
						Great job! <br /> You{"'"}ve completed the lesson.
					</h1>
					<div className="flex items-center gap-x-4 w-full">
						<ResultCard variant="points" value={challenges.length * 10} />
						<ResultCard variant="hearts" value={challenges.length * 10} />
					</div>
				</div>
				<Footer
					lessonId={lessonId}
					status="completed"
					onCheck={() => router.push('/learn')}
				/>
			</>
		);
	}

	const title =
		challenge.type === 'ASSIST'
			? 'Select the correct meaning'
			: challenge.question;

	return (
		<>
			{incorrectAudio}
			{correctAudio}
			<Header
				hearts={hearts}
				percentage={percentage}
				hasActiveSubscription={!!userSubscription?.isActive}
			/>
			<div className="flex-1">
				<div className="h-full flex items-center justify-center mt-5 mb-10">
					<div className="flex w-full flex-col gap-y-5 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
						<h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
							{title}
						</h1>
						<div>
							{challenge.type === 'ASSIST' && (
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
