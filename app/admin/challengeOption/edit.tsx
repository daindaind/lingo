import {
	BooleanInput,
	Edit,
	ReferenceInput,
	required,
	SimpleForm,
	TextInput,
} from 'react-admin';

export const ChallengeOptionsEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="text" validate={[required()]} label="Text" />
				<BooleanInput
					source="correct"
					validate={[required()]}
					label="Correct option"
				/>

				<ReferenceInput source="challngeId" reference="challenges" />
				<TextInput source="imageSrc" label="Image URL" />
				<TextInput source="audioSrc" label="Audio URL" />
			</SimpleForm>
		</Edit>
	);
};
