import '/src/components/chats/ChatboxMessage.scss';

export const ChatboxMessage = (props) => `
  <div class="chatbox__message chatbox__message_${props.type}">
    <span class="chatbox__message__text">${props.text}</span>
    <span class="chatbox__message__info">
      <span class="chatbox__message__status">
        ${ props.status? '✓✓' : '' }&nbsp;
      </span>
      <time class="chatbox__message__time">${props.when}</time>
    </span>
  </div>
`;
