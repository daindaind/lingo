type Props = {
	children: React.ReactNode;
};

export const StickyWrapper = ({ children }: Props) => {
	return (
		<div className="hidden lg:block w-[368p] sticky self-end bottom-6">
			<div className="min-h-[calc(100vh-48px)] sticky top-6 flex flex-col gat-y-4">
				{children}
			</div>
		</div>
	);
};
