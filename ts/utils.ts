
import translations, { languages } from "./translations.js";

export const storage: Record<string, Function> = {
	get(key: string): any {
		try {
			return JSON.parse(localStorage.getItem(`${new URL(document.baseURI).pathname}:${key}`));
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	set(key: string, value: any): void {
		localStorage.setItem(`${new URL(document.baseURI).pathname}:${key}`, JSON.stringify(value));
	},
};

let chosenLanguage = storage.get("language") || languages[0];

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
	chosenLanguage = languages.includes(chosenLanguage) ? chosenLanguage : languages[0];
	translateElement(document.body);
	document.title = translations.title[chosenLanguage];
	storage.set("language", chosenLanguage);
};


export const getLanguage = () => chosenLanguage;

export { languages } from "./translations.js";
