let data;
const canvas = document.querySelector("game canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let colors;
let mouseX = 0;
let mouseY = 0;
let centerX = 0;
let centerY = 0;
let zoom = 0;
const scalePerZoom = 1.5;
let countryClicked;
let clicked = false;
let correctCountries = new Set();
let incorrectCountries = new Set();
export default function initWorldMap(countriesData) {
	data = countriesData;
	{
		colors = {
			background: (window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-18")).trim(),
			foreground: (window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-f")).trim(),
			gray: (window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-3")).trim(),
			green: "green",
			red: "red",
		};
	}
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
			ctx.strokeStyle = colors.foreground;
			ctx.fillStyle = colors.background;
			ctx.lineWidth = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			let hoveredCountry;
			for (const drawPolygons of [false, true]) {
				countryLoop: for (const country of (drawPolygons ? data : [...data].reverse())) {
					const coordinates = country.coordinates;
					const fillColor = (correctCountries.has(country.name.en) ? colors.green : (incorrectCountries.has(country.name.en) ? colors.red : null));
					polygonLoop: for (const polygon of coordinates) {
						ctx.beginPath();
						for (const [x, y] of polygon) {
							ctx.lineTo(((x - centerX) *
								(scalePerZoom ** zoom) / 180 + 1) * canvas.width / 2, ((y - centerY) * (canvas.width / canvas.height) *
								(scalePerZoom ** zoom) / -180 + 1) * canvas.height / 2);
						}
						ctx.closePath();
						if (drawPolygons) {
							if (fillColor) {
								ctx.fillStyle = fillColor;
							}
							else if (hoveredCountry === country.name.en) {
								ctx.fillStyle = colors.foreground;
							}
							else {
								ctx.fillStyle = colors.gray;
							}
							ctx.fill();
							ctx.stroke();
						}
						else {
							if (ctx.isPointInPath(mouseX, mouseY)) {
								hoveredCountry = country.name.en;
								if (clicked) {
									countryClicked(country.name.en);
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
export async function awaitCountryClick() {
	return await new Promise((resolve) => {
		countryClicked = resolve;
	});
}
export function markCountry(name, correct) {
	if (correct) {
		correctCountries.add(name);
	}
	else {
		incorrectCountries.add(name);
	}
}
//# sourceMappingURL=worldMap.js.map