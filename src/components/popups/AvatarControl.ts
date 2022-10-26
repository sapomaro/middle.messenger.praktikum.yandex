import './AvatarControl.scss';

import {PopupControl} from './PopupControl';
import {resolveResourceUrl} from '../../services/resources';
import {sanitizeAll} from '../../services/sanitizer';

export class AvatarControl extends PopupControl {
  constructor(props?: Record<string, unknown>) {
    super(props);
  }
  render(props?: Record<string, unknown>): string {
    let avatar = '';
    if (props && props.user) {
      const user = props.user as Record<string, string>;
      if (user.avatar) {
        avatar = resolveResourceUrl(sanitizeAll(user.avatar));
      }
    }
    if (props && props.unclickable) {
      return `<div class="form__avatar"
        ${avatar? 'style="background-image: url('+avatar+')"' : ''}></div>`;
    } else {
      return `
        <div class="form__avatar" onclick="%{showPopup}%"
        ${avatar? 'style="background-image: url('+avatar+')"' : ''}>
          <div class="form__avatar-control">
            <span>Поменять аватар</span>
          </div>
        </div>
      `;
    }
  }
}
