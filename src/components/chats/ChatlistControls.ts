import './ChatlistControls.scss';

import {Block} from '../../modules/Block';
import {Link} from '../Link';
import {SearchInput} from './SearchInput';

export class ChatlistControls extends Block {
  constructor() {
    super();
    this.setProps({
      ProfileLink: new Link({
        url: '/settings',
        label: 'Профиль&ensp;<small>❯</small>',
      }),
      SearchInput: new SearchInput({name: 'search'}),
    });
  }
  render() {
    return `
      <nav class="chatlist__controls">
        <div class="container__element container__element_right">
          <span class="container__link container__link_secondary">
            %{ProfileLink}%
          </span>
        </div>
        <div class="container__element">
          %{SearchInput}%
        </div>
      </nav>
    `;
  }
}
