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

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		let mouseX: number = 0;
		let mouseY: number = 0;

		window.addEventListener("mousemove", (evt: MouseEvent) => {
			mouseX = evt.clientX - canvas.offsetLeft;
			mouseY = evt.clientY - canvas.offsetTop;
		});
		{
			const draw = () => {
				ctx.strokeStyle = "white";
				ctx.lineWidth = 1;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for (const country of countryBorders) {
					const geometry: Record<string, any> = country.geometry;
					const coordinates: number[][][] = (() => {
						switch (geometry.type) {
							case ("Polygon"): return [geometry.coordinates];
							case ("MultiPolygon"): return geometry.coordinates;
							default: throw new Error(`Unknown geometry type: ${geometry.type}`);
						}
					})();

					for (const polygon of coordinates) {
						ctx.beginPath();
						for (const point of polygon[0]) {
							ctx.lineTo((180 + point[0]) * 4, (90 - point[1]) * 4);
							// ctx.lineTo((0 + point[0]) * 40, (50 - point[1]) * 40);
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
		// {
		// 	const austriaCoordinates: number[][] = countryBorders.find(({ properties }) => properties.name === "Austria").geometry.coordinates[0][0];

		// 	ctx.beginPath();
		// 	ctx.strokeStyle = "white";
		// 	ctx.lineWidth = 2;

		// 	for (const coordinate of austriaCoordinates) {
		// 		ctx.lineTo((coordinate[0] - 9) * 30, (coordinate[1] - 50) * -30);
		// 	}

		// 	const point = [(13 - 9) * 30, (47 - 50) * -30] as const;

		// 	console.log(ctx.isPointInPath(...point));

		// 	ctx.stroke();
		// 	ctx.closePath();

		// 	ctx.beginPath();
		// 	ctx.fillStyle = "red";
		// 	ctx.ellipse(...point, 2, 2, 0, 0, 2 * Math.PI);
		// 	ctx.fill();
		// 	ctx.closePath();

		// 	console.log(austriaCoordinates);
		// }
	}

})();

