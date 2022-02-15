let data;
const canvas = document.querySelector(".game canvas");
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
let settings;
const resize = () => {
	if (running) {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	}
};
export const newGame = (newSettings) => {
	mouseX = 0;
	mouseY = 0;
	centerX = 0;
	centerY = 0;
	zoom = 0;
	clicked = false;
	correctCountries = new Set();
	incorrectCountries = new Set();
	settings = newSettings;
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
				background: getColor("--background"),
				foreground: getColor("color"),
				gray: getColor("--gray-1"),
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
		let prevX = -1;
		let prevY = -1;
		const onPointerMove = (pageX, pageY, hovering = false) => {
			if (prevX >= 0) {
				mouseX = pageX - canvas.parentElement.offsetLeft;
				mouseY = pageY - canvas.parentElement.offsetTop - (navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0);
				const dragMultiplier = 2;
				if (!hovering) {
					centerX -= dragMultiplier * ((pageX - prevX) / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
					centerY += dragMultiplier * ((pageY - prevY) / (canvas.height / 2)) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180);
					centerX = Math.min(Math.max(centerX, -180), 180);
					centerY = Math.min(Math.max(centerY, -90), 90);
				}
			}
			prevX = pageX;
			prevY = pageY;
		};
		canvas.addEventListener("mousemove", (event) => {
			onPointerMove(event.pageX, event.pageY, (event.buttons !== 1));
		});
		{
			let currentTouchDistance;
			canvas.addEventListener("touchstart", (event) => {
				if (event.touches.length === 2) {
					currentTouchDistance = Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
				}
			}, { passive: false });
			canvas.addEventListener("touchend", (event) => {
				if (event.touches.length === 1) {
					currentTouchDistance = null;
				}
				else if (event.touches.length === 0) {
					prevX = -1;
					prevY = -1;
				}
			}, { passive: false });
			canvas.addEventListener("touchmove", (event) => {
				if (event.touches.length === 2) {
					event.preventDefault();
					const newTouchDistance = Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
					const midpointX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
					const midpointY = (event.touches[0].pageY + event.touches[1].pageY) / 2;
					const x = midpointX - canvas.parentElement.offsetLeft;
					const y = midpointY - canvas.parentElement.offsetTop - (navigator.windowControlsOverlay?.getTitlebarAreaRect?.()?.height ?? 0);
					const pointX = ((x / (canvas.width / 2) - 1) / ((scalePerZoom ** zoom) / 180)) + centerX;
					const pointY = ((y / (canvas.height / 2) - 1) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180)) + centerY;
					const zoomMultiplier = 0.1;
					const delta = (newTouchDistance - currentTouchDistance) * zoomMultiplier;
					zoom += delta;
					currentTouchDistance = newTouchDistance;
					centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
					centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
				}
				else if (event.touches.length === 1) {
					onPointerMove(event.touches[0].pageX, event.touches[0].pageY);
				}
			}, { passive: false });
		}
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
			ctx.lineWidth = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.fillStyle = colors.background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			{
				let hoveredCountry;
				for (const drawPolygons of [...(settings.capital ? [] : [false]), true]) {
					countryLoop: for (const country of (drawPolygons ? data : [...data].reverse())) {
						const coordinates = country.coordinates;
						const fillColor = (!settings.capital) && (correctCountries.has(country.name.en) ? colors.green : (incorrectCountries.has(country.name.en) ? colors.red : false));
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
			}
			if (settings.capital) {
				const radius = 5 + zoom;
				const mousePointX = ((mouseX / (canvas.width / 2) - 1) / ((scalePerZoom ** zoom) / 180)) + centerX;
				const mousePointY = ((mouseY / (canvas.height / 2) - 1) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180)) + centerY;
				const radiusPoints = ((radius) / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
				let hoveredCapitalCountry;
				mouseHoverLoop: for (const country of [...data].reverse()) {
					if (Math.sqrt((country.capitalCoordinates[1] - mousePointX) ** 2 +
						(country.capitalCoordinates[0] - mousePointY) ** 2) < radiusPoints) {
						hoveredCapitalCountry = country.name.en;
						if (clicked) {
							if (!correctCountries.has(country.name.en)
								&&
									!incorrectCountries.has(country.name.en)) {
								countryClicked(country.name.en);
							}
							clicked = false;
						}
						break mouseHoverLoop;
					}
				}
				for (const country of data) {
					ctx.beginPath();
					ctx.ellipse(((country.capitalCoordinates[1] - centerX) *
						(scalePerZoom ** zoom) / 180 + 1) * canvas.width / 2, ((country.capitalCoordinates[0] - centerY) * (canvas.width / canvas.height) *
						(scalePerZoom ** zoom) / -180 + 1) * canvas.height / 2, radius, radius, 0, 0, 2 * Math.PI);
					const fillColor = (correctCountries.has(country.name.en) ? colors.green : (incorrectCountries.has(country.name.en) ? colors.red : false));
					if (fillColor) {
						ctx.fillStyle = fillColor;
					}
					else if (hoveredCapitalCountry === country.name.en) {
						ctx.fillStyle = colors.foreground;
					}
					else {
						ctx.fillStyle = colors.lightGray;
					}
					ctx.fill();
					ctx.stroke();
					ctx.closePath();
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