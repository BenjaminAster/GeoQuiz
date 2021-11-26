
import {
	DOMParser,
	HTMLDocument,
	Element,
	Node,
} from "https://deno.land/x/deno_dom@v0.1.15-alpha/deno-dom-wasm.ts";

/* 

deno run --unstable --allow-net --allow-read --allow-write=. index.deno.ts

*/

/* 
https://laprovence.carto.com/tables/world_country_borders_kml/public/map
 */

(async () => {
	// let data: Record<string, any> = JSON.parse(await Deno.readTextFile("./data.json"));
	let data: Record<string, any> = {};

	const wikipediaCountryList = await (await globalThis.fetch(`https://en.wikipedia.org/wiki/List_of_sovereign_states`)).text();

	const parser: DOMParser = new DOMParser();

	let countries = ((): Record<string, any>[] => {
		const document: HTMLDocument = parser.parseFromString(wikipediaCountryList, "text/html") as HTMLDocument;

		const tbody: Element = document.querySelector("table.wikitable tbody") as Element;

		const rows: Element[] = ([...tbody.querySelectorAll("tr")] as Element[]).filter(
			(row: Element, index: number) => row.children.length > 1 && index > 3
		);

		let countries: Record<string, any>[] = [];

		for (const row of rows) {
			const link: Element = row.querySelector("td:first-of-type b a") as Element;

			// console.log(row.innerHTML);

			const countryName: string = link?.textContent;
			const wikipediaURLName: string = link?.getAttribute("href")?.replace(/^\/wiki\//, "") as string;

			if (!countryName || !wikipediaURLName) {
				continue;
			}

			countries.push({
				countryName,
				wikipediaURLName,
			});
		}

		return countries;
	})();

	// countries = countries.slice(0, 3);

	countries = await Promise.all(
		countries.map(async (country: Record<string, any>): Promise<Record<string, any>> => {

			const wikipediaURLName: string = country.wikipediaURLName;

			const wikipediaURL: string = `https://en.wikipedia.org/wiki/${country.wikipediaURLName}`;

			const pageHTML: string = await (await globalThis.fetch(wikipediaURL)).text();

			const document: HTMLDocument = parser.parseFromString(pageHTML, "text/html") as HTMLDocument;

			const countryName = document.querySelector("h1#firstHeading")?.textContent;

			const tbody: Element = document.querySelector("table.infobox tbody") as Element;

			const rows: Element[] = ([...tbody.querySelectorAll("tr")] as Element[]);

			const flagFilePageURL: string = rows.find(
				(row: Element) => row?.textContent?.match(/\bFlag\b/)
			)?.querySelector("td a")?.getAttribute("href")?.replace(/^\/wiki\//, "") as string;

			const flagImageURL: string = `https:${parser.parseFromString(
				await (await globalThis.fetch(`https://en.wikipedia.org/wiki/${flagFilePageURL}`)).text(), "text/html"
			)?.querySelector("#file a")?.getAttribute("href") as string}`;

			const originalFlagSVG: string = await (await globalThis.fetch(flagImageURL)).text();

			const flagSVG: string = (
				await (await globalThis.fetch(flagImageURL)).text()
			)?.replaceAll(/[\r\n\t]/g, "").match(/\<svg .*\<\/svg\>/)?.[0] as string;

			const [capital, capitalWikipediaURLName] = ((): [string, string] => {
				const link: Element = rows.find(
					(row: Element) => row?.textContent?.match(/Capital/)
				)?.querySelector("td a") as Element;
				return [link?.textContent, link?.getAttribute("href")?.replace(/^\/wiki\//, "") as string];
			})();

			const returnObject = {
				countryName,
				wikipediaURLName,
				flagFilePageURL,
				flagImageURL,
				flagSVG,
				capital,
				capitalWikipediaURLName,
			};

			if (Object.keys(returnObject).length !== 7) {
				throw new Error(countryName);
			}

			console.log(countryName);

			return returnObject;
		})
	);

	data.countries = countries;

	await Deno.writeTextFile("./data.json", JSON.stringify(data, null, "\t"));
})();
