import { test } from "./test.js";
console.log(1);
console.log(test);
navigator.serviceWorker.register("./service-worker.js", { scope: "./", type: "module" });
(async () => {
    {
        // country borders test
        const countryBorders = (await (await fetch("./data/borders.min.json")).json()).features;
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
        window.addEventListener("pointermove", (evt) => {
            // @ts-ignore
            mouseX = evt.layerX;
            // @ts-ignore
            mouseY = evt.layerY;
            if (evt.buttons === 1) {
                centerX -= (evt.movementX / (canvas.width / 2)) / ((scalePerZoom ** zoom) / 180);
                centerY += (evt.movementY / (canvas.height / 2)) / ((canvas.width / canvas.height) * (scalePerZoom ** zoom) / 180);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbEIsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRXpGLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFFWDtRQUNDLHVCQUF1QjtRQUV2QixNQUFNLGNBQWMsR0FBMEIsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQ2hFLHlCQUF5QixDQUN6QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQW9CLFFBQVEsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sR0FBRyxHQUE2QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlEO1lBQ0MsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUNuQixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUNyQyxDQUFDLENBQUM7WUFFRixNQUFNLEVBQUUsQ0FBQztZQUVULE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLElBQUksT0FBTyxHQUFXLENBQUMs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