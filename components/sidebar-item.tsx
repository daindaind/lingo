'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from './ui/button';

type Props = {
	label: string;
	iconsrc: string;
	href: string;
};

export const SidebarItem = ({ label, iconsrc, href }: Props) => {
	const pathname = usePathname();
	const active = pathname === href;

	return (
		<Button
			variant={active ? 'sidebarOutline' : 'sidebar'}
			className="justify-start h-[52px]"
			asChild
		>
			<Link href={href}>
				<Image
					src={iconsrc}
					alt={label}
					className="mr-5"
					width={32}
					height={32}
				/>
				{label}
			</Link>
		</Button>
	);
};
