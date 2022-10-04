import '/src/components/chats/ChatboxControls.scss';

import {Form} from '/src/components/forms/Form';

const ChatboxFooterChildren = () => `
  <label class="chatbox__footer__control__wrapper">
    <input type="checkbox" 
      class="chatbox__dropdown__toggle chatbox__element_hidden">
    <a class="chatbox__attach__control chatbox__dropdown__control"></a>
    <span class="chatbox__dropdown chatbox__dropdown_bottom">
      <span class="chatbox__dropdown__menu">
        <span class="chatbox__dropdown__element">
          <span class="chatbox__icon chatbox__icon_photo"></span> 
          Фото или видео
        </span>
        <span class="chatbox__dropdown__element">
          <span class="chatbox__icon chatbox__icon_file"></span> 
          Файл
        </span>
        <span class="chatbox__dropdown__element">
          <span class="chatbox__icon chatbox__icon_location"></span> 
          Локация
        </span>
      </span>
    </span>
  </label>
  
  %{ ChatboxTextarea({"name": "message", "placeholder": "Сообщение..."}) }%

  <button type="submit" 
    class="form__button form__button_standard form__button_round 
      chatbox__send__button">
      ➜
  </button>
`;

export const ChatboxFooter = new Form({
  name: 'msg',
  fieldset: ChatboxFooterChildren,
});
