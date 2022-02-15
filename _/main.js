import { getTemplateCloner, languages, setLanguage, getLanguage, storage, setColorScheme, } from "./utils.js";
import "./gameStart.js";
import { installPromptEvent } from "./pwa.js";
{
    setColorScheme(storage.get("colorScheme") ?? "dark");
    const actions = {
        toggleTheme() {
            setColorScheme();
        },
        popOutWindow() {
            window.open(location.href, "_blank", "_");
        },
        async toggleFullscreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen?.();
            }
            else {
                await document.documentElement.requestFullscreen?.();
            }
            ;
        },
        async installApp() {
            installPromptEvent?.prompt?.();
        },
        share() {
            navigator.share?.({
                title: document.title,
                text: document.querySelector("meta[name=description]")?.getAttribute("content"),
                url: location.href,
            });
        }
    };
    for (const [actionName, func] of Object.entries(actions)) {
        console.log(actionName, func);
        const buttons = [...document.querySelectorAll(`[_action="${actionName}"]`)];
        buttons.forEach((button) => button.addEventListener("click", () => func()));
    }
}
{
    setLanguage();
    const container = document.querySelector(".languages .select");
    const getClone = getTemplateCloner(container);
    for (const language of languages) {
        const clone = getClone({
            languageName: `languages.${language}`,
            languageCode: language.toUpperCase(),
        });
        const radio = clone.querySelector("input[type=radio]");
        if (language === getLanguage()) {
            radio.checked = true;
        }
        radio.addEventListener("change", (event) => {
            setLanguage(language);
        });
        container.append(clone);
    }
}
{
    document.body.setAttribute("_loaded", "");
}
//# sourceMappingURL=main.js.map