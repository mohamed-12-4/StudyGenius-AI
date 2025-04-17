'use client';

import { useState } from 'react';
import { FiBook, FiCalendar, FiClock, FiFileText, FiBarChart2 } from "react-icons/fi";

export default function CoursesList({ courses, onSelectCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  
  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    onSelectCourse(courseId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Map difficulty level to display text
  const getDifficultyText = (level) => {
    switch (level) {
      case 'beginner':
        return 'Beginner';
      case 'medium':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Not specified';
    }
  };
  
  // Get appropriate icon color based on difficulty
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'text-success-500';
      case 'medium':
        return 'text-warning-500';
      case 'advanced':
        return 'text-danger-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <FiBook className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Create your first course to get started with your study planning journey.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedCourseId === course.id
              ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onClick={() => handleCourseClick(course.id)}
        >
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">{course.name}</h3>
              <div className={`flex items-center ${getDifficultyColor(course.difficultyLevel)}`}>
                <FiBarChart2 className="h-5 w-5 mr-1" />
                <span className="text-xs font-medium">{getDifficultyText(course.difficultyLevel)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{course.description}</p>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              {course.subject && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiFileText className="h-4 w-4 mr-1" />
                  <span className="truncate">{course.subject}</span>
                </div>
              )}
              
              {course.estimatedHours && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="h-4 w-4 mr-1" />
                  <span>{course.estimatedHours} hours</span>
                </div>
              )}
              
              {course.startDate && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar className="h-4 w-4 mr-1" />
                  <span className="truncate">Start: {formatDate(course.startDate)}</span>
                </div>
              )}
              
              {course.endDate && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar className="h-4 w-4 mr-1" />
                  <span className="truncate">End: {formatDate(course.endDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}