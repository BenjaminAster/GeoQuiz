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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGRNYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy93b3JsZE1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1g7UUFDQyx1QkFBdUI7UUFFdkIsTUFBTSxjQUFjLEdBQTBCLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUNoRSx5QkFBeUIsQ0FDekIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDO1FBRXBCLE1BQU0sTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFvQixRQUFRLENBQUMsQ0FBQztRQUN0RixNQUFNLEdBQUcsR0FBNkIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5RDtZQUNDLE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRTtnQkFDbkIsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDckMsQ0FBQyxDQUFDO1lBRUYsTUFBTSxFQUFFLENBQUM7WUFFVCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksTUFBTSxHQUFXLENBQUMsQ0FBQztRQUV2QixJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7UUFDeEIsSUFBSSxPQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFXLENBQUMsQ0FBQztRQUNyQixNQUFNLFlBQVksR0FBVyxHQUFHLENBQUM7UUFFakMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQWUsRUFBRSxFQUFFO1lBQzFELGFBQWE7WUFDYixNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNwQixhQUFhO1lBQ2IsTUFB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