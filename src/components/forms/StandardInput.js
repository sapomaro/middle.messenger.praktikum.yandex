import '/src/components/forms/StandardInput.scss';

export default (props) => `
	<div class="container__element">
		<input name="${props.name}" type="${props.type}" class="form__input__field form__input__field_standard" 
			value="" oninput="this.setAttribute('value', this.value);">
		<label class="form__input__label">${props.label}</label>
		<span class="form__input__error">${props.error || ''}</span>
	</div>	
`;