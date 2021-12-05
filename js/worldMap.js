import { enclaves } from "./game.js";
let data;
const canvas = document.querySelector("game canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const background = (window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-18")).trim();
const foreground = (window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-f")).trim();
let mouseX = 0;
let mouseY = 0;
let centerX = 0;
let centerY = 0;
let zoom = 0;
const scalePerZoom = 1.5;
let countryToFind;
let countryFound;
let clicked = false;
export default function initWorldMap(countriesData) {
	data = countriesData;
	{
		const resize = () => {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		};
		resize();
		window.addEventListener("resize", resize);
	}
	window.addEventListener("pointermove", (evt) => {
		mouseX = evt.pageX - canvas.parentElement.offsetLeft;
		mouseY = evt.pageY - canvas.parentElement.offsetTop;
		if (evt.buttons === 1) {
			centerX -= (evt.movementX / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
			centerY += (evt.movementY / (canvas.height / 2)) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180);
		}
	});
	window.addEventListener("wheel", (evt) => {
		const [x, y] = [evt.layerX, evt.layerY];
		const pointX = ((x / (canvas.width / 2) - 1) / ((scalePerZoom ** zoom) / 180)) + centerX;
		const pointY = ((y / (canvas.height / 2) - 1) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180)) + centerY;
		const delta = evt.deltaY / 100;
		zoom -= delta;
		centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
		centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
	});
	canvas.addEventListener("wheel", (evt) => {
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
				const coordinates = country.coordinates;
				let pointerInShape = false;
				for (const drawPolygons of [false, true]) {
					for (const polygon of coordinates) {
						ctx.beginPath();
						for (const [x, y] of polygon) {
							ctx.lineTo(((x - centerX) *
								(scalePerZoom ** zoom) / 180 + 1) * canvas.width / 2, ((y - centerY) * (canvas.width / canvas.height) *
								(scalePerZoom ** zoom) / -180 + 1) * canvas.height / 2);
						}
						ctx.closePath();
						if (drawPolygons) {
							if (pointerInShape) {
								ctx.fillStyle = "darkRed";
								ctx.fill();
							}
							else {
								if (enclaves.includes(country.name.en)) {
									ctx.fillStyle = background;
									ctx.fill();
								}
							}
							ctx.stroke();
						}
						else {
							if (ctx.isPointInPath(mouseX, mouseY)) {
								pointerInShape = true;
								break;
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
		let pointerDown = {
			x: 0,
			y: 0,
		};
		canvas.addEventListener("pointerup", (evt) => {
			const click = {
				x: evt.pageX - canvas.parentElement.offsetLeft,
				y: evt.pageY - canvas.parentElement.offsetTop,
			};
			if (click.x === pointerDown.x &&
				click.y === pointerDown.y) {
				clicked = true;
			}
		});
		canvas.addEventListener("pointerdown", (evt) => {
			pointerDown = {
				x: evt.pageX - canvas.parentElement.offsetLeft,
				y: evt.pageY - canvas.parentElement.offsetTop,
			};
		});
	}
}
;
export async function awaitFindCountry(countryName) {
	const country = data.find(country => country.name.en === countryName);
	if (!country)
		throw new Error(`Country not found: ${countryName}`);
	countryToFind = countryName;
	await new Promise((resolve) => {
		countryFound = resolve;
	});
}
//# sourceMappingURL=worldMap.js.map