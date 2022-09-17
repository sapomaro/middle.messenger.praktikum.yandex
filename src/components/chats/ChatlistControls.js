import '/src/components/chats/ChatlistControls.scss';

export default (props) => `
	<nav class="chatlist__controls">
		<div class="container__element container__element_right">
			<a href="profile.html" class="container__link container__link_grey">Профиль&ensp;<small>❯</small></a>
		</div>
		<div class="container__element">
			<div class="chatlist__search__field__wrapper">
				<input name="search" type="text" class="form__input__field chatlist__search__field" 
					value="" oninput="this.setAttribute('value', this.value);">
				<label class="chatlist__search__label">
					<span class="chatlist__search__label__icon"></span>
					<span class="chatlist__search__label__text">Поиск...</span>
				</label>
			</div>
			
		</div>
	</nav>
`;