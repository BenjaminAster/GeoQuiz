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
export function initWorldMap(countriesData) {
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
		mouseX = evt.layerX;
		mouseY = evt.layerY;
		if (evt.buttons === 1) {
			centerX -= (evt.movementX / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
			centerY += (evt.movementY / (canvas.height / 2)) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180);
		}
	});
	window.addEventListener("wheel", (evt) => {
		const [x, y] = [evt.layerX, evt.layerY];
		const pointX = (x / (canvas.width / 2) - 1) / ((scalePerZoom ** zoom) / 180) + centerX;
		const pointY = (y / (canvas.height / 2) - 1) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180) + centerY;
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
				for (const polygon of coordinates) {
					ctx.beginPath();
					for (const [x, y] of polygon) {
						ctx.lineTo(((x - centerX) * (scalePerZoom ** zoom) / 180 + 1) * canvas.width / 2, ((y - centerY) * (canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180 + 1) * canvas.height / 2);
					}
					ctx.closePath();
					if (ctx.isPointInPath(mouseX, mouseY)) {
						ctx.fillStyle = `rgb(${[...Array(3)].map(() => Math.floor(Math.random() * 256)).join()})`;
						ctx.fill();
					}
					ctx.stroke();
				}
			}
			window.requestAnimationFrame(draw);
		};
		draw();
	}
}
;
//# sourceMappingURL=worldMap.js.map