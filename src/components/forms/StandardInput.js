import '../components/StandardInput.scss';

export default `
	<div class="form__element" key="%{}%">
		<input name="%{authInputs[*].name}%" type="%{authInputs[*].type}%" class="form__input__field form__input__field_standard" 
			value="" oninput="this.setAttribute('value', this.value);">
		<label class="form__input__label">%{authInputs[*].label}%</label>
		<span class="form__input__error"></span>
	</div>	
`;