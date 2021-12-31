let data;
const canvas = document.querySelector("game canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let colors;
let mouseX;
let mouseY;
let centerX;
let centerY;
let zoom;
const scalePerZoom = 1.8;
let countryClicked;
let clicked;
let correctCountries;
let incorrectCountries;
let running;
let newGameCallback;
const resize = () => {
	if (running) {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	}
};
export const newGame = () => {
	mouseX = 0;
	mouseY = 0;
	centerX = 0;
	centerY = 0;
	zoom = 0;
	clicked = false;
	correctCountries = new Set();
	incorrectCountries = new Set();
	running = true;
	newGameCallback?.();
	resize();
};
export default (countriesData) => {
	data = countriesData;
	const getColor = (color) => (window.getComputedStyle(document.documentElement).getPropertyValue(color)).trim();
	{
		const initColors = () => {
			colors = {
				background: getColor("--col-18"),
				foreground: getColor("--col-f"),
				gray: getColor("--col-3"),
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
		let prevX = -1;
		let prevY = -1;
		window.addEventListener("pointermove", (event) => {
			if (prevX >= 0) {
				mouseX = event.pageX - canvas.parentElement.offsetLeft;
				mouseY = event.pageY - canvas.parentElement.offsetTop - (navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0);
				const dragMultiplier = 2;
				if (event.buttons === 1) {
					centerX -= dragMultiplier * ((event.pageX - prevX) / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
					centerY += dragMultiplier * ((event.pageY - prevY) / (canvas.height / 2)) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180);
					centerX = Math.min(Math.max(centerX, -180), 180);
					centerY = Math.min(Math.max(centerY, -90), 90);
				}
			}
			prevX = event.pageX;
			prevY = event.pageY;
		});
	}
	canvas.addEventListener("wheel", (event) => {
		event.preventDefault();
		const x = event.pageX - canvas.parentElement.offsetLeft;
		const y = event.pageY - canvas.parentElement.offsetTop - (navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0);
		const pointX = ((x / (canvas.width / 2) - 1) / ((scalePerZoom ** zoom) / 180)) + centerX;
		const pointY = ((y / (canvas.height / 2) - 1) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180)) + centerY;
		let delta = Math.min(Math.max(event.deltaY * 5, -100), 100) / 100;
		zoom -= delta;
		if (zoom < 0) {
			delta += zoom;
			zoom = 0;
		}
		centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
		centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
	}, { passive: false });
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
					for (const polygon of coordinates) {
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
									if (!correctCountries.has(country.name.en)
										&&
											!incorrectCountries.has(country.name.en)) {
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
			if (running) {
				window.requestAnimationFrame(draw);
			}
			else {
				newGameCallback = () => {
					window.requestAnimationFrame(draw);
				};
			}
		};
		draw();
	}
	{
		let pointerDown = {
			x: 0,
			y: 0,
		};
		canvas.addEventListener("pointerup", (event) => {
			const click = {
				x: event.pageX - canvas.parentElement.offsetLeft,
				y: event.pageY - canvas.parentElement.offsetTop,
			};
			if (click.x === pointerDown.x &&
				click.y === pointerDown.y) {
				clicked = true;
			}
		});
		canvas.addEventListener("pointerdown", (event) => {
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
export const awaitCountryClick = async () => {
	return await new Promise((resolve) => {
		countryClicked = resolve;
	});
};
export const markCountry = (name, correct) => {
	if (correct) {
		correctCountries.add(name);
	}
	else {
		incorrectCountries.add(name);
	}
};
//# sourceMappingURL=worldMap.js.map