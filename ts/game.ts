
import {
	getTemplateCloner
} from "./languages.js";


{
	// continents:

	const continentsContainer: HTMLElement = document.querySelector("continents");

	const continentSelect: HTMLElement = document.querySelector("continent-select");
	const getClone = getTemplateCloner(continentSelect);

	const continents: string[] = [
		"africa",
		"northAmerica",
		"southAmerica",
		"asia",
		"europe",
		"oceania",
	];

	let allSelected: boolean = false;

	let selectedContinents = {
		__: new Set(),
		get _() {
			if (allSelected) {
				return new Set(continents);
			}
			return this.__;
		},
		set _(value: Set<string>) {
			this.__ = value;
		},
	};

	const checkboxSelectAll: HTMLInputElement = document.querySelector(
		"continents [data-action=selectAll]"
	);

	for (const continent of continents) {
		const clone = getClone({
			continentName: `continents.${continent}`,
		});

		let button = clone.firstElementChild;

		button.addEventListener("click", (evt: MouseEvent) => {
			button.classList.toggle("selected");
			if (allSelected) {
				allSelected = false;
				selectedContinents._ = new Set(continents);
				continentsContainer.classList.remove("all-selected");
				checkboxSelectAll.checked = false;
			}
			selectedContinents._.has(continent) ? (
				selectedContinents._.delete(continent)
			) : selectedContinents._.add(continent);

			if (selectedContinents._.size === continents.length) {
				selectedContinents._.delete(continent);
				allSelected = true;
				continentsContainer.classList.add("all-selected");
				checkboxSelectAll.checked = true;
			}
		});

		continentSelect.append(clone);
	}

	checkboxSelectAll.addEventListener("input", (evt: InputEvent) => {
		allSelected = (evt.target as HTMLInputElement).checked;

		continentsContainer.classList.toggle("all-selected");

		for (const [i, continent] of continents.entries()) {
			if (allSelected) {
				continentSelect.children[i].classList.add("selected");
			} else {
				if (!selectedContinents._.has(continent)) {
					continentSelect.children[i].classList.remove("selected");
				}
			}
		}
	});
}

{
	
}

