'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CommunityList({ initialCommunities }) {
  const [communities, setCommunities] = useState(initialCommunities);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const create = async () => {
    if (!name) return toast.error('Name required');
    setIsCreating(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, description })
      });
      
      if (!res.ok) throw new Error('Failed to create community');
      
      const c = await res.json();
      setCommunities([c, ...communities]);
      setName(''); 
      setDescription('');
      toast.success('Community created successfully');
    } catch(e) { 
      toast.error('Failed to create community');
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Communities</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create New Community</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="community-name" className="block text-sm font-medium mb-1">Name</label>
            <input 
              id="community-name"
              value={name} 
              onChange={e=>setName(e.target.value)} 
              placeholder="Community name" 
              className="w-full p-2 border dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="community-desc" className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              id="community-desc"
              value={description} 
              onChange={e=>setDescription(e.target.value)} 
              placeholder="What is this community about?" 
              className="w-full p-2 border dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows="3"
            />
          </div>
          
          <button 
            onClick={create} 
            disabled={isCreating}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Community'}
          </button>
        </div>
      </div>
      
      {communities && communities.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map(c => (
            <Link key={c.id} href={`/dashboard/community/${c.id}`} 
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-2">{c.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{c.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  View Community
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-500 dark:text-gray-400">No communities yet. Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}