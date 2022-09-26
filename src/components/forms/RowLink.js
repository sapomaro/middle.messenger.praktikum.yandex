export const RowLink = (props) => `
  <div class="container__row">
    <a href="${props.url}" 
      class="form__row__label container__link ${props.style}">
        ${props.label}
    </a>
  </div>
`;
