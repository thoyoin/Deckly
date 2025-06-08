import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Stage, Layer, Text, Rect } from 'react-konva';
import { useNavigate } from 'react-router-dom';


const Presentation = () => {
    const { id } = useParams();
    
    const [slides, setSlides] = useState([{ id: Date.now(), elements: [] }]);
    const [users, setUsers] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [editingText, setEditingText] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [textareaStyle, setTextareaStyle] = useState({});
    const [fontFamily, setFontFamily] = useState('Arial');
    const [showTextOptions, setShowTextOptions] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [fontSize, setFontSize] = useState(24);
    const [selectedId, setSelectedId] = useState(null);
    const [myRole, setMyRole] = useState('viewer');
    
    const [stageScale, setStageScale] = useState({ x: 1, y: 1 });
    
    const textOptionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (textOptionsRef.current && !textOptionsRef.current.contains(event.target)) {
            setShowTextOptions(false);
            }
        };
        if (showTextOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTextOptions]);

    useEffect(() => {
        const updateScale = () => {
            const container = document.getElementById('presentation-container');
            if (container) {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                const scaleX = width / 1920;
                const scaleY = height / 1080;
                setStageScale({ x: scaleX, y: scaleY });
            }
        };
        
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);
    
    const navigate = useNavigate();

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
            transports: ['polling', 'websocket']
          });
    
        socketRef.current.on('roomNotFound', () => {
            alert('Комната с таким ID не найдена!');
            navigate('/'); 
        });

        socketRef.current.on('updateSlides', (incomingSlides) => {
            setSlides(incomingSlides);
            if (incomingSlides[currentSlideIndex] === undefined) {
                setCurrentSlideIndex(Math.max(0, incomingSlides.length - 1));
            }
        });
        
        socketRef.current.on('connect', () => {
            const storedNickname = localStorage.getItem('nickname');
            if (storedNickname) {
                socketRef.current.emit('join', id, storedNickname);
            }
        });

        socketRef.current.on('usersUpdate', (updatedUsers) => {
            console.log('👥 usersUpdate:', updatedUsers);
            setUsers(updatedUsers);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [id]);

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        const me = users.find((u) => u.name === storedNickname);
        if (me) {
            setMyRole(me.role);
        }
    }, [users]);

    const broadcastSlides = (updatedSlides) => {
        setSlides(updatedSlides);
        if (socketRef.current) {
            socketRef.current.emit('updateSlides', { id, slides: updatedSlides });
        }
    };

    const addTextBlock = () => {
        if (myRole === 'viewer') return;
        const newText = {
            id: Date.now(),
            x: 100,
            y: 100,
            text: 'New Text',
            fontSize,
            fontFamily,
            fontStyle: `${isItalic ? 'italic' : 'normal'} ${isBold ? 'bold' : 'normal'}`
        };
        const newSlides = [...slides];
        newSlides[currentSlideIndex].elements.push(newText);
        broadcastSlides(newSlides);
    };

    const updatePosition = (id, x, y) => {
        if (myRole === 'viewer') return;
        const newSlides = [...slides];
        newSlides[currentSlideIndex].elements = newSlides[currentSlideIndex].elements.map(el =>
            el.id === id ? { ...el, x, y } : el
        );
        broadcastSlides(newSlides);
    };

    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return null;
    return (
            <div className='d-flex flex-column' style={{background:'#f8f9fa', height: '100vh', overflow: 'hidden'}}>
                <style>
                    {`
                      .modal-backdrop.show {
                        background-color: rgba(0, 0, 0, 0.1); /* lighter than default */
                      }
                    `}
                </style>
                <div style={{ top: '0px', zIndex: '5', background: '#f8f9fa', height: '60px' }} className='mb-0 p-2 px-4 text w-100 d-flex flex-row justify-content-between align-items-center'>
                    <div>
                        <button type="button" className="btn btn-danger rounded-3 px-2 py-1" style={{height:'30px'}} onClick={() => navigate('/')}><i className="bi bi-house"></i></button>
                    </div>
                        <div className='mx-auto d-flex flex-row justify-content-center'>
                            <div className="position-relative" ref={textOptionsRef}>
                                <button
                                    type="button"
                                    className="btn btn-light d-inline-flex flex-column align-items-center me-2 fw-light"
                                    style={{ width: '50px' }}
                                    onClick={() => setShowTextOptions(!showTextOptions)}
                                >
                                    <i className="bi bi-textarea-t"></i>
                                    Text
                                </button>
                                {showTextOptions && (
                                <div className="position-absolute bg-white border p-2 rounded" style={{ top: '110%', width:'80px', left: -14, zIndex: 10 }}>
                                    <div className="d-flex gap-2 mb-2 align-items-center justify-content-center">
                                        <button
                                        style={{width:'25px'}}
                                        type="button"
                                        className={`btn btn-sm border fw-bold ${isBold ? 'btn-dark text-white' : 'btn-light'}`}
                                        data-bs-toggle="button"
                                        aria-pressed="true"
                                        onClick={() => setIsBold(prev => !prev)}
                                        >B</button>
                                        <button
                                        style={{width:'25px'}}
                                        type="button"
                                        className={`btn btn-sm border fst-italic ${isItalic ? 'btn-dark text-white' : 'btn-light'}`}
                                        onClick={() => setIsItalic(prev => !prev)}
                                        >I</button>
                                    </div>
                                    <select className="form-select form-select-sm" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
                                        {[12, 16, 24, 32, 48, 64].map(size => (
                                        <option key={size} value={size}>{size}px</option>
                                        ))}
                                    </select>
                                    <button className="btn w-100 mt-2" onClick={() => {
                                        addTextBlock();
                                        setShowTextOptions(false);
                                    }}>Add</button>
                                </div>
                              )}
                            </div>
                        </div>
                        <button type="button" className="btn btn-light rounded-3 px-2 py-1 me-3" style={{height:'30px'}} onClick={() => navigate(`/present/${id}`)}><i className="bi bi-tv me-2"></i>Play</button>
                        <button type="button" className="btn btn-danger rounded-3 px-2 py-1" style={{height:'30px'}} data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i className="bi bi-person-plus me-2"></i>Share</button>
                </div>
                <div className="modal fade" id="staticBackdrop" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 fw-bold" id="staticBackdropLabel">Provide this ID to the user to join</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h5 className='fw-light'>{id}</h5>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
                    <div style={{ width: '180px', background: '#f8f9fa', textAlign:'center' }} 
                        className='m-0 p-2'>
                        <div className="d-flex flex-column gap-3 px-2 w-100">
                            {slides.map((slide, index) => (
                              <div key={slide.id} className="d-flex align-items-center" style={{ position: 'relative' }}>
                                {index === currentSlideIndex && (
                                    <div style={{
                                        width: '4px',
                                        height: '20%',
                                        backgroundColor: '#dc3545',
                                        position: 'absolute',
                                        left: -7,
                                        top: '40%',
                                        borderRadius: '2px'
                                    }} />
                                )}
                                <button
                                    style={{ height: '80px', width: '140px', paddingLeft: index === currentSlideIndex ? '8px' : '12px' }}
                                    className={`btn btn-sm text-start me-2 ${index === currentSlideIndex ? 'btn-outline-danger' : 'btn-light'}`}
                                    onClick={() => setCurrentSlideIndex(index)}
                                >
                                Slide {index + 1}
                                </button>
                                {slides.length > 1 && (
                                    <button
                                        className='btn btn-outline-danger border-0 p-1 m-0'
                                        onClick={() => {
                                            if (myRole !== 'creator') return;
                                            const newSlides = slides.filter((_, i) => i !== index);
                                            const newIndex = Math.max(
                                            0,
                                            currentSlideIndex === index
                                                ? index - 1
                                                : currentSlideIndex > index
                                                ? currentSlideIndex - 1
                                                : currentSlideIndex
                                            );
                                            broadcastSlides(newSlides);
                                            setCurrentSlideIndex(newIndex);
                                        }}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                              </div>
                            ))}
                            <button className='btn btn-sm btn-outline-danger mt-2 w-100'
                            onClick={() => {
                                if (myRole !== 'creator') return;
                                const newSlides = [...slides, { id: Date.now(), elements: [] }];
                                broadcastSlides(newSlides);
                                setCurrentSlideIndex(slides.length);
                                }}>
                                <i className="bi bi-plus-lg me-1"></i>
                                Add Slide
                            </button>
                        </div>
                    </div>
                    <div style={{ flex: 1, background: '#f8f9fa', position: 'relative'}}>
                        <div style={{
                            position: 'absolute',
                            top: '45%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            maxWidth: '1920px',
                            aspectRatio: '16 / 9',
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}>
                            <Stage
                              id="presentation-container"
                              width={1920}
                              height={1080}
                              scale={stageScale}
                              style={{ width: '100%', height: '100%' }}
                              onMouseDown={(e) => {
                                if (e.target === e.target.getStage()) {
                                  setSelectedId(null);
                                }
                              }}
                            >
                                <Layer>
                                    {currentSlide.elements.map(el => (
                                    <React.Fragment key={el.id}>
                                        <Text
                                        text={el.text}
                                        x={el.x}
                                        y={el.y}
                                        fontSize={el.fontSize}
                                        fontFamily={el.fontFamily}
                                        fontStyle={el.fontStyle}
                                        draggable={myRole !== 'viewer'}
                                        onDragEnd={(e) => updatePosition(el.id, e.target.x(), e.target.y())}
                                        onDblClick={(e) => {
                                            if (myRole === 'viewer') return;
                                            const stageBox = e.target.getStage().container().getBoundingClientRect();
                                            setEditingText(el.id);
                                            setEditingValue(el.text);
                                            setTextareaStyle({
                                            position: 'absolute',
                                            top: stageBox.top + el.y * stageScale.y + 'px',
                                            left: stageBox.left + el.x * stageScale.x + 'px',
                                            fontSize: el.fontSize + 'px',
                                            fontFamily: el.fontFamily,
                                            fontStyle: el.fontStyle,
                                            color: 'black',
                                            border: 'none',
                                            padding: '0',
                                            margin: '0',
                                            background: 'transparent',
                                            outline: 'none',
                                            resize: 'none',
                                            overflow: 'hidden',
                                            lineHeight: '1',
                                            zIndex: 1000,
                                            });
                                        }}
                                        onClick={() => setSelectedId(el.id)}
                                        />
                                        {selectedId === el.id && (
                                        <Rect
                                            x={el.x - 5}
                                            y={el.y - 5}
                                            width={el.text.length * el.fontSize * 0.6}
                                            height={el.fontSize + 10}
                                            stroke="black"
                                            strokeWidth={1}
                                            dash={[4, 2]}
                                            listening={false}
                                        />
                                        )}
                                    </React.Fragment>
                                    ))}
                                </Layer>
                            </Stage>
                            {selectedId !== null && (() => {
                                const selectedEl = currentSlide.elements.find(el => el.id === selectedId);
                                if (!selectedEl) return null;
                                return (
                                    <button
                                    className="btn btn-sm"
                                    style={{
                                        position: 'absolute',
                                        top: selectedEl.y * stageScale.y,
                                        left: (selectedEl.x + selectedEl.text.length * selectedEl.fontSize * 0.6) * stageScale.x,
                                        zIndex: 10
                                    }}
                                    onClick={() => {
                                        if (myRole === 'viewer') return;
                                        const newSlides = [...slides];
                                        newSlides[currentSlideIndex].elements = currentSlide.elements.filter(el => el.id !== selectedId);
                                        broadcastSlides(newSlides);
                                        setSelectedId(null);
                                    }}
                                    >
                                    ✕
                                    </button>
                                );
                            })()}
                            {editingText !== null && (
                                <textarea
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={() => {
                                        if (myRole === 'viewer') return;
                                        const newSlides = [...slides];
                                        newSlides[currentSlideIndex].elements = currentSlide.elements.map(el => el.id === editingText ? { ...el, text: editingValue } : el);
                                        broadcastSlides(newSlides);
                                        setEditingText(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (myRole === 'viewer') return;
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const newSlides = [...slides];
                                            newSlides[currentSlideIndex].elements = currentSlide.elements.map(el => el.id === editingText ? { ...el, text: editingValue } : el);
                                            broadcastSlides(newSlides);
                                            setEditingText(null);
                                        }
                                    }}
                                    style={textareaStyle}
                                    autoFocus
                                />
                            )}
                        </div>
                    </div>
                    <div style={{ width: '200px', background: '#f8f9fa', textAlign:'left', position: 'relative' }} className='m-0 p-2'>
                      <h6 className='fw-bold text-center mb-3'>Users in Room:</h6>
                      <ul className='list-unstyled'>
                        {users.map((user) => (
                          <li key={user.id} className="mb-1 me-3 text-end">
                            <span className='badge text-bg-dark'>{user.name}</span>
                            {myRole === 'creator' ? (
                              user.role === 'creator' ? (
                                <button className='btn btn-outline-danger ms-2 text-muted rounded-1' style={{width:'80px', height:'30px', fontSize: '0.8rem' }} disabled>creator</button>
                              ) : (
                                <div className="dropdown d-inline ms-2" style={{ position: 'static' }}>
                                  <button style={{width:'80px', height:'30px'}} className="btn btn-sm btn-outline-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {user.role}
                                  </button>
                                  <ul className="dropdown-menu" style={{ minWidth: '80px' }}>
                                    {['editor', 'viewer'].map((roleOption) => (
                                      <li key={roleOption}>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            socketRef.current.emit('changeUserRole', {
                                              presentationId: id,
                                              userId: user.id,
                                              newRole: roleOption,
                                            })
                                          }
                                        >
                                          {roleOption}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            ) : (
                                <button className='btn btn-outline-danger ms-2 text-muted rounded-1' style={{width:'80px', height:'30px', fontSize: '0.8rem' }} disabled>{user.role}</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                </div>
            </div>
  );
};  

export default Presentation;