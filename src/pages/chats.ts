import {ChatsLayout} from '../components/layouts/Chats';
import {ChatList} from '../components/chats/ChatList';
import {ChatBox} from '../components/chats/ChatBox';
import {Link} from '../components/links/Link';
import {SearchInput} from '../components/inputs/SearchInput';
import {AddUserPopup as Popup} from '../components/popups/AddUserPopup';

import {chats, messages} from '../services/_testStubData';

const view = new ChatsLayout({
  title: 'Чаты',
  user: 'Собеседник',
  Popup,
  ProfileLink: new Link({
    url: '/settings',
    label: 'Профиль&ensp;<small>❯</small>',
  }),
});

const searchInput = new SearchInput({name: 'search'});

const chatList = new ChatList({chats});

searchInput.on('input', (event: Event) => {
  let list: Array<Record<string, unknown>> = [];
  if (event && event.target) {
    const target = event.target as HTMLInputElement;
    if (target.value && target.value !== '') {
      list = chatList.filterChats(target.value);
    } else {
      list = chats;
    }
  }
  chatList.setProps({chats: list});
});

view.props.contents = new ChatBox({messages});

view.props.SearchInput = searchInput;
view.props.ChatList = chatList;
view.props.aside = () => `
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
  %{ChatList}%
`;

export {view};
