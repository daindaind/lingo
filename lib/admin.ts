import { auth } from '@clerk/nextjs';

const adminIds = ['user_2fSrEIEcaqRa4MMG8McJxRbEYDq'];

export const isAdmin = () => {
	const { userId } = auth();

	if (!userId) {
		return false;
	}

	return adminIds.indexOf(userId) !== -1;
};
