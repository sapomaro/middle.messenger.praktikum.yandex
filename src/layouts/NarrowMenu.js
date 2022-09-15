import('/src/components/Head.js');
import '/src/layouts/common.scss';
import '/src/layouts/NarrowMenu.scss';


document.body.innerHTML = `
	<div class="root">
		<main class="container container_narrow">
			%{contents}%
		</main>
	</div>
`;