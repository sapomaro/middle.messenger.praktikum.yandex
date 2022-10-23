import {ChatsLayout} from '../components/layouts/Chats';
import {Block} from '../modules/Block';
import {ChatList} from '../components/chats/ChatList';
import {ChatBox} from '../components/chats/ChatBox';
import {Link} from '../components/links/Link';
import {RoundButton} from '../components/buttons/RoundButton';
import {SearchInput} from '../components/inputs/SearchInput';
import {AddUserPopup} from '../components/popups/AddUserPopup';
import {DeleteUserPopup} from '../components/popups/DeleteUserPopup';
import {AddChatPopup} from '../components/popups/AddChatPopup';
import {DeleteChatPopup} from '../components/popups/DeleteChatPopup';
import {PopupControl} from '../components/popups/PopupControl';
import {chatsLoadService, chatsUnloadService} from '../services/chatChannels';
import {StoreSynced} from '../modules/Store';

const view = new ChatsLayout({
  title: 'Чаты',
  addUserPopup: new AddUserPopup({id: 'AddUserPopup'}),
  deleteUserPopup: new DeleteUserPopup({id: 'DeleteUserPopup'}),
  addChatPopup: new AddChatPopup({id: 'AddChatPopup'}),
  deleteChatPopup: new DeleteChatPopup({id: 'DeleteChatPopup'}),
  popup: `%{addUserPopup}% %{deleteUserPopup}%
    %{addChatPopup}% %{deleteChatPopup}%`,
});

const searchInput = new SearchInput({name: 'search'});

const chatList = new (StoreSynced(ChatList))();

view.props.contents = new ChatBox();

view.props.profileLink = new Link({
  url: '/settings',
  label: 'Профиль&ensp;<small>❯</small>',
});

const addChatControl = new PopupControl({forId: 'AddChatPopup'});
view.props.addChatButton = new RoundButton({
  label: '<b>＋</b> Добавить чат&nbsp;',
  onclick: () => {
    addChatControl.showPopup();
  },
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

view.on(Block.EVENTS.UNMOUNT, chatsUnloadService);

export {view};
