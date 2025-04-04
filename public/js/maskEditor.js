document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("maskCanvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("modalImage");
    const promptInput = document.getElementById("editPrompt");
    const applyButton = document.getElementById("applyChanges");
    const redoButton = document.getElementById("redoMask");
    const endButton = document.getElementById("endMask");
    const startButton = document.getElementById("startMask");

    let drawing = false;
    let maskData = [];

    function resizeCanvas() {
        canvas.width = image.clientWidth;
        canvas.height = image.clientHeight;
    }

    function startDrawing(event) {
        drawing = true;
        const { offsetX, offsetY } = getMousePos(event);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        maskData.push([]);
    }

    function draw(event) {
        if (!drawing) return;
        const { offsetX, offsetY } = getMousePos(event);
        ctx.lineTo(offsetX, offsetY);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.stroke();
        maskData[maskData.length - 1].push({ x: offsetX, y: offsetY });
    }

    function stopDrawing() {
        drawing = false;
        ctx.closePath();
    }

    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };
    }

    function redoLastMask() {
        if (maskData.length > 0) {
            maskData.pop();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            redrawMask();
        }
    }

    function redrawMask() {
        maskData.forEach(stroke => {
            ctx.beginPath();
            stroke.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
            ctx.lineWidth = 20;
            ctx.lineCap = "round";
            ctx.stroke();
        });
    }

    function sendMask() {
        const maskImage = canvas.toDataURL("image/png");
        const originalImage = image.src;
        const prompt = promptInput.value;

        fetch("/user/inpaint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: originalImage, mask: maskImage, prompt })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                image.src = data.newImage;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        })
        .catch(error => console.error("Error:", error));
    }

    function enableMasking() {
        canvas.style.pointerEvents = "auto";
    }

    function disableMasking() {
        canvas.style.pointerEvents = "none";
    }

    startButton.addEventListener("click", enableMasking);
    redoButton.addEventListener("click", redoLastMask);
    endButton.addEventListener("click", disableMasking);
    applyButton.addEventListener("click", sendMask);

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    image.addEventListener("dragstart", event => event.preventDefault());

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
});
