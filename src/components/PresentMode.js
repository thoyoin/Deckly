import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Stage, Layer, Text } from 'react-konva';

const PresentMode = () => {
    const { id } = useParams();
    const socketRef = useRef(null);
    const [slides, setSlides] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        socketRef.current = io('http://localhost:3001');
        socketRef.current.emit('join', id);

        socketRef.current.on('updateSlides', (incomingSlides) => {
            setSlides(incomingSlides);
            console.log('Received slides:', incomingSlides);
        });

        return () => {
        socketRef.current.disconnect();
        };
    }, [id]);

    useEffect(() => {
        const handleKey = (e) => {
        if (e.key === 'ArrowRight') {
            setCurrentSlideIndex((i) => Math.min(i + 1, slides.length - 1));
        } else if (e.key === 'ArrowLeft') {
            setCurrentSlideIndex((i) => Math.max(i - 1, 0));
        }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [slides]);

    const currentSlide = slides[currentSlideIndex];

    if (!slides.length) {
        console.warn('No slides received.');
        return (
          <div style={{ color: 'white', textAlign: 'center', paddingTop: '30vh' }}>
            Loading presentation...
          </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {currentSlide && (
            <div style={{ width: '90vw', maxWidth: '1920px', aspectRatio: '16 / 9', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <Stage width={1920} height={1080} style={{ width: '100%', height: '100%' }}>
                <Layer>
                {currentSlide.elements.map((el) => (
                    <Text
                    key={el.id}
                    text={el.text}
                    x={el.x}
                    y={el.y}
                    fontSize={el.fontSize}
                    fontFamily={el.fontFamily}
                    fontStyle={el.fontStyle}
                    fill="#000"
                    />
                ))}
                </Layer>
            </Stage>
            </div>
        )}
        </div>
    );
};

export default PresentMode;