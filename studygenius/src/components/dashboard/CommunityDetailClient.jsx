// 'use client' directive for client-side rendering
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import FileUploader from '@/components/planner/FileUploader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getJWT } from '@/lib/appwrite';

export default function CommunityDetailClient({ community }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (community?.id) {
      fetchPosts();
    }
  }, [community?.id]);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/community/${community.id}/posts`);
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
      toast.error('Could not load posts');
    } finally {
      setIsLoading(false);
    }
  }

  const handlePost = async () => {
    if (!content.trim()) {
      return toast.error('Content required');
    }
    setIsPosting(true);
    try {
      // Get JWT token for authorization
      const jwt = await getJWT();
      if (!jwt) {
        throw new Error('Authentication required');
      }
      
      const res = await fetch(`/api/community/${community.id}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ content, attachments })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Post failed with status ${res.status}`);
      }
      
      const newPost = await res.json();
      setPosts(prev => [newPost, ...prev]);
      setContent('');
      setAttachments([]);
      toast.success('Posted successfully');
    } catch (e) {
      console.error(e);
      toast.error(`Failed to post: ${e.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const onFileUploaded = (file) => {
    setAttachments(prev => [...prev, file]);
    toast.success(`File "${file.name}" attached`);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Please log in to view and participate in this community.</p>
        <Link href="/login" className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button and header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => router.push('/dashboard/community')} 
          className="flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to communities
        </button>
        
        <div className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs rounded-full">
          {new Date(community.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Community info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{community.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{community.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>Created by: {community.ownerId === (user.id || user.$id) ? 'You' : community.ownerId}</span>
        </div>
      </div>

      {/* Post creation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share something with the community..."
          className="w-full p-3 border dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          rows={4}
        />

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Attachments ({attachments.length})</h3>
          <FileUploader
            courseId={community.id}
            userId={user.$id || user.id}
            onFileUploaded={onFileUploaded}
          />
        </div>

        {attachments.length > 0 && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-sm font-medium mb-2">Added attachments:</h3>
            <div className="space-y-1">
              {attachments.map(a => (
                <div key={a.blobId} className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                  <span>{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handlePost}
            disabled={isPosting || !content.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Discussion ({posts.length})</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(p => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-medium">{p.userId === (user.id || user.$id) ? 'You' : p.userId}</div>
                      <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p>{p.content}</p>
                  </div>
                  
                  {p.attachments && p.attachments.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {p.attachments.map(a => (
                        <div key={a.blobId} className="relative group">
                          {a.contentType.startsWith('image/') ? (
                            <a href={a.url} target="_blank" rel="noopener noreferrer" className="block">
                              <img 
                                src={a.url} 
                                alt={a.name} 
                                className="max-h-48 w-full object-cover rounded border border-gray-200 dark:border-gray-700" 
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                                <span className="sr-only">View image</span>
                              </div>
                            </a>
                          ) : (
                            <a 
                              href={a.url} 
                              className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm truncate">{a.name}</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}