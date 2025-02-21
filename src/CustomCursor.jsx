import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e) => {
      setClicked(true);
      createSparkles(e);
      setTimeout(() => setClicked(false), 500);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const createSparkles = (e) => {
    const sparkleCount = 8;
    const newSparkles = [];
    
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i * 360) / sparkleCount;
      const id = `sparkle-${Date.now()}-${i}`;
      
      newSparkles.push({
        id,
        x: e.clientX,
        y: e.clientY,
        angle,
      });
    }
    
    setSparkles([...sparkles, ...newSparkles]);
    
    // Remove sparkles after animation
    setTimeout(() => {
      setSparkles(current => current.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 700);
  };

  return (
    <>
      <div
        className={`cursor-dot ${clicked ? 'clicked' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            transform: `rotate(${sparkle.angle}deg)`,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;