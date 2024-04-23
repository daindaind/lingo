import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Footer = () => {
	return (
		<footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
			<div className="max-w-screen-lg mx-auto flex items-center justify-center h-full">
				<Button size="lg" variant="ghost" className="w-full">
					<Image
						src="/hr.svg"
						alt="Croatian"
						height={32}
						width={40}
						className="mr-4 rounded-md"
					/>
					CROATIAN
				</Button>
				<Button size="lg" variant="ghost" className="w-full">
					<Image
						src="/fr.svg"
						alt="Croatian"
						height={32}
						width={40}
						className="mr-4 rounded-md"
					/>
					FRANCH
				</Button>
				<Button size="lg" variant="ghost" className="w-full">
					<Image
						src="/es.svg"
						alt="Croatian"
						height={32}
						width={40}
						className="mr-4 rounded-md"
					/>
					SPANISH
				</Button>
				<Button size="lg" variant="ghost" className="w-full">
					<Image
						src="/it.svg"
						alt="Croatian"
						height={32}
						width={40}
						className="mr-4 rounded-md"
					/>
					ITALIAN
				</Button>
				<Button size="lg" variant="ghost" className="w-full">
					<Image
						src="/jp.svg"
						alt="Croatian"
						height={32}
						width={40}
						className="mr-4 rounded-md"
					/>
					JAPANESS
				</Button>
			</div>
		</footer>
	);
};

export default Footer;
