'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { usePracticeModal } from '@/store/use-practice-modal';
import Image from 'next/image';

export const PracticeModal = () => {
	const { isOpen, close } = usePracticeModal();

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="flex items-center w-full justify-center mb-5">
						<Image src="/heart.svg" alt="Heart" height={80} width={80} />
					</div>
					<DialogTitle className="text-center font-bold text-2xl">
						Practice lesson
					</DialogTitle>
					<DialogDescription className="text-center text-base">
						Use practice lessons to regain hearts and points. You cannot loose hearts
						or points in practice lessons.
					</DialogDescription>
					<DialogFooter className="mb-4">
						<div className="flex flex-col gap-y-4 w-full">
							<Button variant="primary" className="w-full" size="lg" onClick={close}>
								I understand
							</Button>
						</div>
					</DialogFooter>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
