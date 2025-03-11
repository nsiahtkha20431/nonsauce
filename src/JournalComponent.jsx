import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Edit, Save, Trash } from 'lucide-react';

const JournalComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const journalRef = useRef(null);
  
  // Sample initial journal entries
  const [journalEntries, setJournalEntries] = useState([
    {
      id: 1,
      date: "2025/02/20",
      title: "☆彡 my first entry! ☆彡",
      content: "started working on my digital space today~ so excited to have a place to share all my thoughts and inspirations! (─‿‿─) ♡"
    },
    {
      id: 2,
      date: "2025/02/21",
      title: "✧･ﾟ today's vibes ✧･ﾟ",
      content: "found the cutest platform boots online today! they remind me of the ones gabriette wore in her latest post. might have to save up for them... ⋆₊✪͡◡ू✪͡"
    },
    {
      id: 3,
      date: "2025/02/22",
      title: "⋆˙⟡♡ design inspo ♡⟡˙⋆",
      content: "working on updating my moodboards today. been really into y2k aesthetics lately, especially the soft pink cyber pixie vibe. adding more stuff to my heike collection too!"
    },
    {
      id: 4,
      date: "2025/02/23",
      title: "✩°｡⋆⸜ music & coding ⸝⋆｡°✩",
      content: "listened to charli xcx's new album while coding today. getting better at react! this journal component was actually pretty challenging but i'm proud of how it turned out!"
    }
  ]);
  
  // Simple open/close toggle that definitely works
  const toggleJournal = () => {
    console.log("Toggling journal, current state:", isOpen);
    setIsOpen(!isOpen);
  };
  
  // Simple direct open/close functions
  const openJournal = () => {
    console.log("Opening journal");
    setIsOpen(true);
    setCurrentPage(0);
    setIsEditing(false);
  };
  
  const closeJournal = () => {
    console.log("Closing journal");
    setIsOpen(false);
  };
  
  const turnPageForward = () => {
    if (isEditing || isPageTurning || currentPage >= Math.ceil(journalEntries.length / 2) - 1) return;
    
    setIsPageTurning(true);
    setTimeout(() => {
      setCurrentPage(currentPage + 1);
      setIsPageTurning(false);
    }, 500);
  };
  
  const turnPageBackward = () => {
    if (isEditing || isPageTurning || currentPage <= 0) return;
    
    setIsPageTurning(true);
    setTimeout(() => {
      setCurrentPage(currentPage - 1);
      setIsPageTurning(false);
    }, 500);
  };

  // Add a new journal entry
  const addNewEntry = () => {
    // Format today's date
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    
    const newEntry = {
      id: Date.now(), // Use timestamp as unique ID
      date: formattedDate,
      title: "✧･ﾟ new entry ✧･ﾟ",
      content: ""
    };
    
    setJournalEntries([...journalEntries, newEntry]);
    
    // Navigate to the new entry's page
    const newPageIndex = Math.floor(journalEntries.length / 2);
    setCurrentPage(newPageIndex);
    
    // Start editing the new entry
    setEditingEntry(newEntry);
    setIsEditing(true);
  };
  
  // Edit an existing entry
  const startEditing = (entry) => {
    if (isEditing) return;
    setEditingEntry({...entry});
    setIsEditing(true);
  };
  
  // Save the edited entry
  const saveEntry = () => {
    if (!editingEntry) return;
    
    const updatedEntries = journalEntries.map(entry => 
      entry.id === editingEntry.id ? editingEntry : entry
    );
    
    setJournalEntries(updatedEntries);
    setIsEditing(false);
    setEditingEntry(null);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingEntry(null);
  };
  
  // Delete an entry
  const deleteEntry = (entryId) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== entryId);
    setJournalEntries(updatedEntries);
    
    // Adjust current page if needed
    const newTotalPages = Math.ceil(updatedEntries.length / 2);
    if (currentPage >= newTotalPages) {
      setCurrentPage(Math.max(0, newTotalPages - 1));
    }
    
    setIsEditing(false);
    setEditingEntry(null);
  };
  
  // Handle input changes for editing
  const handleInputChange = (field, value) => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      [field]: value
    });
  };
  
  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);
  
  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }
  }, []);
  
  // Get entries for current spread (2 pages)
  const getCurrentEntries = () => {
    const startIdx = currentPage * 2;
    return [
      journalEntries[startIdx],
      journalEntries[startIdx + 1]
    ];
  };
  
  const currentEntries = getCurrentEntries();
  
  const journalStyles = {
    container: {
      position: 'absolute',
      left: '1000px',
      top: '1300px',
      zIndex: 1000,
    },
    closedJournal: {
      width: '300px',
      height: '400px',
      backgroundColor: '#ff96c8',
      borderRadius: '5px 15px 15px 5px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2), -5px 0 10px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      position: 'relative',
      transform: 'rotate(-5deg)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: '1px solid #ffb0d8',
      overflow: 'hidden',
    },
    closedJournalHover: {
      transform: 'rotate(-3deg) translateY(-5px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25), -8px 0 15px rgba(0, 0, 0, 0.15)',
    },
    journalCover: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(145deg, #ff96c8 0%, #ff66b2 100%)',
      borderRadius: '5px 15px 15px 5px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    journal: {
      display: isOpen ? 'flex' : 'none',
      width: '600px',
      height: '400px',
      position: 'absolute',
      top: '0',
      left: '-225px',
      transformOrigin: 'center center',
      transition: 'transform 0.5s ease',
      transform: isPageTurning ? 'rotate3d(0, 1, 0, 15deg)' : 'rotate3d(0, 1, 0, 0deg)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      borderRadius: '5px 15px 15px 5px',
      overflow: 'hidden',
    },
    journalBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to right, #ffd1eb, #ffecf5)',
      zIndex: -1,
    },
    journalBinding: {
      position: 'absolute',
      left: '50%',
      top: 0,
      width: '20px',
      height: '100%',
      background: 'linear-gradient(to right, #ff9ed2, #ff66b2, #ff9ed2)',
      transform: 'translateX(-50%)',
      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)',
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '30px 0',
    },
    journalRing: {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      backgroundColor: 'white',
      border: '1px solid #ff66b2',
      boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.2)',
    },
    coverRing: {
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      backgroundColor: 'white',
      border: '1px solid #ff66b2',
      boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.2)',
    },
    coverBinding: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '25px',
      height: '100%',
      background: 'linear-gradient(to right, #ff66b2, #ff9ed2)',
      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2), 5px 0 5px -5px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '40px 0',
    },
    coverText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '20px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
      transform: 'rotate(90deg)',
      position: 'absolute',
      top: '50%',
      left: '8px',
      letterSpacing: '2px'
    },
    coverTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      marginBottom: '15px',
    },
    coverDecoration: {
      position: 'absolute',
      fontSize: '32px',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    coverHeart1: {
      top: '40px',
      right: '40px',
    },
    coverHeart2: {
      bottom: '40px',
      left: '80px',
    },
    coverStar1: {
      top: '80px',
      left: '80px',
    },
    coverStar2: {
      bottom: '80px',
      right: '55px',
    },
    pagesContainer: {
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    pageLeft: {
      width: '50%',
      height: '100%',
      padding: '30px 30px 30px 40px',
      boxSizing: 'border-box',
      background: 'linear-gradient(to right, #ffd1eb80, #ffd1eb)',
      borderRight: '1px solid #ffb0d8',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'inset -5px 0 10px rgba(0, 0, 0, 0.05)',
      cursor: !isEditing && currentPage > 0 ? 'pointer' : 'default',
    },
    pageRight: {
      width: '50%',
      height: '100%',
      padding: '30px 40px 30px 30px',
      boxSizing: 'border-box',
      background: 'linear-gradient(to left, #ffd1eb80, #ffd1eb)',
      borderLeft: '1px solid #ffb0d8',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'inset 5px 0 10px rgba(0, 0, 0, 0.05)',
      cursor: !isEditing && currentPage < Math.ceil(journalEntries.length / 2) - 1 ? 'pointer' : 'default',
    },
    pageNumber: {
      position: 'absolute',
      bottom: '15px',
      fontSize: '12px',
      color: '#ff66b2',
      fontStyle: 'italic',
    },
    leftPageNumber: {
      left: '20px',
    },
    rightPageNumber: {
      right: '20px',
    },
    date: {
      fontSize: '12px',
      color: '#ff66b2',
      marginBottom: '10px',
      fontFamily: 'monospace',
    },
    title: {
      fontSize: '18px',
      color: '#ff66b2',
      marginBottom: '15px',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    content: {
      fontSize: '14px',
      color: '#4a4a4a',
      lineHeight: '1.5',
      flexGrow: 1,
    },
    pageLines: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      pointerEvents: 'none',
    },
    emptyPage: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#ffb0d8',
      fontStyle: 'italic',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#ff66b2',
      color: 'white',
      border: '2px solid white',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
    },
    pageDecoration: {
      position: 'absolute',
      fontSize: '20px',
      color: '#ffb0d880',
      pointerEvents: 'none',
    },
    decoration1: {
      top: '15px',
      right: '15px',
    },
    decoration2: {
      bottom: '15px',
      left: '15px',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      zIndex: 100,
    },
    actionButton: {
      backgroundColor: '#ff66b2',
      color: 'white',
      border: '2px solid white',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    },
    editButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#ff66b2',
      color: 'white',
      border: '2px solid white',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      opacity: 1,
    },
    input: {
      width: '100%',
      padding: '5px 8px',
      border: '1px solid #ffb0d8',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      color: '#4a4a4a',
      marginBottom: '10px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ffb0d8',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      color: '#4a4a4a',
      marginBottom: '10px',
      boxSizing: 'border-box',
      resize: 'none',
      flexGrow: 1,
      fontFamily: 'inherit',
    },
    deleteButton: {
      backgroundColor: '#ff4477',
      color: 'white',
      border: '2px solid white',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    },
    iconContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  };

  // Handle click outside to close journal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (journalRef.current && !journalRef.current.contains(event.target) && isOpen) {
        closeJournal();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // SVG for lined paper effect
  const LinedPaper = () => (
    <svg style={journalStyles.pageLines} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="linePattern" width="100%" height="30" patternUnits="userSpaceOnUse">
          <line x1="0" y1="29" x2="100%" y2="29" stroke="#ffb0d850" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#linePattern)" />
    </svg>
  );

  // Render entry in view mode
  const renderViewEntry = (entry, handleEdit) => {
    if (!entry) return <div style={journalStyles.emptyPage}>~ this page is blank ~</div>;
    
    return (
      <>
        <div style={journalStyles.date}>{entry.date}</div>
        <div style={journalStyles.title}>{entry.title}</div>
        <div style={journalStyles.content}>{entry.content}</div>
        {handleEdit && (
          <button 
            style={journalStyles.editButton} 
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(entry);
            }}
            title="Edit Entry"
          >
            <div style={journalStyles.iconContainer}>
              <Edit size={16} color="white" strokeWidth={2.5} />
            </div>
          </button>
        )}
        <div style={{...journalStyles.pageDecoration, ...journalStyles.decoration1}}>✿</div>
        <div style={{...journalStyles.pageDecoration, ...journalStyles.decoration2}}>♡</div>
      </>
    );
  };

  // Render entry in edit mode
  const renderEditEntry = (entry) => {
    if (!entry) return null;
    
    return (
      <>
        <input
          type="text"
          style={journalStyles.input}
          value={entry.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          placeholder="Date (YYYY/MM/DD)"
        />
        <input
          type="text"
          style={{...journalStyles.input, ...journalStyles.title, textAlign: 'left'}}
          value={entry.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Entry Title"
        />
        <textarea
          style={journalStyles.textarea}
          value={entry.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Write your thoughts here..."
        />
        <div style={journalStyles.buttonContainer}>
          <button 
            style={journalStyles.actionButton} 
            onClick={saveEntry}
            title="Save"
          >
            <div style={journalStyles.iconContainer}>
              <Save size={18} color="white" />
            </div>
          </button>
          <button 
            style={journalStyles.deleteButton} 
            onClick={() => deleteEntry(entry.id)}
            title="Delete"
          >
            <div style={journalStyles.iconContainer}>
              <Trash size={18} color="white" />
            </div>
          </button>
          <button 
            style={journalStyles.actionButton} 
            onClick={cancelEditing}
            title="Cancel"
          >
            <div style={journalStyles.iconContainer}>
              <X size={18} color="white" />
            </div>
          </button>
        </div>
      </>
    );
  };

  return (
    <div style={journalStyles.container}>
      {/* Display closed journal when not open */}
      {!isOpen && (
        <div 
          style={{
            ...journalStyles.closedJournal,
            ...(isHovering ? journalStyles.closedJournalHover : {})
          }}
          onClick={openJournal}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div style={journalStyles.journalCover}>
            <div style={journalStyles.coverBinding}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={journalStyles.coverRing}></div>
              ))}
            </div>
            <div style={journalStyles.coverTitle}>
              my journal ♡
            </div>
            <span style={{...journalStyles.coverDecoration, ...journalStyles.coverHeart1}}>♡</span>
            <span style={{...journalStyles.coverDecoration, ...journalStyles.coverHeart2}}>♡</span>
            <span style={{...journalStyles.coverDecoration, ...journalStyles.coverStar1}}>✧</span>
            <span style={{...journalStyles.coverDecoration, ...journalStyles.coverStar2}}>✧</span>
          </div>
        </div>
      )}
      
      {/* Open journal */}
      {isOpen && (
        <div 
          ref={journalRef}
          style={journalStyles.journal}
        >
          <div style={journalStyles.journalBackground}></div>
          
          <div style={journalStyles.journalBinding}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={journalStyles.journalRing}></div>
            ))}
          </div>
          
          <button 
            style={journalStyles.closeButton} 
            onClick={closeJournal}
          >
            <div style={journalStyles.iconContainer}>
              <X size={16} color="white" />
            </div>
          </button>
          
          <div style={journalStyles.pagesContainer}>
            {/* Left Page */}
            <div 
              style={journalStyles.pageLeft}
              onClick={!isEditing ? turnPageBackward : undefined}
            >
              <LinedPaper />
              
              {isEditing && editingEntry && currentEntries[0] && editingEntry.id === currentEntries[0].id ? (
                renderEditEntry(editingEntry)
              ) : (
                renderViewEntry(currentEntries[0], (entry) => startEditing(entry))
              )}
              
              <div style={{...journalStyles.pageNumber, ...journalStyles.leftPageNumber}}>
                {currentPage * 2 + 1}
              </div>
            </div>
            
            {/* Right Page */}
            <div 
              style={journalStyles.pageRight}
              onClick={!isEditing ? turnPageForward : undefined}
            >
              <LinedPaper />
              
              {isEditing && editingEntry && currentEntries[1] && editingEntry.id === currentEntries[1].id ? (
                renderEditEntry(editingEntry)
              ) : (
                renderViewEntry(currentEntries[1], (entry) => startEditing(entry))
              )}
              
              <div style={{...journalStyles.pageNumber, ...journalStyles.rightPageNumber}}>
                {currentPage * 2 + 2}
              </div>
            </div>
          </div>
          
          {/* Add New Entry Button */}
          {!isEditing && (
            <button
              style={{
                ...journalStyles.actionButton,
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                zIndex: 100,
              }}
              onClick={addNewEntry}
              title="Add New Entry"
            >
              <div style={journalStyles.iconContainer}>
                <Plus size={20} color="white" />
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JournalComponent;