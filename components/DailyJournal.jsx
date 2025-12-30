'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/config';

export default function DailyJournal() {
  const [entry, setEntry] = useState({
     wentWell: '',
     wentBad: '',
     notes: ''
  });
  const [pastEntries, setPastEntries] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
          const res = await fetch(`${API_URL}/journal`, {
               headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) setPastEntries(await res.json());
      } catch (error) { console.error(error); }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/journal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(entry)
        });
        if (res.ok) {
            setIsSaved(true);
            setEntry({ wentWell: '', wentBad: '', notes: '' });
            fetchEntries(); // Refresh list
            setTimeout(() => setIsSaved(false), 3000);
        }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
      const token = localStorage.getItem('token');
      try {
          await fetch(`${API_URL}/journal?id=${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
          });
          setPastEntries(pastEntries.filter(e => e.id !== id));
      } catch (error) { console.error(error); }
  };

  return (
    <div className="w-full mt-8 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl p-8">
        <h3 className="text-xl font-bold mb-6">Daily Journal</h3>
        
        {/* Write Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">What went well today?</label>
                <textarea 
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black transition-colors"
                    rows={4}
                    placeholder="Small wins, productive moments..."
                    value={entry.wentWell}
                    onChange={(e) => setEntry({...entry, wentWell: e.target.value})}
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">What could have been better?</label>
                <textarea 
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black transition-colors"
                    rows={4}
                    placeholder="Distractions, roadblocks..."
                    value={entry.wentBad}
                    onChange={(e) => setEntry({...entry, wentBad: e.target.value})}
                />
            </div>
        </div>

        <div className="mt-6 space-y-2">
            <label className="text-sm font-semibold text-gray-700">General Notes & Thoughts</label>
            <textarea 
                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black transition-colors"
                rows={3}
                placeholder="Ideas, feelings, reminders for tomorrow..."
                value={entry.notes}
                onChange={(e) => setEntry({...entry, notes: e.target.value})}
            />
        </div>

        <div className="mt-6 flex justify-end mb-8">
             <button 
                onClick={handleSave}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isSaved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                }`}
             >
                {isSaved ? 'Saved ✓' : 'Save Entry'}
             </button>
        </div>

        {/* Recent Entries */}
        {pastEntries.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
                <h4 className="text-lg font-bold mb-4">Recent Entries</h4>
                <div className="space-y-4">
                    {pastEntries.slice(0, 3).map((pastEntry, idx) => (
                        <div key={pastEntry.id || idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-400">
                                    {new Date(pastEntry.createdAt).toLocaleDateString()}
                                </p>
                                <button 
                                  onClick={() => handleDelete(pastEntry.id)}
                                  className="text-xs text-gray-300 hover:text-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Went Well</span>
                                    <p className="text-sm mt-1">{pastEntry.wentWell || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Challenges</span>
                                    <p className="text-sm mt-1">{pastEntry.wentBad || '-'}</p>
                                </div>
                            </div>
                            {pastEntry.notes && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Notes</span>
                                    <p className="text-sm mt-1 text-gray-600">{pastEntry.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
