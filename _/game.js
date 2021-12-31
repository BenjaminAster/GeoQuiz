import initWorldMap, { newGame, awaitCountryClick, markCountry, stopDrawing, } from "./worldMap.js";
import { getTemplateCloner, } from "./utils.js";
import translations from "./translations.js";
let firstGamePlayed = false;
let running = false;
const beforeCanvasEl = document.querySelector("game before-canvas");
let onNewGame;
beforeCanvasEl.querySelector("back-arrow button").addEventListener("click", () => {
	running = false;
	stopGame();
	history.back();
});
beforeCanvasEl.querySelector("restart button").addEventListener("click", () => {
	running = false;
	stopGame();
	onNewGame?.();
});
document.querySelector("end-screen [_action=restartQuiz]").addEventListener("click", () => {
	onNewGame?.();
});
document.querySelector("end-screen [_action=backToStartScreen]").addEventListener("click", () => {
	history.back();
});
const game = async (data, settings) => {
	document.body.setAttribute("_game-state", "game");
	document.querySelector("game after-canvas").style.display = "none";
	newGame();
	if (!firstGamePlayed) {
		initWorldMap(data);
		firstGamePlayed = true;
	}
	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};
	const countries = shuffleArray(data.filter(({ continent }) => settings.continents.includes(continent)));
	let correctCountries = 0;
	const whatToShow = (() => {
		switch (settings.questionMode) {
			case ("countryName"): return { countryName: true };
			case ("flag"): return { flag: true };
			case ("countryNameAndFlag"): return { countryName: true, flag: true };
		}
	})();
	beforeCanvasEl.querySelector("flag").hidden = !whatToShow.flag;
	beforeCanvasEl.querySelector("country").hidden = !whatToShow.countryName;
	running = true;
	onNewGame = () => {
		requestAnimationFrame(() => {
			game(data, settings);
		});
	};
	for (const [i, country] of countries.entries()) {
		if (!running)
			return;
		beforeCanvasEl.querySelector("remaining").textContent = (countries.length - i).toString();
		beforeCanvasEl.querySelector("percentage").textContent = Math.floor(correctCountries / countries.length * 100).toString();
		beforeCanvasEl.querySelector("correct").textContent = correctCountries.toString();
		beforeCanvasEl.querySelector("incorrect").textContent = (i - correctCountries).toString();
		if (whatToShow.countryName) {
			document.querySelector("game country").textContent = country.name[settings.language];
		}
		let flagBlobURI;
		if (whatToShow.flag) {
			flagBlobURI = URL.createObjectURL(new Blob([country.flagSVG], { type: "image/svg+xml" }));
			document.querySelector("game flag").style.backgroundImage = (`url("${flagBlobURI}")`);
		}
		if (country.name.en === await awaitCountryClick()) {
			markCountry(country.name.en, true);
			correctCountries++;
		}
		else if (running) {
			markCountry(country.name.en, false);
		}
		URL.revokeObjectURL(flagBlobURI);
	}
	stopDrawing();
	document.body.setAttribute("_game-state", "end");
	{
		document.querySelector("end-screen correct").textContent = correctCountries.toString();
		document.querySelector("end-screen total").textContent = countries.length.toString();
		document.querySelector("end-screen incorrect").textContent = (countries.length - correctCountries).toString();
		const fraction = correctCountries / countries.length;
		document.querySelector("end-screen percentage").textContent = Math.floor(fraction * 100).toString();
		document.querySelector("end-screen percentage").setAttribute("data-evaluation", ((fraction > .9) ? "good" : (fraction > .7) ? "medium" : "bad"));
		{
			const continentsContainer = document.querySelector("end-screen continents");
			const getClone = getTemplateCloner(continentsContainer);
			continentsContainer.querySelectorAll(":scope > :not(template)").forEach((element) => element.remove());
			for (const [i, continent] of settings.continents.entries()) {
				const clone = getClone({
					conjunction: i ? ((i < settings.continents.length - 1) ? "endScreen.comma" : "endScreen.and") : null,
					continent: "continents." + continent,
				});
				continentsContainer.append(clone);
			}
		}
		document.querySelector("end-screen question-mode").textContent = (translations.endScreen.questionModes[settings.questionMode][settings.language]);
		document.querySelector("end-screen answer-mode").textContent = (translations.endScreen.answerModes[settings.answerMode][settings.language]);
	}
};
export default game;
export const stopGame = () => {
	stopDrawing();
};
//# sourceMappingURL=game.js.map