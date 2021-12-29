import initWorldMap, { awaitCountryClick, markCountry } from "./worldMap.js";
export const enclaves = [
	"Lesotho",
	"San Marino",
	"Vatican City",
];
export const countriesWithEnclaves = [
	"South Africa",
	"Italy",
];
export default async (data, settings) => {
	document.querySelector("game after-canvas").style.display = "none";
	initWorldMap(data);
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	const countries = shuffleArray(data.filter(({ continent }) => settings.continents.includes(continent)));
	let correctCountries = 0;
	const beforeCanvasEl = document.querySelector("game before-canvas");
	for (const [i, country] of countries.entries()) {
		beforeCanvasEl.querySelector("remaining").textContent = (countries.length - i).toString();
		beforeCanvasEl.querySelector("percentage").textContent = Math.floor(correctCountries / countries.length * 100).toString() + "%";
		const whatToShow = (() => {
			switch (settings.questionMode) {
				case ("countryName"): return { countryName: true };
				case ("flag"): return { flag: true };
				case ("countryNameAndFlag"): return { countryName: true, flag: true };
			}
		})();
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
		else {
			markCountry(country.name.en, false);
		}
		beforeCanvasEl.querySelector("correct").textContent = correctCountries.toString();
		beforeCanvasEl.querySelector("incorrect").textContent = (i + 1 - correctCountries).toString();
		URL.revokeObjectURL(flagBlobURI);
	}
};
//# sourceMappingURL=game.js.map