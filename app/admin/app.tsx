'use client';

import { Admin, Resource } from 'react-admin';

import simpleRestProvider from 'ra-data-simple-rest';

import { CourseCreate } from './course/create';
import { CourseEdit } from './course/edit';
import { CourseList } from './course/list';

const dataProvider = simpleRestProvider('/api');

const App = () => {
	return (
		<Admin dataProvider={dataProvider}>
			<Resource
				name="courses"
				recordRepresentation="title"
				create={CourseCreate}
				edit={CourseEdit}
				list={CourseList}
			/>
		</Admin>
	);
};

export default App;
