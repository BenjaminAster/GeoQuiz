
import { initWorldMap } from "./worldMap.js";

export type CountriesData = {
	name: Record<string, string>,
	capital: Record<string, string>,
	continent: string,
	flagSVG: string,
	coordinates: [number, number][][],
}[];

export default async (data: CountriesData, settings: {
	continents: string[],
	questionMode: string,
	answerMode: string,
}) => {
	initWorldMap(data);
};
