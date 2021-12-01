
import translations, { languages } from './translations.js';

let chosenLanguage = localStorage.getItem("language") || (
	navigator.languages.join().includes("de") && "de"
) || languages[0];

export const translateElement = <T extends HTMLElement | DocumentFragment>(element: T) => {
	for (const child of [...(element.querySelectorAll("[data-text]") as any as HTMLElement[])]) {
		// const originalHTML: string = child.innerHTML.trim();
		const HTML: string = (child.getAttribute("data-text") as string).split(".").reduce(
			(obj, crr) => obj?.[crr], translations
		)?.[chosenLanguage];

		const originalText: string = child.textContent;
		const text: string = new DOMParser().parseFromString(HTML, "text/html").body.textContent;

		const animationFrames: number = 20;
		for (let i: number = 0; i <= animationFrames; i++) {
			window.setTimeout(() => {
				if (i < animationFrames) {
					const textContent = text.slice(
						0, text.length * i / animationFrames
					) + originalText.slice(
						originalText.length * i / animationFrames, originalText.length
					);
					if (textContent.trim()) {
						child.textContent = textContent;
					} else {
						child.innerHTML = "&nbsp;";
					}
				} else {
					child.innerHTML = HTML;
				}
			}, i * 200 / animationFrames);
		}
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
	localStorage.setItem("language", chosenLanguage);
};

export const getLanguage = () => chosenLanguage;

export { languages } from "./translations.js";
