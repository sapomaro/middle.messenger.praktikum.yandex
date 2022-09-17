import ProtoPages from '/src/templator/ProtoPages.js';

import '/src/components/Head.js';
import '/src/layouts/common.scss';
import '/src/layouts/Narrow.scss';

ProtoPages.onload(() => {
	document.body.innerHTML = `
		<div class="root">
			<main class="container container_narrow">
				%{contents}%
			</main>
		</div>
	`;
});