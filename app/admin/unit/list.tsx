import { Datagrid, List, TextField } from 'react-admin';

export const UnitList = () => {
	return (
		<List>
			<Datagrid rowClick="edit">
				<TextField source="id" />
				<TextField source="title" />
				<TextField source="description" />
				<TextField source="courseId" reference="courses" />
				<TextField source="order" />
			</Datagrid>
		</List>
	);
};
