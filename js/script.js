// import "./worldMap.js";
import { getTemplateCloner, languages, setLanguage, } from "./languages.js";
navigator.serviceWorker.register("./service-worker.js", { scope: "./", type: "module" });
{
    // languages:
    setLanguage("en");
    const container = document.querySelector("language-select");
    const getClone = getTemplateCloner(container);
    for (const language of languages) {
        const clone = getClone({
            languageName: `languages.${language}`,
            languageCode: language.toUpperCase(),
        });
        clone.firstElementChild.addEventListener("click", () => {
            setLanguage(language);
        });
        container.appendChild(clone);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLDBCQUEwQjtBQUUxQixPQUFPLEVBRU4saUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxXQUFXLEdBQ1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFekY7SUFDQyxhQUFhO0lBRWIsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxCLE1BQU0sU0FBUyxHQUFnQixRQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDekUsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFOUMsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7UUFDakMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLFlBQVksRUFBRSxhQUFhLFFBQVEsRUFBRTtZQUNyQyxZQUFZLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRTtTQUNwQyxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCO0NBQ0QifQ==