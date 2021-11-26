import { test } from "./test.js";

console.log(1);
console.log(test);


(async () => {

	{
		// country borders test

		const countryBorders: Record<string, any>[] = (await (await fetch(
			// "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
			"./data/borders.min.json"
		)).json()).features;

		const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("canvas");
		const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

		{
			const resize = () => {
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
			};

			resize();

			window.addEventListener("resize", resize);
		}

		let mouseX: number = 0;
		let mouseY: number = 0;

		let centerX: number = 0;
		let centerY: number = 0;
		let zoom: number = 0;
		const scalePerZoom: number = 1.5;

		window.addEventListener("mousemove", (evt: MouseEvent) => {
			// @ts-ignore
			mouseX = evt.layerX;
			// @ts-ignore
			mouseY = evt.layerY;
		});

		window.addEventListener("wheel", (evt: WheelEvent) => {
			// @ts-ignore
			const [x, y]: [number, number] = [evt.layerX, evt.layerY];

			const pointX = (x / (canvas.width / 2) - 1) / ((scalePerZoom ** zoom) / 180) + centerX;
			const pointY = (y / (canvas.height / 2) - 1) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180) + centerY;

			const delta = evt.deltaY / 100;
			zoom -= delta;

			centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
			centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
		});

		{
			let eventArray: boolean[] = [];

			for (const [i, eventName] of [
				"abort",
				"animationcancel",
				"animationend",
				"animationiteration",
				"animationstart",
				"auxclick",
				"beforeinput",
				"blur",
				"canplay",
				"canplaythrough",
				"change",
				"click",
				"close",
				"compositionend",
				"compositionstart",
				"compositionupdate",
				"contextmenu",
				"cuechange",
				"dblclick",
				"drag",
				"dragend",
				"dragenter",
				"dragleave",
				"dragover",
				"dragstart",
				"drop",
				"durationchange",
				"emptied",
				"ended",
				"error",
				"focus",
				"focusin",
				"focusout",
				"formdata",
				"gotpointercapture",
				"input",
				"invalid",
				"keydown",
				"keypress",
				"keyup",
				"load",
				"loadeddata",
				"loadedmetadata",
				"loadstart",
				"lostpointercapture",
				"mousedown",
				"mouseenter",
				"mouseleave",
				"mousemove",
				"mouseout",
				"mouseover",
				"mouseup",
				"pause",
				"play",
				"playing",
				"pointercancel",
				"pointerdown",
				"pointerenter",
				"pointerleave",
				"pointermove",
				"pointerout",
				"pointerover",
				"pointerup",
				"progress",
				"ratechange",
				"reset",
				"resize",
				"scroll",
				"securitypolicyviolation",
				"seeked",
				"seeking",
				"select",
				"selectionchange",
				"selectstart",
				"stalled",
				"submit",
				"suspend",
				"timeupdate",
				"toggle",
				"touchcancel",
				"touchend",
				"touchmove",
				"touchstart",
				"transitioncancel",
				"transitionend",
				"transitionrun",
				"transitionstart",
				"volumechange",
				"waiting",
				"webkitanimationend",
				"webkitanimationiteration",
				"webkitanimationstart",
				"webkittransitionend",
				"wheel",
			].entries()) {
				eventArray.push(false);
				window.addEventListener(eventName, (evt: Event) => {
					eventArray[i] = true;
				});
			}

			setInterval(() => {
				console.log(eventArray.map((evt) => evt ? "#" : ".").join(""));
				eventArray.fill(false);
			}, 100);
		}

		{
			const draw = () => {
				ctx.strokeStyle = "white";
				ctx.lineWidth = 1;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for (const country of countryBorders) {
					const geometry: Record<string, any> = country.geometry;
					const coordinates: [number, number][][][] = (() => {
						switch (geometry.type) {
							case ("Polygon"): return [geometry.coordinates];
							case ("MultiPolygon"): return geometry.coordinates;
							default: throw new Error(`Unknown geometry type: ${geometry.type}`);
						}
					})();

					for (const polygon of coordinates) {
						ctx.beginPath();
						// @ ts-ignore
						for (const [x, y] of polygon[0]) {
							ctx.lineTo(
								(
									(x - centerX) * (scalePerZoom ** zoom) / 180 + 1
								) * canvas.width / 2,
								(
									(y - centerY) * (canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180 + 1
								) * canvas.height / 2,
							);
						}
						ctx.closePath();
						if (ctx.isPointInPath(mouseX, mouseY)) {
							ctx.fillStyle = "darkRed";
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

})();

