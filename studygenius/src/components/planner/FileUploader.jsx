'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/azure-storage';

export default function FileUploader({ courseId, onFileUploaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Check if file is a PDF or text file
    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC/DOCX, or TXT file.');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !courseId) return;
    
    try {
      setIsUploading(true);
      // Upload the file to Azure Storage
      const uploaded = await uploadFile(selectedFile, courseId);
      
      // Call the callback with the uploaded file info
      if (onFileUploaded) {
        onFileUploaded(uploaded);
      }
      
      toast.success('File uploaded successfully!');
      
      // Reset the form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-700'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="space-y-3">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileInputChange}
                />
              </label>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, DOC/DOCX, or TXT up to 10MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <div className="flex items-center space-x-3">
              <FiFile className="h-10 w-10 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearSelectedFile}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className={`flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors ${
              isUploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FiUpload className="h-4 w-4" />
                <span>Upload</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}