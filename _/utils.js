import translations, { languages } from "./translations.js";
export const storage = {
	get(key) {
		try {
			return JSON.parse(localStorage.getItem(`${new URL(document.baseURI).pathname}:${key}`));
		}
		catch (error) {
			console.error(error);
			return null;
		}
	},
	set(key, value) {
		localStorage.setItem(`${new URL(document.baseURI).pathname}:${key}`, JSON.stringify(value));
	},
};
let chosenLanguage = storage.get("language") || languages[0];
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
	storage.set("language", chosenLanguage);
};
export const getLanguage = () => chosenLanguage;
export { languages } from "./translations.js";
//# sourceMappingURL=utils.js.map