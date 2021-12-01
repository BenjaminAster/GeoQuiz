import translations, { languages } from './translations.js';
let chosenLanguage = localStorage.getItem("language") || (navigator.languages.join().includes("de") && "de") || languages[0];
export const translateElement = (element) => {
	for (const child of [...element.querySelectorAll("[data-text]")]) {
		const HTML = child.getAttribute("data-text").split(".").reduce((obj, crr) => obj?.[crr], translations)?.[chosenLanguage];
		const originalText = child.textContent;
		const text = new DOMParser().parseFromString(HTML, "text/html").body.textContent;
		const animationFrames = 20;
		for (let i = 0; i <= animationFrames; i++) {
			window.setTimeout(() => {
				if (i < animationFrames) {
					const textContent = text.slice(0, text.length * i / animationFrames) + originalText.slice(originalText.length * i / animationFrames, originalText.length);
					if (textContent.trim()) {
						child.textContent = textContent;
					}
					else {
						child.innerHTML = "&nbsp;";
					}
				}
				else {
					child.innerHTML = HTML;
				}
			}, i * 200 / animationFrames);
		}
	}
	return element;
};
export const getTemplateCloner = (container) => {
	const templateElement = container.querySelector("template");
	templateElement.remove();
	return (contentObj) => {
		const clone = templateElement.content.cloneNode(true);
		for (const [key, value] of Object.entries(contentObj ?? {})) {
			let element = clone.querySelector(`[data-content="${key}"]`);
			if (element) {
				element.setAttribute("data-text", value);
			}
			else {
				element = clone.querySelector(`[data-notranslate="${key}"]`);
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
	translateElement(document.body);
	localStorage.setItem("language", chosenLanguage);
};
export const getLanguage = () => chosenLanguage;
export { languages } from "./translations.js";
//# sourceMappingURL=languages.js.map