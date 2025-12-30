'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import LeftSidebar from '@/components/LeftSidebar';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    dob: '',
    gender: 'prefer_not_to_say',
    profilePicture: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUser(token);
  }, []);

  const fetchUser = async (token) => {
      try {
          const res = await fetch(`${API_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setFormData({
                  name: data.name || '',
                  email: data.email || '',
                  bio: data.bio || '',
                  dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
                  gender: data.gender || 'prefer_not_to_say',
                  profilePicture: data.profilePicture || ''
              });
          }
          setLoading(false);
      } catch (error) { setLoading(false); }
  };

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      const token = localStorage.getItem('token');
      try {
          const res = await fetch(`${API_URL}/user/profile`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(formData)
          });
          if (res.ok) {
              alert('Profile updated successfully!');
          } else {
              alert('Failed to update profile.');
          }
      } catch (error) {
          console.error(error);
          alert('Error updating profile');
      } finally {
          setIsSaving(false);
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      router.push('/login');
  };

  const handleImageUpload = () => {
      const url = prompt("Enter image URL for profile picture (Simulation):", "https://i.pravatar.cc/300");
      if (url) {
          setFormData(prev => ({ ...prev, profilePicture: url }));
      }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <LeftSidebar activeItem="profile" />
      <div className="ml-48">
          <div className="max-w-3xl mx-auto px-10 py-12">
              <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

              <div className="flex items-start gap-8 mb-12">
                  <div className="relative group cursor-pointer" onClick={handleImageUpload}>
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50">
                          {formData.profilePicture ? (
                              <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              </div>
                          )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-semibold">Change</span>
                      </div>
                  </div>
                  <div>
                      <h2 className="text-xl font-bold">{formData.name || 'User'}</h2>
                      <p className="text-gray-500">{formData.email}</p>
                      <button onClick={handleLogout} className="text-red-600 text-sm mt-2 hover:underline">
                          Log Out
                      </button>
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm font-semibold mb-2">Full Name</label>
                          <input 
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-semibold mb-2">Email</label>
                          <input 
                              type="email" 
                              value={formData.email}
                              disabled
                              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-semibold mb-2">Date of Birth</label>
                          <input 
                              type="date" 
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-semibold mb-2">Gender</label>
                          <select 
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="non_binary">Non-binary</option>
                              <option value="prefer_not_to_say">Prefer not to say</option>
                          </select>
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-semibold mb-2">Bio</label>
                      <textarea 
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          placeholder="Tell us a little about yourself..."
                      />
                  </div>

                  <div className="pt-4 flex justify-end">
                      <button 
                          type="submit" 
                          disabled={isSaving}
                          className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50"
                      >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                  </div>
              </form>
          </div>
      </div>
    </div>
  );
}
