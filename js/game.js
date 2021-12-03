import { getTemplateCloner } from "./languages.js";
let selectedContinents = (() => {
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
	let allSelected = false;
	let selectedContinents = {
		__: new Set(),
		get _() {
			if (allSelected) {
				return new Set(continents);
			}
			return this.__;
		},
		set _(value) {
			this.__ = value;
		},
	};
	const checkboxSelectAll = document.querySelector("continents [data-action=selectAll]");
	for (const continent of continents) {
		const clone = getClone({
			continentName: `continents.${continent}`,
		});
		let button = clone.firstElementChild;
		button.addEventListener("click", (evt) => {
			button.classList.toggle("selected");
			if (allSelected) {
				allSelected = false;
				selectedContinents._ = new Set(continents);
				continentsContainer.classList.remove("all-selected");
				checkboxSelectAll.checked = false;
			}
			selectedContinents._.has(continent) ? (selectedContinents._.delete(continent)) : selectedContinents._.add(continent);
			if (selectedContinents._.size === continents.length) {
				selectedContinents._.delete(continent);
				allSelected = true;
				continentsContainer.classList.add("all-selected");
				checkboxSelectAll.checked = true;
			}
		});
		continentSelect.append(clone);
	}
	checkboxSelectAll.addEventListener("input", (evt) => {
		allSelected = evt.target.checked;
		continentsContainer.classList.toggle("all-selected");
		for (const [i, continent] of continents.entries()) {
			if (allSelected) {
				continentSelect.children[i].classList.add("selected");
			}
			else {
				if (!selectedContinents._.has(continent)) {
					continentSelect.children[i].classList.remove("selected");
				}
			}
		}
	});
	return selectedContinents;
})();
let selectedQuestionMode = (() => {
	const questionModeSelect = document.querySelector("question-mode options-select");
	const getClone = getTemplateCloner(questionModeSelect);
	const questionModes = [
		"countryName",
		"countryNameAndFlag",
		"flag",
	];
	let selectedQuestionMode = {
		__: questionModes[0],
		get _() {
			return this.__;
		},
		set _(value) {
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
		button.addEventListener("click", (evt) => {
			questionModeSelect.querySelector(".selected")?.classList.remove("selected");
			button.classList.add("selected");
			selectedQuestionMode._ = questionMode;
		});
		questionModeSelect.append(clone);
	}
	return selectedQuestionMode;
})();
let selectedAnswerMode = (() => {
	const answerModeSelect = document.querySelector("answer-mode options-select");
	const getClone = getTemplateCloner(answerModeSelect);
	const anserModes = [
		"showOnMap",
	];
	let selectedAnswerMode = {
		__: anserModes[0],
		get _() {
			return this.__;
		},
		set _(value) {
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
		button.addEventListener("click", (evt) => {
			answerModeSelect.querySelector(".selected")?.classList.remove("selected");
			button.classList.add("selected");
			selectedAnswerMode._ = answerMode;
		});
		answerModeSelect.append(clone);
	}
	return selectedAnswerMode;
})();
{
	document.querySelector("main").setAttribute("data-game-state", "start");
	document.querySelector("[data-action=startQuiz]").addEventListener("click", (evt) => {
		document.querySelector("start-screen").hidden = true;
		document.querySelector("game").hidden = false;
	});
}
//# sourceMappingURL=game.js.map