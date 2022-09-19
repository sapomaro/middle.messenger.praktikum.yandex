import '/src/components/chats/ChatboxControls.scss';

export const ChatboxHeader = (props) => `
	<div class="chatbox__header__avatar"></div>
	
	<h2 class="chatbox__header__text">%{ user }%</h2>
	
	<label class="chatbox__header__control__wrapper">
		<input type="checkbox" class="chatbox__dropdown__toggle chatbox__element_hidden">
		<a class="chatbox__header__control chatbox__dropdown__control">⋮</a>
		<span class="chatbox__dropdown chatbox__dropdown_top">
			<span class="chatbox__dropdown__menu">
				<span class="chatbox__dropdown__element" onclick="(() => { 
					document.querySelector('.popup').style.display = 'flex'; 
				})();">
					<span class="chatbox__dropdown__icon">+</span> Добавить пользователя
				</span>
				<span class="chatbox__dropdown__element">
					<span class="chatbox__dropdown__icon">×</span> Удалить пользователя
				</span>
			</span>
		</span>
	</label>
`;
