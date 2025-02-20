import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#ffecf5',
    overflow: 'hidden',
    cursor: 'move',
    display: 'flex',  // Add this
    justifyContent: 'center',  // Add this
    alignItems: 'center'  // Add this
  },
  draggableContent: {
    position: 'absolute',
    transformOrigin: 'center',
    display: 'flex',
    gap: '900px'
  },
  mainContent: {
    width: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  },
  moodboard: {
    width: '1600px',
    height: '900px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '-900px' 
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
    bottom: '0',
    right: '0',
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
    padding: '16px'
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

const NonsauceIndex = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false); // if user is dragging or not
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); //stores initial coordinates when a drag operation begins
  const [scale, setScale] = useState(1); //tracks zoom level of the content, starting at 100%
  const [images, setImages] = useState([]); //stores an array of uploaded images
  const fileInputRef = useRef(null); //ref to access file input
  const contentRef = useRef(null); // ref to access content elements

  // create an array of 20 dummy posts for brain dump
  const dummyPosts = Array(20).fill(null).map((_, i) => ({
    id: i,
    content: `✧･ﾟ Post ${i + 1}: Just adding some cute content here! Working on my latest project and feeling super inspired! Can't wait to share more! ♡(◡‿◡✿) ✧･ﾟ`
  }));

  const handleMouseDown = (e) => {
    if (e.target.closest('.scroll-area') || e.target.closest('.moodboard')) return; //ignores if clicking within scroll-area in brain dump or if on the moodboard
    setIsDragging(true); // sets dragging to true
    console.log('dragging!');
    setDragStart({ // records starting position of the drag operation
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return; // updates position while mouse is moving
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false); // stops dragging operation when mouse click is released
  };

  const handleWheel = (e) => {
    if (e.target.closest('.scroll-area') || e.target.closest('.moodboard')) {
      return;
    }
    
    e.preventDefault();
    
    // Get mouse position relative to viewport
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Get current position of content relative to viewport
    const contentRect = contentRef.current.getBoundingClientRect();
    const contentX = contentRect.left;
    const contentY = contentRect.top;
    
    // Calculate mouse position relative to content
    const mouseContentX = mouseX - contentX;
    const mouseContentY = mouseY - contentY;
    
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    
    setScale(prevScale => {
      const newScale = Math.min(Math.max(0.1, prevScale + delta), 2);
      
      // Calculate position adjustment to keep mouse point steady
      const scaleChange = newScale - prevScale;
      const positionDeltaX = mouseContentX * scaleChange;
      const positionDeltaY = mouseContentY * scaleChange;
      
      // Update position to compensate for zoom
      setPosition(prevPos => ({
        x: prevPos.x - positionDeltaX,
        y: prevPos.y - positionDeltaY
      }));
      
      return newScale;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) { //checks if file is an image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages([...images, e.target.result]); // adds new image to image array
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  
    const handleResize = () => {
      if (!isDragging) {
        setPosition({
          x: 0,
          y: 0
        });
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
    <div 
      style={styles.container}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      <div 
        style={{
          ...styles.draggableContent,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <div style={styles.moodboard} className="moodboard">
          {images.map((image, index) => (
            <MoodboardImage
              key={index}
              image={image}
            />
          ))}
          <button
            style={styles.uploadButton}
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

        <div style={styles.mainContent}>
          <h1 style={styles.title}>
            ˚₊· ͟͟͞͞➳❥ brain dump ⋆｡°✩
          </h1>
          
          <div 
            ref={contentRef}
            className="scroll-area"
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
      </div>
    </div>
  );
  
};

export default NonsauceIndex;