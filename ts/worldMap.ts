
import { CountriesData, enclaves } from "./game.js";


let data: CountriesData;

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("game canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: false });

let colors: Record<string, string>;

let mouseX: number = 0;
let mouseY: number = 0;

let centerX: number = 0;
let centerY: number = 0;
let zoom: number = 0;
const scalePerZoom: number = 1.5;

let countryClicked: (name: string) => void;
let clicked: boolean = false;

let correctCountries = new Set<string>();
let incorrectCountries = new Set<string>();

export default function initWorldMap(countriesData: CountriesData) {
	data = countriesData;

	const getColor = (color: string) => (
		window.getComputedStyle(document.documentElement)?.getPropertyValue(color)
	).trim();

	{
		colors = {
			background: getColor("--col-18"),
			foreground: getColor("--col-f"),
			gray: getColor("--col-3"),
			green: getColor("--country-green"),
			red: getColor("--country-red"),
		};

		console.log(colors);
	}

	{
		const resize = () => {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		};

		resize();

		window.addEventListener("resize", resize);
	}

	{
		let prevX: number = -1;
		let prevY: number = -1;

		window.addEventListener("pointermove", (evt: MouseEvent) => {
			if (prevX >= 0) {
				mouseX = evt.pageX - canvas.parentElement.offsetLeft;
				mouseY = evt.pageY - canvas.parentElement.offsetTop;

				if (evt.buttons === 1) {
					centerX -= ((evt.pageX - prevX) / (canvas.width / 2)) / (
						(scalePerZoom ** zoom) / 180
					);
					centerY += ((evt.pageY - prevY) / (canvas.height / 2)) / (
						(canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180
					);

					centerX = Math.min(Math.max(centerX, -180), 180);
					centerY = Math.min(Math.max(centerY, -90), 90);
				}
			}

			prevX = evt.pageX;
			prevY = evt.pageY;
		});
	}

	window.addEventListener("wheel", (evt: WheelEvent) => {
		const x: number = evt.pageX - canvas.parentElement.offsetLeft;
		const y: number = evt.pageY - canvas.parentElement.offsetTop;

		const pointX: number = ((x / (canvas.width / 2) - 1) / (
			(scalePerZoom ** zoom) / 180
		)) + centerX;
		const pointY: number = ((y / (canvas.height / 2) - 1) / (
			(canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180
		)) + centerY;

		let delta = evt.deltaY / 100;
		zoom -= delta;

		if (zoom < 0) {
			delta += zoom;
			zoom = 0;
		}

		centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
		centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
	});

	canvas.addEventListener("wheel", (evt: WheelEvent) => {
		evt.preventDefault();
	});

	{
		const draw = () => {
			ctx.strokeStyle = colors.foreground;
			ctx.fillStyle = colors.background;
			ctx.lineWidth = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";

			ctx.fillRect(0, 0, canvas.width, canvas.height);

			let hoveredCountry: string;

			for (const drawPolygons of [false, true]) {

				countryLoop: for (const country of (drawPolygons ? data : [...data].reverse())) {
					const coordinates: [number, number][][] = country.coordinates;

					const fillColor: string | null = (
						correctCountries.has(country.name.en) ? colors.green : (
							incorrectCountries.has(country.name.en) ? colors.red : null
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

			clicked = false;

			window.requestAnimationFrame(() => setTimeout(draw));
		};

		draw();
	}

	{
		let pointerDown: { x: number, y: number } = {
			x: 0,
			y: 0,
		};
		canvas.addEventListener("pointerup", (evt: MouseEvent) => {
			const click: { x: number, y: number } = {
				x: evt.pageX - canvas.parentElement.offsetLeft,
				y: evt.pageY - canvas.parentElement.offsetTop,
			};
			if (
				click.x === pointerDown.x &&
				click.y === pointerDown.y
			) {
				clicked = true;
			}
		});
		canvas.addEventListener("pointerdown", (evt: MouseEvent) => {
			pointerDown = {
				x: evt.pageX - canvas.parentElement.offsetLeft,
				y: evt.pageY - canvas.parentElement.offsetTop,
			};
		});
	}

};

export async function awaitCountryClick(): Promise<string> {
	return await new Promise<string>((resolve: (name: string) => void) => {
		countryClicked = resolve;
	});
}

export function markCountry(name: string, correct: boolean) {
	if (correct) {
		correctCountries.add(name);
	} else {
		incorrectCountries.add(name);
	}
}
