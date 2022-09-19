import '/src/components/forms/StandardButton.scss';

export const StandardButton = (props) => `
	<div class="container__element container__element_centered">
		<input name="${props.name}" type="${props.type || 'button'}" class="form__button form__button_standard" value="${props.label}">
		<span class="form__input__error">${props.error || ''}</span>
	</div>
`;