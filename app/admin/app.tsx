'use client';

import { Admin, Resource } from 'react-admin';

import simpleRestProvider from 'ra-data-simple-rest';

import { ChallengeCreate } from './challenge/create';
import { ChallengeEdit } from './challenge/edit';
import { ChallengeList } from './challenge/list';
import { CourseCreate } from './course/create';
import { CourseEdit } from './course/edit';
import { CourseList } from './course/list';
import { UnitCreate } from './unit/create';
import { UnitEdit } from './unit/edit';
import { UnitList } from './unit/list';

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
			<Resource
				name="units"
				recordRepresentation="title"
				create={UnitCreate}
				edit={UnitEdit}
				list={UnitList}
			/>
			<Resource
				name="challenges"
				recordRepresentation="title"
				create={ChallengeCreate}
				edit={ChallengeEdit}
				list={ChallengeList}
			/>
		</Admin>
	);
};

export default App;
