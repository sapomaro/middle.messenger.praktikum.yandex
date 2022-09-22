import { ProtoPages } from '/src/templator/ProtoPages.js';

import '/src/components/chats/ChatboxControls.scss';


export const ChatboxFooter = () => `
	<label class="chatbox__footer__control__wrapper">
		<input type="checkbox" class="chatbox__dropdown__toggle chatbox__element_hidden">
		<a class="chatbox__attach__control chatbox__dropdown__control"></a>
		<span class="chatbox__dropdown chatbox__dropdown_bottom">
			<span class="chatbox__dropdown__menu">
				<span class="chatbox__dropdown__element">
					<span class="chatbox__icon chatbox__icon_photo"></span> Фото или видео
				</span>
				<span class="chatbox__dropdown__element">
					<span class="chatbox__icon chatbox__icon_file"></span> Файл
				</span>
				<span class="chatbox__dropdown__element">
					<span class="chatbox__icon chatbox__icon_location"></span> Локация
				</span>
			</span>
		</span>
	</label>
	
	<textarea id="messageField" name="message" class="chatbox__send__textarea" 
		rows="1" data-placeholder="Сообщение..."></textarea>
	
	<button type="button" class="form__button form__button_standard form__button_round chatbox__send__button">➜</button>
`;



ProtoPages.on('compile', () => {

	const messageField = document.getElementById('messageField');
	
	messageField.togglePlaceholder = (event = {}) => {
		if (messageField.dataset && event.type) {
			const placeholder = messageField.dataset.placeholder;
			if (placeholder) {
				if (event.type === 'blur' && messageField.value === '') {
					messageField.value = placeholder;
				}
				else if (event.type === 'focus' && messageField.value === placeholder) {
					messageField.value = '';
				}
			}
		}
	};
	messageField.autoResize = () => {
		const style = messageField.currentStyle || window.getComputedStyle(messageField);
		const boxSizing = (style.boxSizing === 'border-box')
			? parseInt(style.borderBottomWidth, 10) + parseInt(style.borderTopWidth, 10) : 0;
		
		messageField.style.overflowY = 'hidden';
		messageField.style.height = 'auto';
		messageField.style.height = (messageField.scrollHeight + boxSizing) + 'px'; 
	};
	
	messageField.addEventListener('input', () => {
		messageField.autoResize();
	});
	messageField.addEventListener('focus', (event) => {
		messageField.togglePlaceholder(event);
	});
	messageField.addEventListener('blur', (event) => {
		messageField.togglePlaceholder(event);
	});
	
	messageField.togglePlaceholder({ type: 'blur' });
	messageField.autoResize();

});