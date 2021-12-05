
import initWorldMap from "./worldMap.js";

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
}) => {
	initWorldMap(data);
};
