import './AvatarControl.scss';

import {PopupControl} from './PopupControl';

export class AvatarControl extends PopupControl {
  constructor(props?: Record<string, unknown>) {
    super(props);
  }
  render(props?: Record<string, unknown>): string {
    if (props && props.unclickable) {
      return `<div class="form__avatar"></div>`;
    } else {
      let avatar = '';
      if (props && props.user && props.user.avatar) {
        avatar = props.user.avatar;
      }
      return `
        <div class="form__avatar" onclick="%{showPopup}%"
        ${avatar? 'style="background: url('+avatar+')"' : ''}>
          <div class="form__avatar__control">
            <span>Поменять аватар</span>
          </div>
        </div>
      `;
    }
  }
}
