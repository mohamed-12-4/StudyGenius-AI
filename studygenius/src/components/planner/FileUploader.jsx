'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiBook, FiCalendar } from 'react-icons/fi';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/azure-storage';
import { generatePlanFromSyllabus } from '@/lib/azure-openai';

export default function FileUploader({ courseId, userId, onFileUploaded, onSyllabusDetected, onQuickPlanGenerated, course }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyllabus, setIsSyllabus] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
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

  // Simple syllabus detection based on filename
  const detectSyllabus = (filename) => {
    const syllabusKeywords = ['syllabus', 'outline', 'course'];
    const filenameLower = filename.toLowerCase();
    
    return syllabusKeywords.some(keyword => filenameLower.includes(keyword));
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
    
    // Check if this might be a syllabus based on the filename
    const possibleSyllabus = detectSyllabus(file.name);
    setIsSyllabus(possibleSyllabus);
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !courseId || !userId) {
      toast.error('Missing required information for upload.');
      return;
    }
    
    try {
      setIsUploading(true);
      // Upload the file to Azure Storage - passing userId as required
      const uploaded = await uploadFile(selectedFile, userId, courseId);
      
      // Call the callback with the uploaded file info
      if (onFileUploaded) {
        onFileUploaded(uploaded);
      }
      
      // If this is a syllabus and we have a callback for it
      if (isSyllabus && onSyllabusDetected) {
        onSyllabusDetected(uploaded);
      }
      
      toast.success('File uploaded successfully!');
      
      // Reset the form
      setSelectedFile(null);
      setIsSyllabus(false);
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

  const generateQuickPlan = async () => {
    if (!selectedFile || !courseId || !userId || !course) {
      toast.error('Missing required information for quick plan generation.');
      return;
    }
    
    try {
      setIsUploading(true);
      setIsGeneratingPlan(true);
      
      // First upload the file
      const uploaded = await uploadFile(selectedFile, userId, courseId);
      
      // Call the callback with the uploaded file info
      if (onFileUploaded) {
        onFileUploaded(uploaded);
      }
      
      toast.success('Syllabus uploaded! Generating study plan...');
      
      // Generate a study plan from the syllabus
      const plan = await generatePlanFromSyllabus(course, uploaded);
      
      if (onQuickPlanGenerated && plan) {
        onQuickPlanGenerated(plan);
      }
      
      toast.success('Study plan generated from syllabus!');
      
      // Reset the form
      setSelectedFile(null);
      setIsSyllabus(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error generating quick plan:', error);
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsUploading(false);
      setIsGeneratingPlan(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setIsSyllabus(false);
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
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  {isSyllabus && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      <FiBook className="mr-1 h-3 w-3" />
                      Syllabus
                    </span>
                  )}
                </div>
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
        <div className="flex justify-end space-x-3">
          {isSyllabus && onQuickPlanGenerated && (
            <button
              type="button"
              onClick={generateQuickPlan}
              disabled={isUploading || isGeneratingPlan}
              className={`flex items-center space-x-2 px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors ${
                (isUploading || isGeneratingPlan) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGeneratingPlan ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Plan...</span>
                </>
              ) : (
                <>
                  <FiCalendar className="h-4 w-4" />
                  <span>Upload & Generate Plan</span>
                </>
              )}
            </button>
          )}
          
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || isGeneratingPlan}
            className={`flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors ${
              (isUploading || isGeneratingPlan) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUploading && !isGeneratingPlan ? (
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