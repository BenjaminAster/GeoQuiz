
import {
	getTemplateCloner
} from "./languages.js";

import worldMap from "./worldMap.js";

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

	let allSelected: boolean = false;

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
		"continents [data-action=selectAll]"
	);

	for (const continent of continents) {
		const clone = getClone({
			continentName: `continents.${continent}`,
		});

		let button = clone.firstElementChild;

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
		__: questionModes[0],
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

{
	document.querySelector("main").setAttribute("data-game-state", "start");
	document.querySelector("[data-action=startQuiz]").addEventListener(
		"click", (evt: MouseEvent) => {
			document.querySelector("main").setAttribute("data-game-state", "game");

			worldMap();

			document.addEventListener("touchmove", (evt) => {
				if (evt.touches.length > 1) {
					evt.preventDefault();
				}
			}, { passive: false });

			// window.addEventListener("abort", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("animationcancel", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("animationend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("animationiteration", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("animationstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("auxclick", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("beforeinput", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("blur", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("canplay", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("canplaythrough", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("change", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("click", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("close", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("compositionend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("compositionstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("compositionupdate", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("contextmenu", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("cuechange", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("dblclick", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("drag", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("dragend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("dragenter", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("dragleave", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("dragover", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("dragstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("drop", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("durationchange", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("emptied", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("ended", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("error", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("focus", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("focusin", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("focusout", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("formdata", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("gotpointercapture", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("input", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("invalid", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("keydown", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("keypress", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("keyup", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("load", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("loadeddata", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("loadedmetadata", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("loadstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("lostpointercapture", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("mousedown", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("mouseenter", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("mouseleave", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("mousemove", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("mouseout", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("mouseover", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("mouseup", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pause", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("play", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("playing", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointercancel", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointerdown", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointerenter", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointerleave", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointermove", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointerout", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointerover", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("pointerup", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("progress", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("ratechange", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("reset", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("resize", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("scroll", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("securitypolicyviolation", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("seeked", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("seeking", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("select", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("selectionchange", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("selectstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("stalled", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("submit", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("suspend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("timeupdate", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("toggle", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("touchcancel", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("touchend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("touchmove", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("touchstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("transitioncancel", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("transitionend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("transitionrun", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("transitionstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("volumechange", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("waiting", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("webkitanimationend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("webkitanimationiteration", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("webkitanimationstart", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("webkittransitionend", (evt) => {
			// 	evt.preventDefault();
			// });
			// window.addEventListener("wheel", (evt) => {
			// 	evt.preventDefault();
			// });
		}
	);
}
