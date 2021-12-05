
import { CountriesData, enclaves } from "./game.js";


let data: CountriesData;

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("game canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: false });

const background: string = (
	window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-18")
).trim();

const foreground: string = (
	window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-f")
).trim();


let mouseX: number = 0;
let mouseY: number = 0;

let centerX: number = 0;
let centerY: number = 0;
let zoom: number = 0;
const scalePerZoom: number = 1.5;

let countryToFind: string;
let countryFound: () => void;
// let lastClick: { x: number, y: number };
let clicked: boolean = false;

export default function initWorldMap(countriesData: CountriesData) {
	data = countriesData;

	{
		const resize = () => {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		};

		resize();

		window.addEventListener("resize", resize);
	}

	window.addEventListener("pointermove", (evt: MouseEvent) => {
		mouseX = evt.pageX - canvas.parentElement.offsetLeft;
		mouseY = evt.pageY - canvas.parentElement.offsetTop;

		if (evt.buttons === 1) {
			centerX -= (evt.movementX / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
			centerY += (evt.movementY / (canvas.height / 2)) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180);
		}
	});

	window.addEventListener("wheel", (evt: WheelEvent) => {
		// @ts-ignore
		const [x, y]: [number, number] = [evt.layerX, evt.layerY];

		const pointX: number = ((x / (canvas.width / 2) - 1) / (
			(scalePerZoom ** zoom) / 180
		)) + centerX;
		const pointY: number = ((y / (canvas.height / 2) - 1) / (
			(canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180
		)) + centerY;

		const delta = evt.deltaY / 100;
		zoom -= delta;

		centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
		centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
	});

	canvas.addEventListener("wheel", (evt: WheelEvent) => {
		evt.preventDefault();
	});

	{
		const draw = () => {
			ctx.strokeStyle = foreground;
			ctx.fillStyle = background;
			ctx.lineWidth = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";

			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (const country of data) {
				const coordinates: [number, number][][] = country.coordinates;

				let pointerInShape: boolean = false;

				for (const drawPolygons of [false, true]) {
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
							if (pointerInShape) {
								ctx.fillStyle = "darkRed";
								ctx.fill();
							} else {
								if (enclaves.includes(country.name.en)) {
									ctx.fillStyle = background;
									ctx.fill();
								}
							}
							ctx.stroke();
						} else {
							if (ctx.isPointInPath(mouseX, mouseY)) {
								pointerInShape = true;
								break;
								// ctx.fillStyle = `rgb(${[...Array(3)].map(
								// 	() => Math.floor(Math.random() * 256)
								// ).join()})`;
							}
						}
					}
				}
			}

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

export async function awaitFindCountry(countryName: string) {
	const country = data.find(country => country.name.en === countryName);
	if (!country) throw new Error(`Country not found: ${countryName}`);

	countryToFind = countryName;

	await new Promise<void>((resolve: () => void) => {
		countryFound = resolve;
	});
}

