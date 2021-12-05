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
	initWorldMap(data);
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	const countries = shuffleArray(data.filter(({ continent }) => settings.continents.includes(continent)));
	for (const country of countries) {
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
		document.querySelector("game after-canvas").style.display = "none";
		if (country.name.en === await awaitCountryClick()) {
			markCountry(country.name.en, true);
		}
		else {
			markCountry(country.name.en, false);
		}
		URL.revokeObjectURL(flagBlobURI);
	}
};
//# sourceMappingURL=game.js.map