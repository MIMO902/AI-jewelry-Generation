// ✅ Completely restructured maskEditor.js with working red overlay and mask canvas

document.addEventListener("DOMContentLoaded", () => {
  const maskCanvas = document.getElementById("maskCanvas");
  const overlayCanvas = document.getElementById("overlayCanvas");
  const image = document.getElementById("modalImage");
  const promptInput = document.getElementById("editPrompt");
  const applyButton = document.getElementById("applyChanges");
  const redoButton = document.getElementById("redoMask");
  const endButton = document.getElementById("endMask");
  const startButton = document.getElementById("startMask");

  const maskCtx = maskCanvas.getContext("2d");
  const overlayCtx = overlayCanvas.getContext("2d");

  let drawing = false;
  let maskHistory = [];
  let currentStep = -1;
  let isMaskingEnabled = false;

  function initializeCanvas() {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    [maskCanvas, overlayCanvas].forEach(c => {
      c.width = width;
      c.height = height;
      c.style.width = image.width + "px";
      c.style.height = image.height + "px";
    });

    maskCtx.clearRect(0, 0, width, height);
    maskCtx.fillStyle = "#000000";
    maskCtx.fillRect(0, 0, width, height);

    overlayCtx.clearRect(0, 0, width, height);
  }

  function getMousePos(event) {
    const rect = maskCanvas.getBoundingClientRect();
    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function startDrawing(event) {
    if (!isMaskingEnabled) return;
    drawing = true;
    const pos = getMousePos(event);

    maskCtx.beginPath();
    maskCtx.moveTo(pos.x, pos.y);

    overlayCtx.beginPath();
    overlayCtx.moveTo(pos.x, pos.y);

    maskHistory = maskHistory.slice(0, currentStep + 1);
    maskHistory.push([{ x: pos.x, y: pos.y }]);
    currentStep++;
  }

  function draw(event) {
    if (!drawing || !isMaskingEnabled) return;
    const pos = getMousePos(event);

    maskCtx.lineTo(pos.x, pos.y);
    maskCtx.strokeStyle = "#FFFFFF";
    maskCtx.lineWidth = 50;
    maskCtx.lineCap = "round";
    maskCtx.stroke();

    overlayCtx.lineTo(pos.x, pos.y);
    overlayCtx.strokeStyle = "rgba(255, 0, 0, 0.3)";
    overlayCtx.lineWidth = 50;
    overlayCtx.lineCap = "round";
    overlayCtx.stroke();

    maskHistory[currentStep].push({ x: pos.x, y: pos.y });
  }

  function stopDrawing() {
    if (!drawing) return;
    drawing = false;
    maskCtx.closePath();
    overlayCtx.closePath();
  }

  function redo() {
    if (currentStep < maskHistory.length - 1) {
      currentStep++;
      redrawCanvas();
    }
  }

  function redrawCanvas() {
    const width = maskCanvas.width;
    const height = maskCanvas.height;

    maskCtx.clearRect(0, 0, width, height);
    maskCtx.fillStyle = "#000000";
    maskCtx.fillRect(0, 0, width, height);

    overlayCtx.clearRect(0, 0, width, height);

    for (let i = 0; i <= currentStep; i++) {
      const stroke = maskHistory[i];
      maskCtx.beginPath();
      overlayCtx.beginPath();

      stroke.forEach((point, index) => {
        if (index === 0) {
          maskCtx.moveTo(point.x, point.y);
          overlayCtx.moveTo(point.x, point.y);
        } else {
          maskCtx.lineTo(point.x, point.y);
          overlayCtx.lineTo(point.x, point.y);
        }
      });

      maskCtx.strokeStyle = "#FFFFFF";
      maskCtx.lineWidth = 50;
      maskCtx.lineCap = "round";
      maskCtx.stroke();

      overlayCtx.strokeStyle = "rgba(255, 0, 0, 0.3)";
      overlayCtx.lineWidth = 50;
      overlayCtx.lineCap = "round";
      overlayCtx.stroke();
    }
  }

  async function sendMask() {
    if (maskHistory.length === 0) {
      alert("Please draw a mask first!");
      return;
    }
    try {
      const canvasBlob = await new Promise(resolve => maskCanvas.toBlob(resolve, "image/png"));

      const originalPreview = document.getElementById("originalPreview");
      const maskPreview = document.getElementById("maskPreview");
      originalPreview.src = image.src;
      maskPreview.src = URL.createObjectURL(canvasBlob);

      const resizedImageBlob = await prepareImage(await fetch(image.src).then(r => r.blob()));
      const resizedMaskBlob = await prepareImage(canvasBlob);

      const formData = new FormData();
      formData.append('image', new File([resizedImageBlob], 'original.png', { type: 'image/png' }));
      formData.append('mask', new File([resizedMaskBlob], 'mask.png', { type: 'image/png' }));
      formData.append('prompt', promptInput.value);

      const response = await fetch('/user/inpaint', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (response.ok) {
        window.location.href = "/user/inpainted-home";
        return;
      }
    } catch (error) {
      console.error('Edit failed:', error);
      document.getElementById('editError').textContent = `Edit failed: ${error.message}`;
      document.getElementById('editError').style.display = 'block';
    }
  }

  async function prepareImage(blob) {
    return await resizeImageToDimensions(blob, 768, 1024);
  }

  async function resizeImageToDimensions(blob, width, height) {
    const img = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    return await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  }

  function enableMasking() {
    isMaskingEnabled = true;
    maskCanvas.style.pointerEvents = "auto";
    startButton.disabled = true;
    endButton.disabled = false;
  }

  function disableMasking() {
    isMaskingEnabled = false;
    drawing = false;
    maskCanvas.style.pointerEvents = "none";
    startButton.disabled = false;
    endButton.disabled = true;
  }

  startButton.addEventListener("click", enableMasking);
  endButton.addEventListener("click", disableMasking);
  redoButton.addEventListener("click", redo);
  applyButton.addEventListener("click", sendMask);

  maskCanvas.addEventListener("mousedown", startDrawing);
  maskCanvas.addEventListener("mousemove", draw);
  maskCanvas.addEventListener("mouseup", stopDrawing);
  maskCanvas.addEventListener("mouseleave", stopDrawing);

  image.onload = initializeCanvas;
  if (image.complete) initializeCanvas();
});