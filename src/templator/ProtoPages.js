
const ProtoPages = {};

let templateContext;

const templatePattern = /%\{\s?(.*?)\s?\}%/gi;
const templateSubpatterns = {
	//importFunc: /import\(['"]([^'"]+)['"]\)/i,
	//arrayExpr: /([^\[]+)\[([^\]]+)\]/
};
const templatePartialKey = 'key';
const templatePartialIndex = 0;


const componentPattern = /^\<\>([^]*?)\<\/\>$/gi;
const componentTags = { start: '<>', end: '</>' }



const resolvePattern = (pattern) => {
	pattern = pattern.trim();
	let matches,
		context = templateContext;
	

	let props = pattern.trim().split('.');
	for (let i = 0; i < props.length; ++i) {
		if (typeof context[props[i]] !== 'undefined') {
			context = context[props[i]];
		}
		else {
			//templateSubpatterns.arrayExpr.lastIndex = 0;
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
		}
	}
	if (typeof context === 'function') {
		context = componentTags.start + context() + componentTags.end;
	}
	
	if (typeof context === 'string' || typeof context === 'number') {
		return context;
	}
	else {
		return null;
	}
};

const resolveString = (str) => {
	templatePattern.lastIndex = 0;
	if (!templatePattern.test(str)) { 
		return null; 
	}
	let matches, 
		asset, 
		old = str;
		
	templatePattern.lastIndex = 0;
	while (matches = templatePattern.exec(str)) {
		asset = resolvePattern(matches[1]);
		if (asset !== null) {
			str = str.replace(matches[0], asset);
			// subtract pattern length to start next exec from new insertion
			// allows resolving nested patterns
			templatePattern.lastIndex -= matches[0].length; 
			
		}
	}
	if (str !== old) { 
		return str; 
	}
	return null;
};


const traverseChildren = (node) => {
	if (!node.childNodes) { return; }
	for (let i = node.childNodes.length - 1; i >= 0; --i) {
		if (node.childNodes[i].nodeType === 1) {
			traverseAttributes(node.childNodes[i]);
			if (node.childNodes[i].hasAttribute(templatePartialKey)) {
				const str = resolveString(node.childNodes[i].innerHTML);
//console.log(str);
				if (str !== null) {
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
				}
			}
			else {
				traverseChildren(node.childNodes[i]);
			}
		}
		else if (node.childNodes[i].nodeType === 3) {

			const str = resolveString(node.childNodes[i].textContent);

			if (str !== null) {
				let matches;
				componentPattern.lastIndex = 0;
				if ((matches = componentPattern.exec(str.trim())) && node.childNodes.length === 1) {
					node.innerHTML = matches[1];						
				}
				else {
//console.log(str);
					node.childNodes[i].textContent = str;
				}
			}
		}
	}
};

const traverseAttributes = (node) => {
	for (let i = node.attributes.length - 1; i >= 0; --i) {
		const attr = resolveString(node.attributes[i].nodeValue);
		if (attr !== null) {
			node.setAttribute(node.attributes[i].nodeName, attr);
		}
	}
};


ProtoPages.compileAll = (context = window) => {
	templateContext = context;
	traverseChildren(document.head);
	traverseChildren(document.body);
};


ProtoPages.compile = (context = window) => {
	ProtoPages.onload(() => {
		setTimeout(() => {
			ProtoPages.compileAll(context);
		}, 1);
	});
};

ProtoPages.tasks = [];
ProtoPages.onload = (task, context = window) => {
	ProtoPages.tasks.push({ task, context });
};
ProtoPages.runTasks = () => {
	for (const { task, context } of ProtoPages.tasks) {
		task(context);
	}
};

ProtoPages.init = (context = window) => {
	if (document.readyState === 'interactive' || document.readyState === 'complete') {
		ProtoPages.runTasks();
	}
	else {
		window.addEventListener('DOMContentLoaded', (event) => {
			setTimeout(() => {
				ProtoPages.runTasks();
			}, 1);
		});
		window.addEventListener('load', (event) => {
			setTimeout(() => {
				ProtoPages.runTasks();
			}, 1);
		});
	}
};

ProtoPages.init();
ProtoPages.onload(() => {
	ProtoPages.compileAll();
});


export default ProtoPages;



/*
element.cloneNode(true) // клонирует элемент

parent.appendChild(el) // вставляет узел в конец
parent.removeChild(el) // удаляет узел
parent.replaceChild(newEl, oldEl) // заменяет узел
parent.insertBefore(elem, nextSibling) // вставляет узел 

*/
