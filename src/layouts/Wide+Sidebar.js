import('/src/components/Head.js');
import '/src/layouts/common.scss';
import '/src/layouts/Wide.scss';


document.body.innerHTML = `
	<div class="root">
		<aside class="sidebar sidebar_nav">
			%{sidebar}%
		</aside>
		<main class="container container_wide">
			%{contents}%
		</main>
	</div>
`;