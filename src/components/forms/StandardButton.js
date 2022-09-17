import '/src/components/forms/StandardButton.scss';

export default (props) => `
	<div class="container__element container__element_centered">
		<input name="${props.name}" type="${props.type}" class="form__button form__button_standard" value="${props.label}">
		<span class="form__input__error">${props.error || ''}</span>
	</div>
`;