'use client';

import { useState } from 'react';
import { FiFile, FiDownload, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'sonner';
import { deleteFile, getFileDownloadURL } from '@/lib/azure-storage';

export default function FilesList({ files, courseId, userId, onFileDeleted, onFilesChanged, onViewFile }) {
  const [deleting, setDeleting] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const handleDelete = async (file) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const fileId = file.id || file.blobId;
      setDeleting(fileId);
      
      // Delete the file from Azure Storage using blobId
      await deleteFile(file.blobId || fileId);
      
      // Call the callback with the deleted file
      if (onFileDeleted) {
        onFileDeleted(fileId, file.blobId);
      }
      
      // Refresh file list after deletion
      if (onFilesChanged) {
        onFilesChanged();
      }
      
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (file) => {
    try {
      const fileId = file.id || file.blobId;
      setDownloading(fileId);
      
      // For Azure Storage, we use blobId to get the download URL
      const downloadUrl = await getFileDownloadURL(file.blobId || fileId);
      
      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('File download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleViewFile = (file) => {
    if (onViewFile) {
      onViewFile(file);
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <FiFile className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No files</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload files to begin creating your study plan.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {files.map((file) => (
          <li key={file.id || file.blobId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 space-x-3">
                  <div className="flex-shrink-0">
                    <FiFile className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {file.uploadedAt ? `Uploaded: ${new Date(file.uploadedAt).toLocaleString()}` : ''}
                      {file.size ? ` • ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewFile(file)}
                    className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    disabled={downloading === (file.id || file.blobId)}
                    className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {downloading === (file.id || file.blobId) ? (
                      <div className="h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiDownload className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    disabled={deleting === (file.id || file.blobId)}
                    className="inline-flex items-center p-1.5 border border-red-300 dark:border-red-700 rounded-md text-xs font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {deleting === (file.id || file.blobId) ? (
                      <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiTrash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}