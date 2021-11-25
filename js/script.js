import { test } from "./test.js";
console.log(1);
console.log(test);
(async () => {
    {
        // country borders test
        const countryBorders = (await (await fetch(
        // "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
        "./data/borders.min.json")).json()).features;
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        let mouseX = 0;
        let mouseY = 0;
        window.addEventListener("mousemove", (evt) => {
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
                    const geometry = country.geometry;
                    const coordinates = (() => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFHbEIsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUVYO1FBQ0MsdUJBQXVCO1FBRXZCLE1BQU0sY0FBYyxHQUEwQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUs7UUFDaEUscUZBQXFGO1FBQ3JGLHlCQUF5QixDQUN6QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQW9CLFFBQVEsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sR0FBRyxHQUE2QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlELE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNsQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFFcEMsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksTUFBTSxHQUFXLENBQUMsQ0FBQztRQUV2QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBZSxFQUFFLEVBQUU7WUFDeEQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN6QyxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBQ0g7WUFDQyxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7Z0JBQ2pCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO2dCQUMxQixHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDbEIsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO2dCQUV2QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRWpELEtBQUssTUFBTSxPQUFPLElBQUksY0FBYyxFQUFFO29CQUNyQyxNQUFNLFFBQVEsR0FBd0IsT0FBTyxDQUFDLFFBQVEsQ0FBQztvQkFDdkQsTUFBTSxXQUFXLEdBQWlCLENBQUMsR0FBRyxFQUFFO3dCQUN2QyxRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUU7NEJBQ3RCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ2hELEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQzs0QkFDbkQsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7eUJBQ3BFO29CQUNGLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBRUwsS0FBSyxNQUFNLE9BQU8sSUFBSSxXQUFXLEVBQUU7d0JBQ2xDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsS0FBSyxNQUFNLEtBQUssSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUN0RCx5REFBeUQ7eUJBQ3pEO3dCQUNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRTs0QkFDdEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7NEJBQzFCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDWDt3QkFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBRWI7aUJBQ0Q7Z0JBRUQsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQztZQUVGLElBQUksRUFBRSxDQUFDO1NBQ1A7UUFDRCxJQUFJO1FBQ0osNklBQTZJO1FBRTdJLG9CQUFvQjtRQUNwQiw4QkFBOEI7UUFDOUIsc0JBQXNCO1FBRXRCLGtEQUFrRDtRQUNsRCxzRUFBc0U7UUFDdEUsS0FBSztRQUVMLDREQUE0RDtRQUU1RCw2Q0FBNkM7UUFFN0MsaUJBQWlCO1FBQ2pCLG9CQUFvQjtRQUVwQixvQkFBb0I7UUFDcEIsMEJBQTBCO1FBQzFCLG1EQUFtRDtRQUNuRCxlQUFlO1FBQ2Ysb0JBQW9CO1FBRXBCLG9DQUFvQztRQUNwQyxJQUFJO0tBQ0o7QUFFRixDQUFDLENBQUMsRUFBRSxDQUFDIn0=