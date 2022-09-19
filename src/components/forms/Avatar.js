import '/src/components/forms/Avatar.scss';

export const AvatarPic = (props) => `
	<div class="form__avatar"></div>
`;


export const AvatarControl = (props) => `
	<div class="form__avatar" onclick="(() => { 
		document.querySelector('.popup').style.display = 'flex'; 
	})();">
		<div class="form__avatar__control">
			<span>Поменять аватар</span>
		</div>
	</div>
`;


export const AvatarPopup = (props) => `
	<form name="avatar">
		<h1 class="container__header">Загрузите файл</h1>
		<br>
		<div class="container__element container__element_centered">
			<label>
				<a class="container__link container__link_underlined">Выбрать файл <br>на компьютере</a>
				<input name="avatar" type="file" accept="image/png, image/jpeg" class="form__input__file">
			</label>
		</div>
		<br>
		
		%{ Button({ 
			"name": "submit", "type": "button", "label": "Поменять",
			"error": "Нужно выбрать файл"
		}) }%
		
	</form>
`;