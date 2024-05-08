import {
	Edit,
	NumberInput,
	ReferenceInput,
	required,
	SimpleForm,
	TextInput,
} from 'react-admin';

export const LessonEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="title" validate={[required()]} label="Title" />
				<ReferenceInput source="unitId" reference="units" />
				<ReferenceInput source="courseId" reference="courses" />
				<NumberInput source="order" validate={[required()]} label="Order" />
			</SimpleForm>
		</Edit>
	);
};
