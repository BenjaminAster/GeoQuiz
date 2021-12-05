
import {
	getTemplateCloner,
	getLanguage,
} from "./languages.js";

import game, { CountriesData } from "./game.js";

let selectedContinents: { _: Set<string> } = (() => {
	// continents:

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

	let allSelected: boolean = true;
	continentsContainer.classList.toggle("all-selected", allSelected);

	let selectedContinents = {
		__: new Set(),
		get _() {
			if (allSelected) {
				return new Set(continents);
			}
			return this.__;
		},
		set _(value: Set<string>) {
			this.__ = value;
		},
	};

	const checkboxSelectAll: HTMLInputElement = document.querySelector(
		"continents [_action=selectAll]"
	);

	for (const continent of continents) {
		const clone = getClone({
			continentName: `continents.${continent}`,
		});

		let button = clone.firstElementChild;
		button.classList.add("selected");

		button.addEventListener("click", (evt: MouseEvent) => {
			button.classList.toggle("selected");
			if (allSelected) {
				allSelected = false;
				selectedContinents._ = new Set(continents);
				continentsContainer.classList.remove("all-selected");
				checkboxSelectAll.checked = false;
			}
			selectedContinents._.has(continent) ? (
				selectedContinents._.delete(continent)
			) : selectedContinents._.add(continent);

			if (selectedContinents._.size === continents.length) {
				selectedContinents._.delete(continent);
				allSelected = true;
				continentsContainer.classList.add("all-selected");
				checkboxSelectAll.checked = true;
			}
		});

		continentSelect.append(clone);
	}

	checkboxSelectAll.addEventListener("input", (evt: InputEvent) => {
		allSelected = (evt.target as HTMLInputElement).checked;

		continentsContainer.classList.toggle("all-selected");

		for (const [i, continent] of continents.entries()) {
			if (allSelected) {
				continentSelect.children[i].classList.add("selected");
			} else {
				if (!selectedContinents._.has(continent)) {
					continentSelect.children[i].classList.remove("selected");
				}
			}
		}
	});

	return selectedContinents;
})();


let selectedQuestionMode: { _: string } = (() => {
	// question mode:

	const questionModeSelect: HTMLElement = document.querySelector("question-mode options-select");
	const getClone = getTemplateCloner(questionModeSelect);

	const questionModes: string[] = [
		"countryName",
		"countryNameAndFlag",
		"flag",
	];

	let selectedQuestionMode = {
		__: questionModes[1],
		get _() {
			return this.__;
		},
		set _(value: string) {
			this.__ = value;
		},
	};

	for (const questionMode of questionModes) {
		const clone = getClone({
			questionMode: `questionMode.${questionMode}`,
		});

		let button = clone.firstElementChild;
		if (questionMode === selectedQuestionMode._) {
			button.classList.add("selected");
		}

		button.addEventListener("click", (evt: MouseEvent) => {
			questionModeSelect.querySelector(".selected")?.classList.remove("selected");
			button.classList.add("selected");
			selectedQuestionMode._ = questionMode;
		});

		questionModeSelect.append(clone);
	}

	return selectedQuestionMode;
})();



let selectedAnswerMode: { _: string } = (() => {
	// question mode:

	const answerModeSelect: HTMLElement = document.querySelector("answer-mode options-select");
	const getClone = getTemplateCloner(answerModeSelect);

	const anserModes: string[] = [
		"showOnMap",
		// "typeName",
	];

	let selectedAnswerMode = {
		__: anserModes[0],
		get _() {
			return this.__;
		},
		set _(value: string) {
			this.__ = value;
		},
	};

	for (const answerMode of anserModes) {
		const clone = getClone({
			answerMode: `answerMode.${answerMode}`,
		});

		let button = clone.firstElementChild;
		if (answerMode === selectedAnswerMode._) {
			button.classList.add("selected");
		}

		button.addEventListener("click", (evt: MouseEvent) => {
			answerModeSelect.querySelector(".selected")?.classList.remove("selected");
			button.classList.add("selected");
			selectedAnswerMode._ = answerMode;
		});

		answerModeSelect.append(clone);
	}

	return selectedAnswerMode;
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
		await window.fetch("./data/data.min.json")
	).json())();
})();
