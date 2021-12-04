
import {
	DOMParser,
	HTMLDocument,
	Element,
	NodeList,
	Node,
} from "https://deno.land/x/deno_dom@v0.1.15-alpha/deno-dom-wasm.ts";

/* 

deno run --unstable --allow-net --allow-read --allow-write=. index.deno.ts

*/

// https://laprovence.carto.com/tables/world_country_borders_kml/public/map

(async () => {
	// let data: Record<string, any> = JSON.parse(await Deno.readTextFile("./data.json"));
	// let data: Record<string, any> = {};

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

	// countries = countries.slice(0, 3); // for testing

	let finishedCountries: number = 0;

	countries = await Promise.all(
		countries.map(async (country: Record<string, any>): Promise<Record<string, any>> => {

			const wikipediaURLName: string = country.wikipediaURLName;

			const wikipediaURL: string = `https://en.wikipedia.org/wiki/${country.wikipediaURLName}`;

			const pageHTML: string = await (await globalThis.fetch(wikipediaURL)).text();

			const document: HTMLDocument = parser.parseFromString(pageHTML, "text/html") as HTMLDocument;

			const countryName = document.querySelector("h1#firstHeading")?.textContent;

			const countryNameGerman = ([...document.querySelectorAll("nav#p-lang ul li") as NodeList] as Element[])?.find(
				(li: Element) => li.textContent.trim() === "Deutsch"
			)?.querySelector("a")?.getAttribute("title")?.trim()?.replace(/ – German$/, "");

			const tbody: Element = document.querySelector("table.infobox tbody") as Element;

			const rows: Element[] = ([...tbody.querySelectorAll("tr")] as Element[]);

			const flagFilePageURL: string = rows.find(
				(row: Element) => row?.textContent?.match(/\bFlag\b/)
			)?.querySelector("td a")?.getAttribute("href")?.replace(/^\/wiki\//, "") as string;

			const flagImageURL: string = `https:${parser.parseFromString(
				await (await globalThis.fetch(`https://en.wikipedia.org/wiki/${flagFilePageURL}`)).text(), "text/html"
			)?.querySelector("#file a")?.getAttribute("href") as string}`;

			const originalFlagSVG: string = await (await globalThis.fetch(flagImageURL)).text();

			const flagSVG: string = originalFlagSVG?.replaceAll(/[\r\n]/g, "").replaceAll(/[\t]/g, " ").match(
				/\<svg\b.*\<\/svg\>/
			)?.[0] as string;

			const cityStates: string[] = [ // don't have a 'capital' field on Wikipedia
				"Vatican City",
				"Singapore",
			];

			const [capital, capitalWikipediaURLName] = ((): [string, string] => {
				if (cityStates.includes(countryName as string)) {
					return [countryName as string, wikipediaURLName];
				}
				const link: Element = rows.find(
					(row: Element) => row?.textContent?.toLowerCase().match(/capital/)
				)?.querySelector(`td a:not([class="image"])`) as Element;
				return [link?.textContent, link?.getAttribute("href")?.replace(/^\/wiki\//, "") as string];
			})();

			const capitalGerman = ([...parser.parseFromString(await (await globalThis.fetch(
				`https://en.wikipedia.org/wiki/${capitalWikipediaURLName}`
			)).text(), "text/html")?.querySelectorAll("nav#p-lang ul li") as NodeList] as Element[])?.find(
				(li: Element) => li.textContent.trim() === "Deutsch"
			)?.querySelector("a")?.getAttribute("title")?.trim()?.replace(/ – German$/, "");

			const returnObject = {
				name: {
					en: countryName,
					de: countryNameGerman,
				},
				wikipediaURLName,
				flagFilePageURL,
				flagImageURL,
				capital: {
					en: capital,
					de: capitalGerman,
				},
				capitalWikipediaURLName,
				flagSVG,
			};

			console.log(returnObject);

			if (Object.keys(returnObject).length !== Object.keys(JSON.parse(JSON.stringify(returnObject))).length) {
				throw new Error(countryName);
			}

			finishedCountries++;

			console.log(`${countryName} (${finishedCountries}/${countries.length})`);

			return returnObject;
		})
	);

	// data.countries = countries;

	await Deno.writeTextFile("./data.json", JSON.stringify(countries, null, "\t"));
	await Deno.writeTextFile("./data.min.json", JSON.stringify(countries));
});

(async () => {
	const borders = JSON.parse(await Deno.readTextFile("./countries-datahub.geo.json"));
	const data = JSON.parse(await Deno.readTextFile("./data.json"));

	// console.log(data);

	// const borderCountries: string[] = borders.features.map(({ properties: { name } }: any) => name.trim()).sort();
	const borderCountries: string[] = borders.features.map(({ properties: { ADMIN } }: any) => ADMIN.trim()).sort();
	const dataCountries: string[] = data.map(({ name: { en } }: any) => en.trim()).sort();

	const inBoth: string[] = borderCountries.filter((country: string) => dataCountries.includes(country));
	const onlyInBorders: string[] = borderCountries.filter((country: string) => !dataCountries.includes(country));
	const onlyInData: string[] = dataCountries.filter((country: string) => !borderCountries.includes(country));

	const nameDifferences: Record<string, string> = {
		"Bosnia and Herzegovina": "Bosnia and Herzegovina",
		"Danish Realm": "Denmark",
		"Democratic Republic of the Congo": "Democratic Republic of Congo",
		"Eswatini": "Swaziland",
		"Federated States of Micronesia": "Micronesia",
		"Georgia (Country)": "Georgia",
		"Ivory Coast": "Cote d'Ivoire",
		"Kingdom of the Netherlands": "Netherlands",
		"Myanmar": "Burma",
		"North Macedonia": "Macedonia",
		"Republic of Ireland": "Ireland",
		"Sahrawi Arab Democratic Republic": "Western Sahara",
	};

	await Deno.writeTextFile("./borders-data-diff.json", JSON.stringify({ inBoth, onlyInBorders, onlyInData }, null, "\t"));

})();

