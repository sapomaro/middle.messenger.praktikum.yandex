export const RowLink = (props: Record<string, string>): string => `
  <div class="container__row">
    <a href="${props.url}" 
      class="form__row__label container__link ${props.style}">
        ${props.label}
    </a>
  </div>
`;
