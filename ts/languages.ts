
import translations, { languages } from './translations.js';

let chosenLanguage = localStorage.getItem(
	`${new URL(document.baseURI).pathname}:language`
) || languages[0];

export const translateElement = <T extends HTMLElement | DocumentFragment>(element: T) => {
	for (const child of [...element.querySelectorAll("[_text]") as any as HTMLElement[]]) {
		const HTML: string = (child.getAttribute("_text") as string).split(".").reduce(
			(obj, crr) => obj?.[crr], translations
		)?.[chosenLanguage];

		child.innerHTML = HTML;
	}
	return element;
}

export const getTemplateCloner = (container: HTMLElement) => {
	const templateElement: HTMLTemplateElement = container.querySelector("template");
	templateElement.remove();

	return (contentObj?: Record<string, string>): DocumentFragment => {
		const clone = templateElement.content.cloneNode(true) as DocumentFragment;
		for (const [key, value] of Object.entries(contentObj ?? {})) {
			let element: HTMLElement = clone.querySelector(`[_content="${key}"]`);
			if (element) {
				element.setAttribute("_text", value);
			} else {
				element = clone.querySelector(`[_notranslate="${key}"]`);
				if (element) {
					element.innerHTML = value;
				}
			}
		}
		return translateElement(clone);
	};
}

export const setLanguage = (language?: string) => {
	if (language) chosenLanguage = language;
	translateElement(document.body);
	localStorage.setItem(`${new URL(document.baseURI).pathname}:language`, chosenLanguage);
};

export const getLanguage = () => chosenLanguage;

export { languages } from "./translations.js";
