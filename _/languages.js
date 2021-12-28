import translations, { languages } from './translations.js';
let chosenLanguage = localStorage.getItem(`${new URL(document.baseURI).pathname}:language`) || languages[0];
export const translateElement = (element) => {
	for (const child of [...element.querySelectorAll("[_text]")]) {
		const HTML = child.getAttribute("_text").split(".").reduce((obj, crr) => obj?.[crr], translations)?.[chosenLanguage];
		child.innerHTML = HTML;
	}
	return element;
};
export const getTemplateCloner = (container) => {
	const templateElement = container.querySelector("template");
	templateElement.remove();
	return (contentObj) => {
		const clone = templateElement.content.cloneNode(true);
		for (const [key, value] of Object.entries(contentObj ?? {})) {
			let element = clone.querySelector(`[_content="${key}"]`);
			if (element) {
				element.setAttribute("_text", value);
			}
			else {
				element = clone.querySelector(`[_notranslate="${key}"]`);
				if (element) {
					element.innerHTML = value;
				}
			}
		}
		return translateElement(clone);
	};
};
export const setLanguage = (language) => {
	if (language)
		chosenLanguage = language;
	chosenLanguage = languages.includes(chosenLanguage) ? chosenLanguage : languages[0];
	translateElement(document.body);
	document.title = translations.title[chosenLanguage];
	localStorage.setItem(`${new URL(document.baseURI).pathname}:language`, chosenLanguage);
};
export const getLanguage = () => chosenLanguage;
export { languages } from "./translations.js";
//# sourceMappingURL=languages.js.map