
import {
	getTemplateCloner,
	getLanguage,
} from "./utils.js";

import game, { CountriesData } from "./game.js";

const selectedContinents: { _: string[] } = (() => {
	const continentsContainer: HTMLElement = document.querySelector("continents");

	const continentSelect: HTMLElement = continentsContainer.querySelector("options-select");
	const getClone = getTemplateCloner(continentSelect);

	const continents: string[] = [
		"africa",
		"northAmerica",
		"southAmerica",
		"asia",
		"europe",
		"oceania",
	];

	const checkboxSelectAll: HTMLInputElement = document.querySelector(
		"continents [_action=selectAll]"
	);

	for (const continent of continents) {
		const clone: DocumentFragment = getClone({
			continentName: `continents.${continent}`,
		});

		let checkbox: HTMLInputElement = clone.querySelector("input[type=checkbox]");

		checkbox.addEventListener("change", (evt: InputEvent) => {
			const checkboxes: HTMLInputElement[] = [
				...continentSelect.querySelectorAll<HTMLInputElement>("input[type=checkbox]")
			];

			if (checkboxSelectAll.checked) {
				for (const continentCheckbox of checkboxes) {
					continentCheckbox.checked = checkbox !== continentCheckbox;
				}
				checkboxSelectAll.click();
			} else if (checkboxes.every((checkbox: HTMLInputElement) => checkbox.checked)) {
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
			return checkboxSelectAll.checked ? continents : continents.filter(
				(...[, i]) => continentSelect.children[i].querySelector<HTMLInputElement>(
					"input[type=checkbox]"
				).checked
			);
		}
	};
})();


let selectedQuestionMode: { _: string } = (() => {
	const questionModeSelect: HTMLElement = document.querySelector("question-mode options-select");
	const getClone = getTemplateCloner(questionModeSelect);

	const questionModes: string[] = [
		"countryName",
		"countryNameAndFlag",
		"flag",
	];

	for (const questionMode of questionModes) {
		const clone: DocumentFragment = getClone({
			questionMode: `questionMode.${questionMode}`,
		});

		if (questionMode === "countryNameAndFlag") {
			clone.querySelector<HTMLInputElement>("input[type=radio]").checked = true;
		}

		questionModeSelect.append(clone);
	}

	return {
		get _() {
			return questionModes.find(
				(...[, i]) => questionModeSelect.children[i].querySelector<HTMLInputElement>(
					"input[type=radio]"
				).checked
			);
		}
	};
})();



let selectedAnswerMode: { _: string } = (() => {
	const answerModeSelect: HTMLElement = document.querySelector("answer-mode options-select");
	const getClone = getTemplateCloner(answerModeSelect);

	const anserModes: string[] = [
		"showOnMap",
	];

	for (const answerMode of anserModes) {
		const clone = getClone({
			answerMode: `answerMode.${answerMode}`,
		});

		if (answerMode === "showOnMap") {
			clone.querySelector<HTMLInputElement>("input[type=radio]").checked = true;
		}

		answerModeSelect.append(clone);
	}

	return {
		get _() {
			return anserModes.find(
				(...[, i]) => answerModeSelect.children[i].querySelector<HTMLInputElement>(
					"input[type=radio]"
				).checked
			);
		}
	};
})();

(async () => {
	document.body.setAttribute("_game-state", "start");
	document.querySelector("[_action=startQuiz]").addEventListener(
		"click", async (evt: MouseEvent) => {
			document.body.setAttribute("_game-state", "game");

			game(await dataPromise, {
				continents: [...selectedContinents._],
				questionMode: selectedQuestionMode._,
				answerMode: selectedAnswerMode._,
				language: getLanguage(),
			});
		}
	);

	const dataPromise: Promise<CountriesData> = (async () => await (
		await window.fetch("./_/data.min.json")
	).json())();
})();

