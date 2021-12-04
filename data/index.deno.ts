
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

/*

// no South Sudan:
https://laprovence.carto.com/tables/world_country_borders_kml/public/map

// 23 MB:
https://datahub.io/core/geo-countries

// No Tuvalu:
https://geojson-maps.ash.ms/

// No Tuvalu:
https://exploratory.io/map

// 12 MB:
https://rtr.carto.com/tables/world_countries_geojson/public/map

// No Vatican City:
https://github.com/simonepri/geo-maps/blob/master/info/countries-land.md

// Too small:
https://www.highcharts.com/docs/maps/map-collection

*/


(async () => {
	// Scrape data from Wikipedia:

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

	await Deno.writeTextFile("./wikipedia-data.json", JSON.stringify(countries, null, "\t"));
});

(async () => {
	// Generate JSON file:

	const borders = JSON.parse(await Deno.readTextFile(
		"./geojson-maps.ash.ms/world-medium.geo.json"
	));
	const data = JSON.parse(await Deno.readTextFile("./wikipedia-data.json"));

	const nameDifferences: Record<string, string> = {
		"Danish Realm": "Denmark",
		"The Gambia": "Gambia",
		"Georgia (country)": "Georgia",
		"Guinea-Bissau": "Guinea Bissau",
		"Republic of Ireland": "Ireland",
		"Kingdom of the Netherlands": "Netherlands",
		"North Macedonia": "Macedonia",
		"Serbia": "Republic of Serbia",
		"Republic of the Congo": "Republic of Congo",
		"São Tomé and Príncipe": "Sao Tome and Principe",
		"Eswatini": "Swaziland",
		"Tanzania": "United Republic of Tanzania",
		"United States": "United States of America",
		"Vatican City": "Vatican",
		"Sahrawi Arab Democratic Republic": "Western Sahara",
	};

	const newData: any[] = [];

	for (const country of data) {
		const countryName: string = country.name.en;

		const differentCountryName: string = nameDifferences[countryName] ?? countryName;

		const geoJSONCountries = borders.features.filter(({ properties: { sovereignt } }: any) => (
			sovereignt.trim() === differentCountryName
		));

		const geoJSONSovereignt = geoJSONCountries.find(
			({ properties: { admin, sovereignt } }: any) => (
				admin === sovereignt
			)
		);

		if (!geoJSONCountries.length) {
			continue;
		}

		newData.push({
			name: country.name,
			capital: country.capital,
			flagSVG: country.flagSVG,
			continent: geoJSONSovereignt.properties.continent.replace(
				/(^.)|(\s)/g, (($: string) => $.toLowerCase().trim())
			),
			coordinates: [].concat(...geoJSONCountries.map(
				({ geometry: { type, coordinates } }: any) => {
					switch (type) {
						case ("Polygon"): return coordinates;
						case ("MultiPolygon"): return [].concat(...coordinates);
					}
				}
			)),
		});
	}

	await Deno.writeTextFile("./data.json", JSON.stringify(newData, null, "\t"));
	await Deno.writeTextFile("./data.min.json", JSON.stringify(newData));
})();

