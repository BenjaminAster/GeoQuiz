

import type { CountriesData } from "./game.js";

let data: CountriesData;

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("game canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: false });

let colors: Record<string, string>;

let mouseX: number;
let mouseY: number;

let centerX: number;
let centerY: number;
let zoom: number;
const scalePerZoom: number = 1.8;

let countryClicked: (name: string) => void;
let clicked: boolean;

let correctCountries: Set<string>;
let incorrectCountries: Set<string>;

let running: boolean;

let newGameCallback: Function;

let settings: Record<string, any>;

const resize = () => {
	if (running) {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	}
};


// const onNewGame = (callback: Function) => {
// 	newGameCallback = callback;
// };

// let _id: number;

export const newGame = (newSettings: Record<string, any>) => {
	mouseX = 0;
	mouseY = 0;

	centerX = 0;
	centerY = 0;
	zoom = 0;

	clicked = false;

	correctCountries = new Set<string>();
	incorrectCountries = new Set<string>();

	settings = newSettings;

	running = true;


	newGameCallback?.();

	resize();

	// _id = Math.random();
}

export default (countriesData: CountriesData) => {
	data = countriesData;

	const getColor = (color: string) => (
		window.getComputedStyle(document.documentElement).getPropertyValue(color)
	).trim();

	{
		const initColors = () => {
			colors = {
				background: getColor("--col-18"),
				foreground: getColor("--col-f"),
				gray: getColor("--col-3"),
				lightGray: getColor("--col-5"),
				green: getColor("--country-green"),
				red: getColor("--country-red"),
			};
		};
		initColors();
		window.addEventListener("color-scheme-set", initColors);
	}

	{
		resize();

		window.addEventListener("resize", resize);
	}

	{
		let prevX: number = -1;
		let prevY: number = -1;

		window.addEventListener("pointermove", (event: MouseEvent) => {
			if (prevX >= 0) {
				mouseX = event.pageX - canvas.parentElement.offsetLeft;
				mouseY = event.pageY - canvas.parentElement.offsetTop - (
					// @ts-ignore
					navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0
				);

				const dragMultiplier: number = 2;

				if (event.buttons === 1) {
					centerX -= dragMultiplier * ((event.pageX - prevX) / (canvas.width / 2)) / (
						(scalePerZoom ** zoom) / 180
					);
					centerY += dragMultiplier * ((event.pageY - prevY) / (canvas.height / 2)) / (
						(canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180
					);

					centerX = Math.min(Math.max(centerX, -180), 180);
					centerY = Math.min(Math.max(centerY, -90), 90);
				}
			}

			prevX = event.pageX;
			prevY = event.pageY;
		});
	}

	canvas.addEventListener("wheel", (event: WheelEvent) => {
		event.preventDefault();

		const x: number = event.pageX - canvas.parentElement.offsetLeft;
		const y: number = event.pageY - canvas.parentElement.offsetTop - (
			// @ts-ignore
			navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0
		);

		const pointX: number = ((x / (canvas.width / 2) - 1) / (
			(scalePerZoom ** zoom) / 180
		)) + centerX;
		const pointY: number = ((y / (canvas.height / 2) - 1) / (
			(canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180
		)) + centerY;

		let delta = Math.min(Math.max(event.deltaY * 5, -100), 100) / 100;
		zoom -= delta;

		if (zoom < 0) {
			delta += zoom;
			zoom = 0;
		}

		centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
		centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
	}, { passive: false });

	// canvas.addEventListener("wheel", (event: WheelEvent) => {
	// 	event.preventDefault();
	// });

	{
		const draw = () => {
			ctx.strokeStyle = colors.foreground;
			ctx.fillStyle = colors.background;
			ctx.lineWidth = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";

			ctx.fillRect(0, 0, canvas.width, canvas.height);

			{
				let hoveredCountry: string;

				for (const drawPolygons of [...(settings.capital ? [] : [false]), true]) {

					countryLoop: for (const country of (drawPolygons ? data : [...data].reverse())) {
						const coordinates: [number, number][][] = country.coordinates;

						const fillColor: string | boolean = (!settings.capital) && (
							correctCountries.has(country.name.en) ? colors.green : (
								incorrectCountries.has(country.name.en) ? colors.red : false
							)
						);

						for (const polygon of coordinates) {
							ctx.beginPath();
							for (const [x, y] of polygon) {
								ctx.lineTo(
									((x - centerX) *
										(scalePerZoom ** zoom) / 180 + 1
									) * canvas.width / 2,
									((y - centerY) * (canvas.width / canvas.height) *
										(scalePerZoom ** zoom) / -180 + 1
									) * canvas.height / 2,
								);
							}
							ctx.closePath();
							if (drawPolygons) {
								if (fillColor) {
									ctx.fillStyle = fillColor;
								} else if (hoveredCountry === country.name.en) {
									ctx.fillStyle = colors.foreground;
								} else {
									ctx.fillStyle = colors.gray;
								}
								ctx.fill();
								ctx.stroke();
							} else {
								if (ctx.isPointInPath(mouseX, mouseY)) {
									hoveredCountry = country.name.en;
									if (clicked) {
										if (
											!correctCountries.has(country.name.en)
											&&
											!incorrectCountries.has(country.name.en)
										) {
											countryClicked(country.name.en);
										}
										clicked = false;
									}
									break countryLoop;
								}
							}
						}
					}
				}
			}

			if (settings.capital) {
				const radius: number = 5 + zoom;

				const mousePointX: number = ((mouseX / (canvas.width / 2) - 1) / (
					(scalePerZoom ** zoom) / 180
				)) + centerX;
				const mousePointY: number = ((mouseY / (canvas.height / 2) - 1) / (
					(canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180
				)) + centerY;

				const radiusPoints: number = ((radius) / (canvas.width / 2)) / (
					(scalePerZoom ** zoom) / 180
				);

				let hoveredCapitalCountry: string;

				mouseHoverLoop: for (const country of [...data].reverse()) {
					if (Math.sqrt(
						(country.capitalCoordinates[1] - mousePointX) ** 2 +
						(country.capitalCoordinates[0] - mousePointY) ** 2
					) < radiusPoints) {
						hoveredCapitalCountry = country.name.en;

						if (clicked) {
							if (
								!correctCountries.has(country.name.en)
								&&
								!incorrectCountries.has(country.name.en)
							) {
								countryClicked(country.name.en);
							}
							clicked = false;
						}

						break mouseHoverLoop;
					}
				}

				for (const country of data) {

					ctx.beginPath();
					ctx.ellipse(
						((country.capitalCoordinates[1] - centerX) *
							(scalePerZoom ** zoom) / 180 + 1
						) * canvas.width / 2,
						((country.capitalCoordinates[0] - centerY) * (canvas.width / canvas.height) *
							(scalePerZoom ** zoom) / -180 + 1
						) * canvas.height / 2,
						radius,
						radius,
						0,
						0,
						2 * Math.PI,
					);

					const fillColor: string | boolean = (
						correctCountries.has(country.name.en) ? colors.green : (
							incorrectCountries.has(country.name.en) ? colors.red : false
						)
					);

					if (fillColor) {
						ctx.fillStyle = fillColor;
					} else if (hoveredCapitalCountry === country.name.en) {
						ctx.fillStyle = colors.foreground;
					} else {
						ctx.fillStyle = colors.lightGray;
					}

					ctx.fill();
					ctx.stroke();
					ctx.closePath();
				}
			}

			clicked = false;

			if (running) {
				// setTimeout(() => {
				window.requestAnimationFrame(draw);
				// }, 1000);
			} else {
				// onNewGame(() => {
				// 	window.requestAnimationFrame(draw);
				// 	// setTimeout(() => {
				// 	// });
				// });

				newGameCallback = () => {
					window.requestAnimationFrame(draw);
				};
			}
		};

		draw();
	}

	{
		let pointerDown: { x: number, y: number } = {
			x: 0,
			y: 0,
		};
		canvas.addEventListener("pointerup", (event: MouseEvent) => {
			const click: { x: number, y: number } = {
				x: event.pageX - canvas.parentElement.offsetLeft,
				y: event.pageY - canvas.parentElement.offsetTop,
			};
			if (
				click.x === pointerDown.x &&
				click.y === pointerDown.y
			) {
				clicked = true;
			}
		});
		canvas.addEventListener("pointerdown", (event: MouseEvent) => {
			pointerDown = {
				x: event.pageX - canvas.parentElement.offsetLeft,
				y: event.pageY - canvas.parentElement.offsetTop,
			};
		});
	}
};

export const stopDrawing = () => {
	running = false;
	countryClicked(null);
};

export const awaitCountryClick = async (): Promise<string> => {
	return await new Promise<string>((resolve: (name: string) => void) => {
		countryClicked = resolve;
	});
}

export const markCountry = (name: string, correct: boolean) => {
	if (correct) {
		correctCountries.add(name);
	} else {
		incorrectCountries.add(name);
	}
}

