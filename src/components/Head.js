
const favicon = new URL('../../public/favicon.ico', import.meta.url);

document.head.innerHTML += `
	<meta charset="utf-8">
	<title>%{title}%</title>
	<link href="${favicon}" rel="icon" />
`;

