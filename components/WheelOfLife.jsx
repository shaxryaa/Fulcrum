'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/config';

export default function WheelOfLife() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/life-balance`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            let data = await res.json();
            setAreas(data); // Start empty if no data
        }
        setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const handleUpdate = (idx, field, value) => {
      const newAreas = [...areas];
      newAreas[idx] = { ...newAreas[idx], [field]: value };
      setAreas(newAreas);
  };

  const handleAddArea = () => {
      if (areas.length >= 8) return;
      setAreas([...areas, { name: 'New Area', rating: 5 }]);
  };

  const handleDelete = async (idx) => {
      const area = areas[idx];
      if (area.id) {
          // Delete from DB if it exists
          try {
              const token = localStorage.getItem('token');
              await fetch(`${API_URL}/life-balance?id=${area.id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` }
              });
          } catch(e) { console.error(e); }
      }
      setAreas(areas.filter((_, i) => i !== idx));
  };

  const saveChanges = async () => {
      const token = localStorage.getItem('token');
      // Save all areas (batch ideally, but sequential for now or bulk update API)
      // Since API does create/update logic per item, we might need a promise.all
      // Simplified: We'll map through.
      setIsEditing(false);
      try {
          await Promise.all(areas.map(area => 
             fetch(`${API_URL}/life-balance`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                 body: JSON.stringify(area)
             })
          ));
          fetchAreas(); // refresh IDs
      } catch (error) { console.error(error); }
  };

  // SVG Radar Chart Logic
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const numPoints = areas.length;
  
  const getPoint = (index, value, max = 10) => {
      const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
      const r = (value / max) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return [x, y];
  };

  const polygonPoints = areas.map((area, i) => getPoint(i, area.rating || 0).join(',')).join(' ');
  const gridLevels = [2, 4, 6, 8, 10];

  if (loading) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Wheel of Life</h2>
            <button 
                onClick={() => isEditing ? saveChanges() : setIsEditing(true)}
                className="text-sm font-medium hover:underline text-black"
            >
                {isEditing ? 'Save Balance' : areas.length === 0 ? 'Add Areas' : 'Adjust Levels'}
            </button>
        </div>

        {areas.length === 0 && !isEditing && (
             <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed text-gray-400">
                 <p>No life areas defined yet.</p>
                 <button onClick={() => setIsEditing(true)} className="mt-2 text-black underline">Start Mapping</button>
             </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
            <div className="mb-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {areas.map((area, i) => (
                         <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200">
                             <div className="flex justify-between mb-2">
                                 <input 
                                     type="text" 
                                     value={area.name}
                                     onChange={(e) => handleUpdate(i, 'name', e.target.value)}
                                     placeholder="Area Name (e.g. Health)"
                                     className="bg-transparent font-bold text-sm border-b border-gray-300 focus:outline-none focus:border-black w-2/3"
                                 />
                                 <button onClick={() => handleDelete(i)} className="text-red-500 text-xs">Remove</button>
                             </div>
                             <input 
                                type="range" 
                                min="0" 
                                max="10" 
                                value={area.rating}
                                onChange={e => handleUpdate(i, 'rating', parseInt(e.target.value))}
                                className="w-full accent-black"
                             />
                             <div className="text-right text-xs font-mono">{area.rating}/10</div>
                         </div>
                     ))}
                 </div>
                 {areas.length < 8 && (
                     <button 
                        onClick={handleAddArea}
                        className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:border-black hover:text-black transition-colors"
                     >
                         + Add Area ({8 - areas.length} remaining)
                     </button>
                 )}
            </div>
        )}

        {/* View Mode (Chart) */}
        {!isEditing && areas.length > 0 && (
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="relative w-[300px] h-[300px] flex-shrink-0">
                    <svg width={size} height={size} className="transform drop-shadow-sm">
                        {gridLevels.map(level => (
                            <circle
                                key={level}
                                cx={center}
                                cy={center}
                                r={(level / 10) * radius}
                                fill="none"
                                stroke="#E5E5E5"
                                strokeWidth="1"
                            />
                        ))}
                        {areas.map((_, i) => {
                            const [x, y] = getPoint(i, 10);
                            return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#E5E5E5" />;
                        })}
                        <polygon 
                            points={polygonPoints} 
                            fill="rgba(0,0,0,0.1)" 
                            stroke="black" 
                            strokeWidth="2" 
                        />
                        {areas.map((area, i) => {
                            const [x, y] = getPoint(i, 12.5);
                            const anchor = Math.abs(x - center) < 5 ? 'middle' : x > center ? 'start' : 'end';
                            return (
                                <text 
                                    key={i} 
                                    x={x} 
                                    y={y + 4} 
                                    textAnchor={anchor} 
                                    fontSize="10" 
                                    fontWeight="bold" 
                                    fill="#666"
                                >
                                    {area.name}
                                </text>
                            );
                        })}
                    </svg>
                </div>
                
                <div className="flex-1 w-full max-w-xs">
                     <div className="space-y-2">
                        {areas.map((area, i) => (
                            <div key={i} className="flex justify-between text-sm border-b border-gray-100 py-1">
                                <span>{area.name}</span>
                                <span className="font-bold">{area.rating}/10</span>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        )}
    </div>
  );
}
