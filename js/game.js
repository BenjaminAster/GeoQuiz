import initWorldMap, { awaitCountryClick } from "./worldMap.js";
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
	console.log(await awaitCountryClick());
};
//# sourceMappingURL=game.js.map