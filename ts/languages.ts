
import translations, { languages } from './translations.js';

let chosenLanguage = languages[0];

export const translateElement = <T extends HTMLElement | DocumentFragment>(element: T) => {
	for (const child of [...(element.querySelectorAll("[data-text]") as any as HTMLElement[])]) {
		child.textContent = (child.getAttribute("data-text") as string).split(".").reduce(
			(obj, crr) => obj?.[crr], translations
		)?.[chosenLanguage];
	}
	return element;
}

export const getTemplateCloner = (container: HTMLElement) => {
	const templateElement: HTMLTemplateElement = container.querySelector("template");
	templateElement.remove();

	return (contentObj?: Record<string, string>): DocumentFragment => {
		const clone = templateElement.content.cloneNode(true) as DocumentFragment;
		for (const [key, value] of Object.entries(contentObj ?? {})) {
			let element: HTMLElement = clone.querySelector(`[data-content="${key}"]`);
			if (element) {
				element.setAttribute("data-text", value);
			} else {
				element = clone.querySelector(`[data-notranslate="${key}"]`);
				if (element) {
					element.textContent = value;
				}
			}
		}
		return translateElement(clone);
	};
}

export const setLanguage = (language: string) => {
	chosenLanguage = language;
	translateElement(document.body);
};

export { languages } from "./translations.js";
