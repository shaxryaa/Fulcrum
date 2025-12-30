'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import LeftSidebar from '@/components/LeftSidebar';

export default function FlashcardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', tags: '' });
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCards(token);
  }, []);

  const fetchCards = async (token) => {
    try {
      const res = await fetch(`${API_URL}/flashcards`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
         setCards(await res.json());
      }
      setLoading(false);
    } catch (error) {
       console.error(error);
       setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const tagsArray = newCard.tags.split(',').map(t => t.trim()).filter(Boolean);
        const res = await fetch(`${API_URL}/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...newCard, tags: tagsArray })
        });
        if (res.ok) {
            const created = await res.json();
            setCards([...cards, created]);
            setNewCard({ front: '', back: '', tags: '' });
            setIsAdding(false);
        }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
      const token = localStorage.getItem('token');
      try {
          await fetch(`${API_URL}/flashcards/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
          });
          setCards(cards.filter(c => c.id !== id));
      } catch (error) { console.error(error); }
  };

  // Group tags
  const allTags = ['All', ...new Set(cards.flatMap(c => c.tags))];

  // Filter cards
  const filteredCards = activeTag === 'All' 
    ? cards 
    : cards.filter(c => c.tags.includes(activeTag));

  // --- Quiz Logic ---
  const startQuiz = () => {
     setQuizMode(true);
     setCurrentQuizIndex(0);
     setShowAnswer(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  if (quizMode) {
      const currentCard = filteredCards[currentQuizIndex];
      return (
          <div className="min-h-screen bg-white">
              <LeftSidebar activeItem="flashcards" />
              <div className="ml-48 p-10 flex flex-col items-center justify-center min-h-screen">
                  <div className="w-full max-w-2xl">
                      <div className="flex justify-between items-center mb-8">
                          <h2 className="text-2xl font-bold">Quiz: {activeTag}</h2>
                          <span className="text-gray-500">{currentQuizIndex + 1} / {filteredCards.length}</span>
                      </div>

                      {/* Card Area */}
                      <div 
                        className="bg-white border-2 border-black rounded-xl p-12 min-h-[300px] flex items-center justify-center text-center cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setShowAnswer(!showAnswer)}
                      >
                          <div>
                              <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">
                                  {showAnswer ? 'Answer' : 'Question'}
                              </p>
                              <p className="text-2xl font-medium">
                                  {showAnswer ? currentCard.back : currentCard.front}
                              </p>
                              <p className="text-xs text-gray-300 mt-8">(Click to flip)</p>
                          </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-between mt-8">
                          <button 
                            onClick={() => setQuizMode(false)}
                            className="px-6 py-2 border border-black rounded hover:bg-gray-100"
                          >
                              Exit Quiz
                          </button>
                          
                          <div className="flex gap-4">
                              <button 
                                onClick={() => {
                                    if (currentQuizIndex < filteredCards.length - 1) {
                                        setCurrentQuizIndex(prev => prev + 1);
                                        setShowAnswer(false);
                                    } else {
                                        // Quiz Finished
                                        const token = localStorage.getItem('token');
                                        fetch(`${API_URL}/flashcards/quiz-complete`, {
                                            method: 'POST',
                                            headers: { Authorization: `Bearer ${token}` }
                                        }).catch(console.error);
                                        
                                        alert('Nice work! Quiz completed.');
                                        setQuizMode(false);
                                    }
                                }}
                                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                              >
                                  {currentQuizIndex === filteredCards.length - 1 ? 'Finish' : 'Next Card'}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white">
      <LeftSidebar activeItem="flashcards" />
      <div className="ml-48 p-10">
          <div className="flex justify-between items-center mb-8">
              <div>
                  <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
                  <p className="text-gray-500">Master your knowledge with active recall.</p>
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={startQuiz}
                    disabled={filteredCards.length === 0}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                      Take Quiz ({filteredCards.length})
                  </button>
                  <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 border border-black rounded hover:bg-gray-100"
                  >
                      {isAdding ? 'Cancel' : '+ New Card'}
                  </button>
              </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        activeTag === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                      {tag}
                  </button>
              ))}
          </div>

          {/* Add Form */}
          {isAdding && (
              <form onSubmit={handleCreate} className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        type="text" 
                        placeholder="Front (Question)" 
                        className="p-3 border rounded"
                        value={newCard.front}
                        onChange={e => setNewCard({...newCard, front: e.target.value})}
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Back (Answer)" 
                        className="p-3 border rounded"
                        value={newCard.back}
                        onChange={e => setNewCard({...newCard, back: e.target.value})}
                        required
                      />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tags (comma separated, e.g. Math, Algebra)" 
                    className="w-full p-3 border rounded mb-4"
                    value={newCard.tags}
                    onChange={e => setNewCard({...newCard, tags: e.target.value})}
                  />
                  <button type="submit" className="px-6 py-2 bg-black text-white rounded">Create Card</button>
              </form>
          )}

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map(card => (
                  <FlipCard 
                    key={card.id} 
                    card={card} 
                    onDelete={() => handleDelete(card.id)} 
                  />
              ))}
          </div>
      </div>
    </div>
  );
}

function FlipCard({ card, onDelete }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="bg-white border border-[#E5E5E5] rounded-xl relative group cursor-pointer hover:shadow-md transition-all h-[200px] perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
        <div className="p-6 h-full flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center text-center">
                 {isFlipped ? (
                     <div className="animate-fade-in">
                         <p className="text-xs text-green-600 font-bold uppercase mb-2">Answer</p>
                         <p className="text-gray-800 font-medium">{card.back}</p>
                     </div>
                 ) : (
                     <div className="animate-fade-in">
                        <p className="text-xs text-[#999] font-bold uppercase mb-2">Question</p>
                        <p className="text-black font-semibold text-lg">{card.front}</p>
                     </div>
                 )}
            </div>

            <div className="flex gap-2 mt-4 flex-wrap justify-center pointer-events-none">
                {card.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-400 border border-gray-100">{tag}</span>
                ))}
            </div>
        </div>

        <button 
        onClick={(e) => {
            e.stopPropagation();
            onDelete();
        }}
        className="absolute top-3 right-3 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
  );
}
