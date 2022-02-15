import { getTemplateCloner, getLanguage, storage, } from "./utils.js";
import game, { stopGame, } from "./game.js";
const continents = [
    "africa",
    "northAmerica",
    "southAmerica",
    "asia",
    "europe",
    "oceania",
];
const startQuizButton = document.querySelector("[_action=startQuiz]");
const selectedContinents = (() => {
    const continentsContainer = document.querySelector(".continents");
    const continentSelect = continentsContainer.querySelector(".select");
    const getClone = getTemplateCloner(continentSelect);
    const initialContinents = storage.get("continents")?.filter?.((continent) => continents.includes(continent)) ?? continents;
    const checkboxSelectAll = document.querySelector(".continents [_action=selectAll]");
    checkboxSelectAll.checked = (initialContinents.length === continents.length);
    const continentsGetter = {
        get _() {
            return checkboxSelectAll.checked ? continents : continents.filter((...[, i]) => continentSelect.children[i + 1].querySelector("input[type=checkbox]")?.checked);
        }
    };
    for (const continent of continents) {
        const clone = getClone({
            continentName: `continents.${continent}`,
        });
        let checkbox = clone.querySelector("input[type=checkbox]");
        checkbox.checked = (initialContinents.includes(continent) && !checkboxSelectAll.checked);
        checkbox.addEventListener("change", (event) => {
            const checkboxes = [
                ...continentSelect.querySelectorAll("input[type=checkbox]")
            ];
            if (checkboxSelectAll.checked) {
                for (const continentCheckbox of checkboxes) {
                    continentCheckbox.checked = checkbox !== continentCheckbox;
                }
                checkboxSelectAll.click();
            }
            else if (checkboxes.every((checkbox) => checkbox.checked)) {
                checkboxSelectAll.click();
            }
            if (continentsGetter._.length === 0) {
                startQuizButton.disabled = true;
            }
            else {
                startQuizButton.disabled = false;
            }
        });
        continentSelect.append(clone);
    }
    checkboxSelectAll.addEventListener("change", () => {
        if (continentsGetter._.length === 0) {
            startQuizButton.disabled = true;
        }
        else {
            startQuizButton.disabled = false;
        }
    });
    return continentsGetter;
})();
let selectedQuestionMode = (() => {
    const questionModeSelect = document.querySelector(".question-mode .select");
    const getClone = getTemplateCloner(questionModeSelect);
    const questionModes = [
        "countryName",
        "countryNameAndFlag",
        "flag",
        "capital",
    ];
    const initialQuestionMode = questionModes.includes(storage.get("questionMode")) ? storage.get("questionMode") : questionModes[1];
    for (const questionMode of questionModes) {
        const clone = getClone({
            questionMode: `questionMode.${questionMode}`,
        });
        if (questionMode === initialQuestionMode) {
            clone.querySelector("input[type=radio]").checked = true;
        }
        questionModeSelect.append(clone);
    }
    return {
        get _() {
            return questionModes.find((...[, i]) => questionModeSelect.children[i + 1].querySelector("input[type=radio]")?.checked);
        }
    };
})();
let selectedAnswerMode = (() => {
    const answerModeSelect = document.querySelector(".answer-mode .select");
    const getClone = getTemplateCloner(answerModeSelect);
    const answerModes = [
        "showOnMap",
        "showCapitalOnMap",
    ];
    const initialAnswerMode = answerModes.includes(storage.get("answerMode")) ? storage.get("answerMode") : answerModes[0];
    for (const answerMode of answerModes) {
        const clone = getClone({
            answerMode: `answerMode.${answerMode}`,
        });
        if (answerMode === initialAnswerMode) {
            clone.querySelector("input[type=radio]").checked = true;
        }
        answerModeSelect.append(clone);
    }
    return {
        get _() {
            return answerModes.find((...[, i]) => answerModeSelect.children[i + 1].querySelector("input[type=radio]")?.checked);
        }
    };
})();
{
    const dataPromise = (async () => await (await window.fetch("./_/data.min.json")).json())();
    const startGame = async () => {
        const continents = selectedContinents._;
        const questionMode = selectedQuestionMode._;
        const answerMode = selectedAnswerMode._;
        storage.set("continents", continents);
        storage.set("questionMode", questionMode);
        storage.set("answerMode", answerMode);
        game(await dataPromise, {
            continents,
            questionMode,
            answerMode,
            language: getLanguage(),
        });
    };
    window.addEventListener("popstate", (event) => {
        if (event.state?.page === "game") {
            startGame();
        }
        else {
            document.body.setAttribute("_game-state", "start");
            stopGame();
        }
    });
    if (history.state?.page === "game") {
        startGame();
    }
    else {
        document.body.setAttribute("_game-state", "start");
    }
    document.querySelector("[_action=startQuiz]").addEventListener("click", async () => {
        await startGame();
        history.pushState({ page: "game" }, document.title, "./");
    });
}
//# sourceMappingURL=gameStart.js.map