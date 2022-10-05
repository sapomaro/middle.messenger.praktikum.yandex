export const StandardLink = (props: Record<string, string>): string => `
  <div class="container__element container__element_centered">
    <a href="${props.url}" class="container__link">${props.label}</a>
  </div>
`;
