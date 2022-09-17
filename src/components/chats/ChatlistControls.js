import '/src/components/chats/ChatlistControls.scss';

export default (props) => `
	<nav class="chatlist__controls">
		<div class="container__element container__element_right">
			<a href="profile.html" class="container__link container__link_grey">Профиль&ensp;<small>❯</small></a>
		</div>
		<div class="container__element">
			<div class="form__element_grey form__element_rounded">
				<input name="search" type="text" class="form__input__field chatlist__search__field" 
					value="" oninput="this.setAttribute('value', this.value);">
				<label class="chatlist__search__label">
					<img src="../../public/search_icon.svg" width="22" height="22"> <span class="chatlist__search__label__text">Поиск</span>
				</label>
			</div>
			
		</div>
	</nav>
`;