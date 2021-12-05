
import initWorldMap, { awaitCountryClick, markCountry } from "./worldMap.js";

export type CountriesData = {
	name: Record<string, string>,
	capital: Record<string, string>,
	continent: string,
	flagSVG: string,
	coordinates: [number, number][][],
}[];

export const enclaves: string[] = [
	"Lesotho",
	"San Marino",
	"Vatican City",
];

export const countriesWithEnclaves: string[] = [
	"South Africa",
	"Italy",
];

export default async (data: CountriesData, settings: {
	continents: string[],
	questionMode: string,
	answerMode: string,
	language: string,
}) => {
	initWorldMap(data);

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const countries: CountriesData = shuffleArray(
		data.filter(
			({ continent }) => settings.continents.includes(continent)
		)
	);


	for (const country of countries) {

		const whatToShow: Record<string, boolean> = (() => {
			switch (settings.questionMode) {
				case ("countryName"): return { countryName: true };
				case ("flag"): return { flag: true };
				case ("countryNameAndFlag"): return { countryName: true, flag: true };
			}
		})();

		if (whatToShow.countryName) {
			document.querySelector("game country").textContent = country.name[settings.language];
		}

		let flagBlobURI: string;

		if (whatToShow.flag) {
			flagBlobURI = URL.createObjectURL(new Blob([country.flagSVG], { type: "image/svg+xml" }));

			(document.querySelector("game flag") as HTMLElement).style.backgroundImage = (
				`url("${flagBlobURI}")`
			);
		}

		(document.querySelector("game after-canvas") as HTMLElement).hidden = true;

		if (country.name.en === await awaitCountryClick()) {
			markCountry(country.name.en, true);
		} else {
			markCountry(country.name.en, false);
		}

		URL.revokeObjectURL(flagBlobURI);
	}
};
