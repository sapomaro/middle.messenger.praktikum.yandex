import '/src/components/forms/StandardButton.scss';

export default (props) => `
	<div class="container__element">
		<input name="${props.name}" type="${props.type}" class="form__button form__button_standard" value="${props.label}">
	</div>
`;