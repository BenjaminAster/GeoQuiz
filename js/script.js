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
            let eventArray = [];
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
                window.addEventListener(eventName, (evt) => {
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