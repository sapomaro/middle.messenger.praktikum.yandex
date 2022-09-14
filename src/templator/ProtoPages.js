window.ProtoPages = (() => {
	"use strict";
	
	const ProtoPages = {};
	
	let templateContext;
	
	const templatePattern = /%\{\s?(.*?)\s?\}%/gi;
	const templateSubpatterns = {
		arrayKey: /([^\[]+)\[([^\]]+)\]/
	};
	const templatePartialKey = 'key';
	const templatePartialIndex = 0;

	const resolvePattern = (pattern) => {
		let context = templateContext,
			props = pattern.trim().split('.');
		
		for (let i = 0; i < props.length; ++i) {
			if (typeof context[props[i]] !== 'undefined') {
				context = context[props[i]];
			}
			else {
				templateSubpatterns.arrayKey.lastIndex = 0;
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
			}
		}
		if (typeof context === 'string' || typeof context === 'number') {
			return context;
		}
		return null;
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
console.log(str);
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
			else {
				const str = resolveString(node.childNodes[i].textContent);
				if (str !== null) {
					node.childNodes[i].textContent = str;
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
	
	
	ProtoPages.compile = (context = window) => {
		templateContext = context;
		traverseChildren(document.body);
	};
	
	/*
element.cloneNode(true) // клонирует элемент
 
parent.appendChild(el) // вставляет узел в конец
parent.removeChild(el) // удаляет узел
parent.replaceChild(newEl, oldEl) // заменяет узел
parent.insertBefore(elem, nextSibling) // вставляет узел 

	*/
	
	window.addEventListener('load', (event) => {
		ProtoPages.compile();
	});
	
	return ProtoPages;
	
})();