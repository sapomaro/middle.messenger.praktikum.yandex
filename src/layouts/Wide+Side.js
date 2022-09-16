import('/src/components/Head.js');
import '/src/layouts/common.scss';
import '/src/layouts/Wide.scss';
import '/src/layouts/Narrow.scss';

document.body.innerHTML = `
	<div class="popup">
		<div class="container container_narrow">
			%{popup}%
		</div>
	</div>
	<div class="root">
		<aside class="sidebar sidebar_nav">
			%{sidebar}%
		</aside>
		<main class="container container_wide">
			%{contents}%
		</main>
	</div>
`;

const popup = document.querySelector('.popup');
popup.addEventListener('click', (event) => {
	if (event.target === popup) {
		popup.style.display = 'none';
	}
});