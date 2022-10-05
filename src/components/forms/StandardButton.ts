import './StandardButton.scss';

export const StandardButton = (props: Record<string, string>): string => `
  <div class="container__element container__element_centered">
    <button name="${props.name}" type="${props.type || 'button'}" 
      class="form__button form__button_standard">
        ${props.label}
    </button>
    <span class="form__input__error">${props.error || ''}</span>
  </div>
`;
