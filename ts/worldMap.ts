
export default (async () => {
	{
		// country borders test

		const countriesData: Record<string, any>[] = (await (await fetch(
			// "./data/geojson-maps.ash.ms/world-medium.geo.json"
			// "./data/github.com-simonepri/world-1m.geo.json"
			// "./data/world.geo.json"
			// "./data/exploratory.io/world.geo.json"
			"./data/data.min.json",
		)).json());

		// const canvasElement: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("game canvas");
		// const elementCtx: CanvasRenderingContext2D = canvasElement.getContext("2d");

		// const canvas: HTMLCanvasElement = document.createElement("canvas");
		// canvas.width = canvasElement.width;
		// canvas.height = canvasElement.height;
		// const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: false });

		const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("canvas");
		const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: false });
		// const ctx: CanvasRenderingContext2D = canvas.getContext("2d", { alpha: true });

		// ctx.drawImage(canvas, 0, 0, 960, 540, 0, 0, 1920, 1080);
		// // Force the drawImage call to be evaluated within this benchmark code:
		// createImageBitmap(canvas, 0, 0, 1, 1).then(() => deferred.resolve());

		const background: string = (
			window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-18")
		).trim();

		const foreground: string = (
			window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-f")
		).trim();

		ctx.getImageData(0, 0, 1, 1);

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

		window.addEventListener("pointermove", (evt: MouseEvent) => {
			// @ts-ignore
			mouseX = evt.layerX;
			// @ts-ignore
			mouseY = evt.layerY;

			if (evt.buttons === 1) {
				centerX -= (evt.movementX / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
				centerY += (evt.movementY / (canvas.height / 2)) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180);
			}
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
			const draw = () => {
				ctx.strokeStyle = foreground;
				ctx.fillStyle = background;
				ctx.lineWidth = 1;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";

				// ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				for (const country of countriesData) {
					// const geometry: Record<string, any> = country.geometry;
					// const coordinates: [number, number][][][] = (() => {
					// 	switch (geometry.type) {
					// 		case ("Polygon"): return [geometry.coordinates];
					// 		case ("MultiPolygon"): return geometry.coordinates;
					// 		default: throw new Error(`Unknown geometry type: ${geometry.type}`);
					// 	}
					// })();

					const coordinates: [number, number][][] = country.coordinates;

					for (const polygon of coordinates) {
						ctx.beginPath();
						// @ ts-ignore
						for (const [x, y] of polygon) {
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

				// canvasElement.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
				// ctx.getImageData(0, 0, 1, 1);
				// elementCtx.getImageData(0, 0, 1, 1);

				// elementCtx.drawImage(canvas, 0, 0);
				// await createImageBitmap(canvas, 0, 0, 1, 1);
				// await createImageBitmap(canvasElement, 0, 0, 1, 1);

				// console.log(canvas.toDataURL("image/png"));

				window.requestAnimationFrame(draw);
			};

			draw();
		}
	}
});
