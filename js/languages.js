import translations, { languages } from './translations.js';
let chosenLanguage = languages[0];
export const translateElement = (element) => {
    for (const child of [...element.querySelectorAll("[data-text]")]) {
        child.textContent = child.getAttribute("data-text").split(".").reduce((obj, crr) => obj?.[crr], translations)?.[chosenLanguage];
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
                    element.textContent = value;
                }
            }
        }
        return translateElement(clone);
    };
};
export const setLanguage = (language) => {
    chosenLanguage = language;
    translateElement(document.body);
};
export { languages } from "./translations.js";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvbGFuZ3VhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sWUFBWSxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFNUQsSUFBSSxjQUFjLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWxDLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQTJDLE9BQVUsRUFBRSxFQUFFO0lBQ3hGLEtBQUssTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQTBCLENBQUMsRUFBRTtRQUMzRixLQUFLLENBQUMsV0FBVyxHQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FDaEYsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxZQUFZLENBQ3RDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUNwQjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2hCLENBQUMsQ0FBQTtBQUVELE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsU0FBc0IsRUFBRSxFQUFFO0lBQzNELE1BQU0sZUFBZSxHQUF3QixTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pGLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUV6QixPQUFPLENBQUMsVUFBbUMsRUFBb0IsRUFBRTtRQUNoRSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQXFCLENBQUM7UUFDMUUsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQzVELElBQUksT0FBTyxHQUFnQixLQUFLLENBQUMsYUFBYSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxDQUFDO1lBQzFFLElBQUksT0FBTyxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNOLE9BQU8sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLE9BQU8sRUFBRTtvQkFDWixPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztpQkFDNUI7YUFDRDtTQUNEO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUM7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDL0MsY0FBYyxHQUFHLFFBQVEsQ0FBQztJQUMxQixnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsQ0FBQyxDQUFDO0FBRUYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDIn0=