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
        {
            const resize = () => {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            };
            resize();
            window.addEventListener("resize", resize);
        }
        let mouseX = 0;
        let mouseY = 0;
        let centerX = 0;
        let centerY = 0;
        let zoom = 0;
        const scalePerZoom = 1.5;
        window.addEventListener("mousemove", (evt) => {
            // @ts-ignore
            mouseX = evt.layerX;
            // @ts-ignore
            mouseY = evt.layerY;
        });
        window.addEventListener("wheel", (evt) => {
            // @ts-ignore
            const [x, y] = [evt.layerX, evt.layerY];
            const pointX = (x / (canvas.width / 2) - 1) / ((scalePerZoom ** zoom) / 180) + centerX;
            const pointY = (y / (canvas.height / 2) - 1) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180) + centerY;
            const delta = evt.deltaY / 100;
            zoom -= delta;
            centerX = pointX - (pointX - centerX) * (scalePerZoom ** delta);
            centerY = pointY - (pointY - centerY) * (scalePerZoom ** delta);
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
                        // @ ts-ignore
                        for (const [x, y] of polygon[0]) {
                            ctx.lineTo(((x - centerX) * (scalePerZoom ** zoom) / 180 + 1) * canvas.width / 2, ((y - centerY) * (canvas.width / canvas.height) * (scalePerZoom ** zoom) / -180 + 1) * canvas.height / 2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFHbEIsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUVYO1FBQ0MsdUJBQXVCO1FBRXZCLE1BQU0sY0FBYyxHQUEwQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUs7UUFDaEUscUZBQXFGO1FBQ3JGLHlCQUF5QixDQUN6QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQW9CLFFBQVEsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sR0FBRyxHQUE2QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlEO1lBQ0MsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUNuQixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUNyQyxDQUFDLENBQUM7WUFFRixNQUFNLEVBQUUsQ0FBQztZQUVULE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLElBQUksT0FBTyxHQUFXLENBQUMsQ0FBQztRQUN4QixJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7UUFDeEIsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sWUFBWSxHQUFXLEdB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