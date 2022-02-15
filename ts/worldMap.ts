

import type { CountriesData } from "./game.js";

let data: CountriesData;

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>(".game canvas");
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

let render: boolean = true

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
			// colors = {
			// 	background: getColor("--col-background"),
			// 	foreground: getColor("--col-f"),
			// 	gray: getColor("--col-3"),
			// 	lightGray: getColor("--col-5"),
			// 	green: getColor("--country-green"),
			// 	red: getColor("--country-red"),
			// };
			colors = {
				// background: getColor("--col-1"),
				// background: "#222228",
				background: getColor("--background"),
				// foreground: getColor("--col-f"),
				foreground: getColor("color"),
				// foreground: getColor("--violet"),
				gray: getColor("--gray-1"),
				// lightGray: getColor("--col-2"),
				lightGray: getColor("--gray-3"),
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

		const onPointerMove = (pageX: number, pageY: number, hovering: boolean = false) => {
			if (prevX >= 0) {
				mouseX = pageX - canvas.parentElement.offsetLeft;
				mouseY = pageY - canvas.parentElement.offsetTop - (
					// @ts-ignore
					navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0
				);

				const dragMultiplier: number = 2;

				if (!hovering) {
					centerX -= dragMultiplier * ((pageX - prevX) / (canvas.width / 2)) / (
						(scalePerZoom ** zoom) / 180
					);
					centerY += dragMultiplier * ((pageY - prevY) / (canvas.height / 2)) / (
						(canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180
					);

					centerX = Math.min(Math.max(centerX, -180), 180);
					centerY = Math.min(Math.max(centerY, -90), 90);
				}
			}

			prevX = pageX;
			prevY = pageY;
		};

		canvas.addEventListener("mousemove", (event: MouseEvent) => {
			onPointerMove(event.pageX, event.pageY, (event.buttons !== 1));
			render = true
		});

		{
			let currentTouchDistance: number;

			canvas.addEventListener("touchstart", (event: TouchEvent) => {
				if (event.touches.length === 2) {
					currentTouchDistance = Math.hypot(
						event.touches[0].pageX - event.touches[1].pageX,
						event.touches[0].pageY - event.touches[1].pageY
					);
				}
				render = true
			}, { passive: false });

			canvas.addEventListener("touchend", (event: TouchEvent) => {
				if (event.touches.length === 1) {
					currentTouchDistance = null;
				} else if (event.touches.length === 0) {
					prevX = -1;
					prevY = -1;
				}
				render = true
			}, { passive: false });

			canvas.addEventListener("touchmove", (event: TouchEvent) => {

				if (event.touches.length === 2) {
					event.preventDefault();

					const newTouchDistance = Math.hypot(
						event.touches[0].pageX - event.touches[1].pageX,
						event.touches[0].pageY - event.touches[1].pageY
					);


					const midpointX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
					const midpointY = (event.touches[0].pageY + event.touches[1].pageY) / 2;

					const x: number = midpointX - canvas.parentElement.offsetLeft;
					const y: number = midpointY - canvas.parentElement.offsetTop - (
						// @ts-ignore
						navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0
					);

					const pointX: number = ((x / (canvas.width / 2) - 1) / (
						(scalePerZoom ** zoom) / 180
					)) + centerX;
					const pointY: number = ((y / (canvas.height / 2) - 1) / (
						(canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180
					)) + centerY;

					// let delta = Math.min(Math.max(event.deltaY * 5, -100), 100) / 100;
					// zoom -= delta;

					// if (zoom < 0) {
					// 	delta += zoom;
					// 	zoom = 0;
					// }

					const zoomMultiplier: number = 0.1;

					const delta: number = (newTouchDistance - currentTouchDistance) * zoomMultiplier;

					zoom += delta;

					// zoom = Math.min(Math.max(zoom, -1), 1);

					currentTouchDistance = newTouchDistance;

					centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
					centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);

				} else if (event.touches.length === 1) {
					onPointerMove(event.touches[0].pageX, event.touches[0].pageY);
				}

				render = true
			}, { passive: false });
		}

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
		render = true
	}, { passive: false });

	{
		const draw = () => {
			ctx.strokeStyle = colors.foreground;
			ctx.lineWidth = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.fillStyle = colors.background;
			
			if (render) ctx.fillRect(0, 0, canvas.width, canvas.height);
			else return

			// ctx.fillStyle = colors.gray;
			// ctx.fillRect(0, 0, canvas.width, canvas.height);
			// ctx.fillStyle = colors.background;

			// ctx.clearRect(0, 0, canvas.width, canvas.height);

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

			render = false

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
				setInterval(() => {
					window.requestAnimationFrame(draw);
				}, 1000 / 30);
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
			render = true
		});
		canvas.addEventListener("pointerdown", (event: MouseEvent) => {
			pointerDown = {
				x: event.pageX - canvas.parentElement.offsetLeft,
				y: event.pageY - canvas.parentElement.offsetTop,
			};
			render = true
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

