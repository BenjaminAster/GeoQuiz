
import {
	getTemplateCloner,
	getLanguage,
	storage,
} from "./utils.js";

import type { CountriesData } from "./game.js";

import game, {
	stopGame,
} from "./game.js";

const continents: string[] = [
	"africa",
	"northAmerica",
	"southAmerica",
	"asia",
	"europe",
	"oceania",
];

const startQuizButton: HTMLButtonElement = document.querySelector("[_action=startQuiz]")

const selectedContinents: { _: string[] } = (() => {
	const continentsContainer: HTMLElement = document.querySelector("continents");

	const continentSelect: HTMLElement = continentsContainer.querySelector("options-select");
	const getClone = getTemplateCloner(continentSelect);

	const initialContinents: string[] = storage.get("continents")?.filter?.(
		(continent: string) => continents.includes(continent)
	) ?? continents;

	const checkboxSelectAll: HTMLInputElement = document.querySelector(
		"continents [_action=selectAll]"
	);

	checkboxSelectAll.checked = (initialContinents.length === continents.length);
	continentsContainer.classList.toggle("all-selected", checkboxSelectAll.checked);

	const continentsGetter = {
		get _() {
			return checkboxSelectAll.checked ? continents : continents.filter(
				(...[, i]) => continentSelect.children[i + 1].querySelector<HTMLInputElement>(
					"input[type=checkbox]"
				)?.checked
			);
		}
	};

	for (const continent of continents) {
		const clone: DocumentFragment = getClone({
			continentName: `continents.${continent}`,
		});

		let checkbox: HTMLInputElement = clone.querySelector("input[type=checkbox]");

		checkbox.checked = (initialContinents.includes(continent) && !checkboxSelectAll.checked);

		checkbox.addEventListener("change", (event: InputEvent) => {
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

			if (continentsGetter._.length === 0) {
				startQuizButton.disabled = true;
			} else {
				startQuizButton.disabled = false;
			}
		});

		continentSelect.append(clone);
	}

	checkboxSelectAll.addEventListener("change", () => {
		continentsContainer.classList.toggle("all-selected", checkboxSelectAll.checked);

		if (continentsGetter._.length === 0) {
			startQuizButton.disabled = true;
		} else {
			startQuizButton.disabled = false;
		}
	});

	return continentsGetter;
})();

let selectedQuestionMode: { _: string } = (() => {
	const questionModeSelect: HTMLElement = document.querySelector("question-mode options-select");
	const getClone = getTemplateCloner(questionModeSelect);

	const questionModes: string[] = [
		"countryName",
		"countryNameAndFlag",
		"flag",
		"capital",
	];

	const initialQuestionMode: string = questionModes.includes(
		storage.get("questionMode")
	) ? storage.get("questionMode") : questionModes[1];

	for (const questionMode of questionModes) {
		const clone: DocumentFragment = getClone({
			questionMode: `questionMode.${questionMode}`,
		});

		if (questionMode === initialQuestionMode) {
			clone.querySelector<HTMLInputElement>("input[type=radio]").checked = true;
		}

		questionModeSelect.append(clone);
	}

	return {
		get _() {
			return questionModes.find(
				(...[, i]) => questionModeSelect.children[i + 1].querySelector<HTMLInputElement>(
					"input[type=radio]"
				)?.checked
			);
		}
	};
})();

let selectedAnswerMode: { _: string } = (() => {
	const answerModeSelect: HTMLElement = document.querySelector("answer-mode options-select");
	const getClone = getTemplateCloner(answerModeSelect);

	const answerModes: string[] = [
		"showOnMap",
		"showCapitalOnMap",
	];

	const initialAnswerMode: string = answerModes.includes(
		storage.get("answerMode")
	) ? storage.get("answerMode") : answerModes[0];

	for (const answerMode of answerModes) {
		const clone = getClone({
			answerMode: `answerMode.${answerMode}`,
		});

		if (answerMode === initialAnswerMode) {
			clone.querySelector<HTMLInputElement>("input[type=radio]").checked = true;
		}

		answerModeSelect.append(clone);
	}

	return {
		get _() {
			return answerModes.find(
				(...[, i]) => answerModeSelect.children[i + 1].querySelector<HTMLInputElement>(
					"input[type=radio]"
				)?.checked
			);
		}
	};
})();

{
	const dataPromise: Promise<CountriesData> = (async () => await (
		await window.fetch("./_/data.min.json")
	).json())();

	const startGame = async () => {
		const continents: string[] = selectedContinents._;
		const questionMode: string = selectedQuestionMode._;
		const answerMode: string = selectedAnswerMode._;

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

	window.addEventListener("popstate", (event: PopStateEvent) => {
		if (event.state?.page === "game") {
			startGame();
		} else {
			document.body.setAttribute("_game-state", "start");
			stopGame();
		}
	});

	if (history.state?.page === "game") {
		startGame();
	} else {
		document.body.setAttribute("_game-state", "start");
	}

	document.querySelector("[_action=startQuiz]").addEventListener(
		"click", async () => {
			await startGame();
			history.pushState({ page: "game" }, document.title, "./");
		}
	);
}

