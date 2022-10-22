import {Form} from '../forms/Form';
import {FormError} from '../forms/FormError';
import {StandardInput as Input} from '../inputs/StandardInput';
import {StandardButton as Button} from '../buttons/StandardButton';
import {StoreSynced} from '../../modules/Store';

type FormSetProps = {
  name: string;
  header: string;
  submitLabel: string;
  inputs: string;
};

export class FormSet extends Form {
  constructor(props: FormSetProps) {
    super(props);
    this.setProps({
      Input,
      formSubmitButton: new (StoreSynced(Button))({
        name: 'submit',
        type: 'submit',
        label: props.submitLabel,
        isLoading: false,
      }),
      formError: new (StoreSynced(FormError))({currentError: null}),
      fieldset: () => `
        <h1 class="container__header">${props.header}</h1>
        <br>
        ${props.inputs}
        <br>
        %{formSubmitButton}%
        %{formError}%
      `,
    });
  }
}
