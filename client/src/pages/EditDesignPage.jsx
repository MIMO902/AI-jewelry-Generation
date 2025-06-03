import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const EditDesignPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const imageData = state?.imageData;

    const modalImageRef = useRef();
    const maskCanvasRef = useRef();
    const overlayCanvasRef = useRef();

    const [prompt, setPrompt] = useState('');
    const [isMasking, setIsMasking] = useState(false);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        if (modalImageRef.current?.complete) {
            initializeCanvas();
        }
    }, []);

    const initializeCanvas = () => {
        const image = modalImageRef.current;
        const maskCanvas = maskCanvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;

        if (!image || !maskCanvas || !overlayCanvas) return;

        const width = image.naturalWidth;
        const height = image.naturalHeight;

        [maskCanvas, overlayCanvas].forEach(c => {
            c.width = width;
            c.height = height;
            c.style.width = image.width + 'px';
            c.style.height = image.height + 'px';
        });

        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.fillStyle = '#000000'; // fill full black for mask
        maskCtx.fillRect(0, 0, width, height);

        // ✅ Clear overlay canvas so it stays transparent
        const overlayCtx = overlayCanvas.getContext('2d');
        overlayCtx.clearRect(0, 0, width, height);
    };


    const getMousePos = (event) => {
        const rect = maskCanvasRef.current.getBoundingClientRect();
        const scaleX = maskCanvasRef.current.width / rect.width;
        const scaleY = maskCanvasRef.current.height / rect.height;
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        if (!isMasking) return;
        setDrawing(true);
        const pos = getMousePos(e);
        const maskCtx = maskCanvasRef.current.getContext('2d');
        const overlayCtx = overlayCanvasRef.current.getContext('2d');

        maskCtx.beginPath();
        overlayCtx.beginPath();

        maskCtx.moveTo(pos.x, pos.y);
        overlayCtx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!drawing || !isMasking) return;

        const pos = getMousePos(e);
        const maskCtx = maskCanvasRef.current.getContext('2d');
        const overlayCtx = overlayCanvasRef.current.getContext('2d');

        maskCtx.lineTo(pos.x, pos.y);
        overlayCtx.lineTo(pos.x, pos.y);

        maskCtx.strokeStyle = '#FFFFFF';
        overlayCtx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        maskCtx.lineWidth = overlayCtx.lineWidth = 50;
        maskCtx.lineCap = overlayCtx.lineCap = 'round';

        maskCtx.stroke();
        overlayCtx.stroke();
    };

    const stopDrawing = () => {
        if (!drawing) return;
        setDrawing(false);
        maskCanvasRef.current.getContext('2d').closePath();
        overlayCanvasRef.current.getContext('2d').closePath();
    };

    const sendEdit = async () => {
        try {
            const imageBlob = await fetch(imageData).then(r => r.blob());
            const maskBlob = await new Promise(res => maskCanvasRef.current.toBlob(res, 'image/png'));

            const formData = new FormData();
            formData.append('image', imageBlob);
            formData.append('mask', maskBlob);
            formData.append('prompt', prompt);

            const response = await fetch('/user/inpaint', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                navigate('/user/inpainted-home');
            } else {
                alert('Edit failed.');
            }
        } catch (err) {
            console.error('Edit error:', err);
        }
    };

    if (!imageData) return <p>No image data found.</p>;

    return (
        <PageWrapper>
            <CanvasContainer>
                <img
                    ref={modalImageRef}
                    src={imageData}
                    alt="To Edit"
                    onLoad={initializeCanvas}
                />
                <canvas ref={overlayCanvasRef} />
                <canvas
                    ref={maskCanvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />
            </CanvasContainer>

            <ControlPanel>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the changes"
                />
                <button onClick={() => setIsMasking(true)}>Start Mask</button>
                <button onClick={() => setIsMasking(false)}>End Mask</button>
                <button onClick={sendEdit}>Apply Changes</button>
            </ControlPanel>
        </PageWrapper>
    );
};

export default EditDesignPage;

// Styled components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #111;
  color: white;
  height: 100vh;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: 20px auto;

  img,
  canvas {
    background-color: transparent;
    background: transparent;
    max-width: 768px;
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    position: relative;
    z-index: 0;
  }

  canvas:nth-child(2) {
    z-index: 1; /* overlayCanvas */
    pointer-events: none;
  }

  canvas:nth-child(3) {
    z-index: 2; /* maskCanvas */
    pointer-events: auto;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px;

  input {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #444;
    background: #222;
    color: white;
  }

  button {
    padding: 8px 14px;
    border-radius: 6px;
    background: gold;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
`;
