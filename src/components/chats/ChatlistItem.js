export default `
	<div class="chatlist__item">
		<div class="chatlist__item__wrapper">
			<div class="chatlist__item__avatar"></div>
			<div class="chatlist__item__text">
				<div class="chatlist__item__name">%{name}%</div>
				<div class="chatlist__item__message">
					<span class="chatlist__item__message__quote">%{quote}%</span>
				</div>
			</div>
			<div class="chatlist__item__info">
				<div class="chatlist__item__time">%{time}%</div>
				<div class="chatlist__item__unreads">
					<span class="chatlist__item__unreads__count">%{unreads}%</span>
				</div>
			</div>
		</div>
	</div>
`;