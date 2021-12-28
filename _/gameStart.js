import { getTemplateCloner, getLanguage, } from "./utils.js";
import game from "./game.js";
const selectedContinents = (() => {
	const continentsContainer = document.querySelector("continents");
	const continentSelect = continentsContainer.querySelector("options-select");
	const getClone = getTemplateCloner(continentSelect);
	const continents = [
		"africa",
		"northAmerica",
		"southAmerica",
		"asia",
		"europe",
		"oceania",
	];
	const checkboxSelectAll = document.querySelector("continents [_action=selectAll]");
	for (const continent of continents) {
		const clone = getClone({
			continentName: `continents.${continent}`,
		});
		let checkbox = clone.querySelector("input[type=checkbox]");
		checkbox.addEventListener("change", (evt) => {
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
		});
		continentSelect.append(clone);
	}
	checkboxSelectAll.addEventListener("change", () => {
		continentsContainer.classList.toggle("all-selected", checkboxSelectAll.checked);
	});
	return {
		get _() {
			return checkboxSelectAll.checked ? continents : continents.filter((...[, i]) => continentSelect.children[i].querySelector("input[type=checkbox]").checked);
		}
	};
})();
let selectedQuestionMode = (() => {
	const questionModeSelect = document.querySelector("question-mode options-select");
	const getClone = getTemplateCloner(questionModeSelect);
	const questionModes = [
		"countryName",
		"countryNameAndFlag",
		"flag",
	];
	for (const questionMode of questionModes) {
		const clone = getClone({
			questionMode: `questionMode.${questionMode}`,
		});
		if (questionMode === "countryNameAndFlag") {
			clone.querySelector("input[type=radio]").checked = true;
		}
		questionModeSelect.append(clone);
	}
	return {
		get _() {
			return questionModes.find((...[, i]) => questionModeSelect.children[i].querySelector("input[type=radio]").checked);
		}
	};
})();
let selectedAnswerMode = (() => {
	const answerModeSelect = document.querySelector("answer-mode options-select");
	const getClone = getTemplateCloner(answerModeSelect);
	const anserModes = [
		"showOnMap",
	];
	for (const answerMode of anserModes) {
		const clone = getClone({
			answerMode: `answerMode.${answerMode}`,
		});
		if (answerMode === "showOnMap") {
			clone.querySelector("input[type=radio]").checked = true;
		}
		answerModeSelect.append(clone);
	}
	return {
		get _() {
			return anserModes.find((...[, i]) => answerModeSelect.children[i].querySelector("input[type=radio]").checked);
		}
	};
})();
(async () => {
	document.body.setAttribute("_game-state", "start");
	document.querySelector("[_action=startQuiz]").addEventListener("click", async (evt) => {
		document.body.setAttribute("_game-state", "game");
		game(await dataPromise, {
			continents: [...selectedContinents._],
			questionMode: selectedQuestionMode._,
			answerMode: selectedAnswerMode._,
			language: getLanguage(),
		});
	});
	const dataPromise = (async () => await (await window.fetch("./_/data.min.json")).json())();
})();
//# sourceMappingURL=gameStart.js.map