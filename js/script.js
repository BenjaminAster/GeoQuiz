// import "./worldMap.js";
import { getTemplateCloner, languages, setLanguage, } from "./languages.js";
navigator.serviceWorker.register("./service-worker.js", { scope: "./", type: "module" });
{
    // languages:
    setLanguage(languages[0]);
    const container = document.querySelector("language-select");
    const getClone = getTemplateCloner(container);
    for (const language of languages) {
        const clone = getClone({
            languageName: `languages.${language}`,
            languageCode: language.toUpperCase(),
        });
        let button = clone.firstElementChild;
        if (language === languages[0]) {
            button.classList.add("selected");
        }
        button.addEventListener("click", (evt) => {
            setLanguage(language);
            container.querySelector(".selected")?.classList.remove("selected");
            button.classList.add("selected");
        });
        container.append(clone);
    }
}
const browser = (() => {
    if (navigator.userAgentData?.brands?.find(({ brand }) => brand === "Chromium")) {
        return "chromium";
    }
})();
{
    // nav buttons & PWA:
    let installPromptEvent;
    window.addEventListener("beforeinstallprompt", (event) => {
        installPromptEvent = event;
    });
    const actions = {
        toggleTheme() {
            const colorSchemeMeta = document.querySelector(`meta[name="color-scheme"]`);
            const colorSchemes = ["dark", "light"];
            colorSchemeMeta.content = colorSchemes[+!colorSchemes.indexOf(colorSchemeMeta.getAttribute("content"))];
        },
        popOutWindow() {
            window.open(location.href, "_blank", "location=yes");
        },
        async toggleFullscreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen?.();
            }
            else {
                await document.body.requestFullscreen?.();
            }
            ;
        },
        async installApp() {
            installPromptEvent?.prompt?.();
            await installPromptEvent?.userChoice;
        },
        async refresh() {
            const serviceWorker = await navigator.serviceWorker.ready;
            await new Promise(async (resolve) => {
                navigator.serviceWorker.addEventListener("message", (evt) => {
                    if (evt.data === "refresh") {
                        resolve();
                    }
                });
                serviceWorker.active.postMessage("refresh");
            });
            await serviceWorker.unregister();
            location.reload();
        }
    };
    for (const [actionName, func] of Object.entries(actions)) {
        const button = document.querySelector(`[data-action="${actionName}"]`);
        button.addEventListener("click", func);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLDBCQUEwQjtBQUUxQixPQUFPLEVBRU4saUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxXQUFXLEdBQ1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFekY7SUFDQyxhQUFhO0lBRWIsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFCLE1BQU0sU0FBUyxHQUFnQixRQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDekUsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFOUMsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7UUFDakMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLFlBQVksRUFBRSxhQUFhLFFBQVEsRUFBRTtZQUNyQyxZQUFZLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRTtTQUNwQyxDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUM7UUFDckMsSUFBSSxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQWUsRUFBRSxFQUFFO1lBQ3BELFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixTQUFTLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxD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