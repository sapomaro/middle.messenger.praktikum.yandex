import '/src/components/forms/RowInput.scss';

export const RowInput = (props) => `
  <label class="container__row">
    <span class="form__row__label">${props.label}</span>
    <span class="form__text_right">
      <input 
        name="${props.name}" 
        type="${props.type}" 
        class="form__input__field form__input__field_right"
        value="${props.value || ''}"
        ${ props.readyonly ? 'readonly="readonly"' : '' }>
      <span class="form__input__error">${props.error || ''}</span>
    </span>
  </label>  
`;
