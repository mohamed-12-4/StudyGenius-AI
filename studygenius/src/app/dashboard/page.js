import { FiCalendar, FiBook, FiClock, FiTrendingUp, FiAward, FiUsers } from "react-icons/fi";

// Sample data for dashboard stats
const stats = [
  { name: "Study Streak", value: "7 days", icon: FiTrendingUp, color: "text-primary-500" },
  { name: "Focus Time", value: "12.5 hrs", icon: FiClock, color: "text-secondary-500" },
  { name: "Courses", value: "4 active", icon: FiBook, color: "text-success-500" },
  { name: "Points", value: "2,450", icon: FiAward, color: "text-warning-500" },
];

// Sample data for upcoming tasks
const upcomingTasks = [
  { 
    id: 1, 
    title: "Physics Exam Review", 
    course: "Physics 101", 
    dueDate: "Today", 
    priority: "high",
    completion: 75
  },
  { 
    id: 2, 
    title: "Literature Essay Draft", 
    course: "World Literature", 
    dueDate: "Tomorrow", 
    priority: "medium",
    completion: 40
  },
  { 
    id: 3, 
    title: "Linear Algebra Problem Set", 
    course: "Mathematics", 
    dueDate: "April 18", 
    priority: "medium",
    completion: 10
  },
  { 
    id: 4, 
    title: "Python Programming Project", 
    course: "Intro to CS", 
    dueDate: "April 20", 
    priority: "low",
    completion: 0
  },
];

// Sample data for recommended resources
const recommendedResources = [
  {
    id: 1,
    title: "Understanding Quantum Physics Concepts",
    type: "Video",
    duration: "18 min",
    course: "Physics 101"
  },
  {
    id: 2,
    title: "Literary Analysis Techniques",
    type: "Article",
    duration: "10 min read",
    course: "World Literature"
  },
  {
    id: 3,
    title: "Matrix Operations Practice Quiz",
    type: "Quiz",
    duration: "15 questions",
    course: "Mathematics"
  }
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="heading-1 text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">Today is</span>
          <span className="font-medium text-gray-900 dark:text-white">April 16, 2025</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card bg-white dark:bg-gray-900 flex items-center p-4">
            <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg')}/10 mr-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming tasks section */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-3 text-gray-900 dark:text-white">Upcoming Study Tasks</h2>
            <button className="text-sm text-primary-600 hover:text-primary-500">
              View all tasks
            </button>
          </div>

          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        task.priority === 'high' ? 'bg-danger-500' : 
                        task.priority === 'medium' ? 'bg-warning-500' : 'bg-success-500'
                      }`}></span>
                      <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{task.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{task.course}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            task.completion >= 75 ? 'bg-success-500' : 
                            task.completion >= 25 ? 'bg-warning-500' : 'bg-primary-500'
                          }`}
                          style={{ width: `${task.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{task.completion}%</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Weekly schedule preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-3 text-gray-900 dark:text-white">Weekly Overview</h2>
            <button className="text-sm text-primary-600 hover:text-primary-500">
              <FiCalendar className="inline mr-1" /> Full Schedule
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Hours studied this week */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Hours Studied</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">12.5 / 20 hrs</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '62.5%' }}></div>
              </div>
            </div>
            
            {/* Courses progress */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</h3>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Physics 101</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">68%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">World Literature</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">42%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Mathematics</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-success-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiAward className="inline-block mr-2 text-secondary-500" />
            AI-Recommended Resources
          </h2>
          <button className="text-sm text-primary-600 hover:text-primary-500">
            View all recommendations
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedResources.map((resource) => (
            <div key={resource.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium py-1 px-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {resource.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{resource.duration}</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">{resource.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{resource.course}</p>
              <button className="mt-3 text-sm text-primary-600 hover:text-primary-500">View Resource</button>
            </div>
          ))}
        </div>
      </div>

      {/* Community activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiUsers className="inline-block mr-2 text-primary-500" />
            Community Activity
          </h2>
          <button className="text-sm text-primary-600 hover:text-primary-500">
            Join a study group
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium">JD</span>
              </div>
            </div>
            <div>
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">Jane Doe</span>
                <span className="text-gray-500 dark:text-gray-400"> shared notes for </span>
                <span className="font-medium text-gray-900 dark:text-white">Physics 101</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                "These quantum mechanics summary notes helped me a lot for the midterm!"
              </p>
              <div className="mt-2 flex space-x-2">
                <button className="text-xs text-primary-600 hover:text-primary-500">
                  View Notes
                </button>
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Thank (12)
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
                <span className="text-secondary-600 font-medium">MS</span>
              </div>
            </div>
            <div>
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">Math Study Group</span>
                <span className="text-gray-500 dark:text-gray-400"> is holding a session on </span>
                <span className="font-medium text-gray-900 dark:text-white">Linear Algebra</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                "Join us tomorrow at 6 PM for a collaborative problem-solving session!"
              </p>
              <div className="mt-2 flex space-x-2">
                <button className="text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 px-2 py-1 rounded">
                  Join Session
                </button>
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  8 attending
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}