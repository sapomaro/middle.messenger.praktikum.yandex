import {ChatsLayout} from '../components/layouts/Chats';
import {Block} from '../modules/Block';
import {ChatList} from '../components/chats/ChatList';
import {ChatBox} from '../components/chats/ChatBox';
import {Link} from '../components/links/Link';
import {RoundButton} from '../components/buttons/RoundButton';
import {SearchInput} from '../components/inputs/SearchInput';
import {AddUserPopup as Popup} from '../components/popups/AddUserPopup';
import {chatsLoadService} from '../services/chats';
import {StoreSynced} from '../modules/Store';

import {chats, messages} from '../services/_testStubData';

const view = new ChatsLayout({
  title: 'Чаты',
  user: 'Собеседник',
  Popup,
});

const searchInput = new SearchInput({name: 'search'});

const chatList = new (StoreSynced(ChatList))({chats});

searchInput.on('input', (event: Event) => {
  let list: Array<Record<string, unknown>> = [];
  if (event && event.target) {
    const target = event.target as HTMLInputElement;
    if (target.value && target.value !== '') {
      list = (chatList as ChatList).filterChats(target.value);
    } else {
      //ПЕРЕДЕЛАТЬ!!!
      list = chats;
    }
  }
  chatList.setProps({chats: list});
});

view.props.contents = new ChatBox({messages});

view.props.profileLink = new Link({
  url: '/settings',
  label: 'Профиль&ensp;<small>❯</small>',
});
view.props.addChatButton = new RoundButton({
  label: '<b>＋</b> Добавить чат',
  onclick: () => { console.log('addChatButton clicked'); },
});
view.props.searchInput = searchInput;
view.props.chatList = chatList;
view.props.aside = () => `
  <nav>
    <div class="container__element chatlist__controls">
      <span>
        %{addChatButton}%
      </span>
      <span class="container__link container__link_secondary">
        %{profileLink}%
      </span>
    </div>
    <div class="container__element">
      %{searchInput}%
    </div>
  </nav>
  %{chatList}%
`;

view.on(Block.EVENTS.MOUNT, chatsLoadService);

export {view};
