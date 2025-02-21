import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import './scrollbar.css';
import CustomCursor from './CustomCursor';
import './cursor.css';

// Hardcoded Moodboard Component
const HardcodedMoodboard = () => {
  const images = [
    '/images/gab1.jpg',
    '/images/gab2.jpg',
    '/images/gab3.jpg',
    '/images/gab4.jpg',
    '/images/gab5.jpg',
    '/images/gab6.jpg',
    '/images/gab7.jpg',
    '/images/gab8.jpg',
    '/images/gab9.jpg',
    '/images/gab10.jpg',
    '/images/gab11.jpg',
    '/images/gab12.jpg',
    '/images/gab13.jpg',
    '/images/gab14.jpg',
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-96">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff66b2', marginBottom: '16px', textAlign: 'center' }}>(っ◔◡◔)っ ♥ gabriette ♥</h2>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative group overflow-hidden rounded-lg border-2 border-pink-300"
          >
            <img 
              src={image}
              alt={`Moodboard item ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Original MoodboardImage Component
const MoodboardImage = ({ image, onUpdate }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, action) => {
    e.stopPropagation();
    if (action === 'drag') setIsDragging(true);
    if (action === 'resize') setIsResizing(true);
    setDragStart({
      x: e.clientX - (action === 'drag' ? position.x : size.width),
      y: e.clientY - (action === 'drag' ? position.y : size.height)
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
    if (isResizing) {
      const newWidth = e.clientX - dragStart.x;
      const newHeight = e.clientY - dragStart.y;
      setSize({
        width: Math.max(50, newWidth),
        height: Math.max(50, newHeight)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  return (
    <div
      style={{
        ...styles.imageContainer,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
    >
      <img
        src={image}
        alt="Moodboard item"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <div
        style={styles.resizeHandle}
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
      />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffecf5',
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    cursor: 'none',
    display: 'flex',  
    justifyContent: 'center',  
    alignItems: 'center', 
    userSelect: 'none',
  },
  hardcodedMoodboard: {
    position: 'absolute',
    right: '-2500px',
    top: '-1250px',
  },
  brainDump: {
    width: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
  },
  moodboard: {
    width: '1600px',
    height: '900px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    overflow: 'hidden',
    left: '-2500px',  
    top: '-1250px' 
  },
  uploadButton: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: '#ff66b2',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '2px solid white'
  },
  imageContainer: {
    position: 'absolute',
    cursor: 'move',
    border: '2px solid #ff66b2',
    borderRadius: '4px'
  },
  resizeHandle: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: '#ff66b2',
    cursor: 'nw-resize',
    borderRadius: '50%'
  },
  hiddenInput: {
    display: 'none'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ff66b2',
    marginBottom: '16px',
    textAlign: 'center'
  },
  scrollArea: {
    height: '400px',
    overflowY: 'auto',
    backgroundColor: '#fff0f7',
    borderRadius: '8px',
    padding: '16px',
    userSelect: 'text'
  },
  post: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #ffd1dc'
  },
  postText: {
    color: '#4a4a4a'
  }
};

const NonsauceIndex = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);

  const dummyPosts = [
    {
      id: 1,
      content: "✧･ﾟ welcome to my little braindump website! there's no theme here, just vibes~ a place where i share things i'm working on & a general creative outlet ♡(◡‿◡✿)"
    },
    {
      id: 2,
      content: "✧･ﾟ feel free to zoom out and drag around to different sections! ೀ⋆｡˚"
    },
    {
      id: 3,
      content: "✧･ﾟ more things to come in the future ♥︎"
    }
  ];

  const handleMouseDown = (e) => {
    if (e.target.closest('.scroll-area') || e.target.closest('.moodboard')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.target.closest('.scroll-area') || e.target.closest('.moodboard')) return;
    
    e.preventDefault();
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const contentRect = contentRef.current.getBoundingClientRect();
    const contentX = contentRect.left;
    const contentY = contentRect.top;
    const mouseContentX = mouseX - contentX;
    const mouseContentY = mouseY - contentY;
    
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    
    setScale(prevScale => {
      const newScale = Math.min(Math.max(0.1, prevScale + delta), 2);
      const scaleChange = newScale - prevScale;
      const positionDeltaX = mouseContentX * scaleChange;
      const positionDeltaY = mouseContentY * scaleChange;
      
      setPosition(prevPos => ({
        x: prevPos.x - positionDeltaX,
        y: prevPos.y - positionDeltaY
      }));
      
      return newScale;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages([...images, e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  
    const handleResize = () => {
      if (!isDragging) {
        setPosition({ x: 0, y: 0 });
      }
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDragging, dragStart]);

  return (
    <>
      <CustomCursor />
      <div 
        className="custom-cursor"
        style={styles.container}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div 
          ref={contentRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div style={styles.brainDump}>
            <h1 style={styles.title}>
              ˚₊· ͟͟͞͞➳❥ my digital space ⋆｡°✩
            </h1>
            
            <div 
              className="scroll-area y2k-scrollbar custom-cursor"
              style={styles.scrollArea}
            >
              {dummyPosts.map((post) => (
                <div 
                  key={post.id}
                  style={styles.post}
                >
                  <p style={styles.postText}>{post.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.hardcodedMoodboard}>
            <HardcodedMoodboard />
          </div>

          <div style={styles.moodboard} className="moodboard custom-cursor">
            {images.map((image, index) => (
              <MoodboardImage
                key={index}
                image={image}
              />
            ))}
            <button
              style={{
                ...styles.uploadButton,
                cursor: 'none'
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <Upload size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={styles.hiddenInput}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NonsauceIndex;