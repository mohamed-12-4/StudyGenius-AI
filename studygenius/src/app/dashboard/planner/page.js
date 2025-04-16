import { FiPlus, FiCalendar, FiClock, FiCheckCircle, FiFile, FiUpload, FiAward } from "react-icons/fi";

// Sample study plan data
const studyPlan = {
  weeklyGoals: [
    { id: 1, title: "Complete Physics Problem Set", completed: true },
    { id: 2, title: "Read Chapters 7-9 of Literary Analysis", completed: false },
    { id: 3, title: "Practice Matrix Operations", completed: false },
    { id: 4, title: "Prepare Python Project Outline", completed: false },
  ],
  upcomingStudySessions: [
    { 
      id: 1, 
      subject: "Physics 101", 
      topic: "Quantum Mechanics", 
      date: "Today", 
      startTime: "3:00 PM", 
      endTime: "4:30 PM",
      techniques: ["Active Recall", "Practice Problems"]
    },
    { 
      id: 2, 
      subject: "World Literature", 
      topic: "Literary Analysis Essay", 
      date: "Today", 
      startTime: "5:00 PM", 
      endTime: "6:30 PM",
      techniques: ["Focused Writing", "Critical Thinking"]
    },
    { 
      id: 3, 
      subject: "Mathematics", 
      topic: "Linear Algebra", 
      date: "Tomorrow", 
      startTime: "10:00 AM", 
      endTime: "11:30 AM",
      techniques: ["Problem Solving", "Spaced Repetition"]
    },
    { 
      id: 4, 
      subject: "Intro to CS", 
      topic: "Python Programming", 
      date: "April 18", 
      startTime: "2:00 PM", 
      endTime: "4:00 PM",
      techniques: ["Practical Application", "Coding Practice"]
    },
  ]
};

export default function StudyPlanner() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="heading-1 text-gray-900 dark:text-white">Study Planner</h1>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <FiPlus className="h-5 w-5" />
            <span>Add Study Session</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors">
            <FiUpload className="h-5 w-5" />
            <span>Upload Syllabus</span>
          </button>
        </div>
      </div>

      {/* AI Study Plan Generator */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 border-primary-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/50">
            <FiAward className="h-7 w-7 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="heading-3 text-gray-900 dark:text-white mb-1">AI Study Plan Generator</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
              Let our AI analyze your course materials and create a personalized study plan tailored to your learning style, goals, and schedule.
            </p>
          </div>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Generate Plan
          </button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly goals section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-3 text-gray-900 dark:text-white">Weekly Goals</h2>
            <span className="text-sm py-1 px-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
              {studyPlan.weeklyGoals.filter(goal => goal.completed).length}/{studyPlan.weeklyGoals.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {studyPlan.weeklyGoals.map((goal) => (
              <div 
                key={goal.id} 
                className={`p-3 rounded-lg flex items-start ${
                  goal.completed 
                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400' 
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {goal.completed ? (
                    <FiCheckCircle className="h-5 w-5 text-success-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-700" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    goal.completed ? 'line-through' : 'text-gray-900 dark:text-white'
                  }`}>
                    {goal.title}
                  </p>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 mt-3 text-sm text-primary-600 hover:text-primary-500 flex items-center justify-center">
              <FiPlus className="mr-1" /> Add Goal
            </button>
          </div>
        </div>

        {/* Study techniques recommendations */}
        <div className="card">
          <h2 className="heading-3 text-gray-900 dark:text-white mb-4">Recommended Techniques</h2>
          
          <div className="space-y-4">
            <div className="bg-primary-50 dark:bg-gray-800 p-3 rounded-lg">
              <h3 className="font-medium text-primary-700 dark:text-primary-400 mb-1">Active Recall</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Test yourself on key concepts from your Physics 101 course to strengthen memory retention. 
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 py-0.5 px-2 rounded-full">
                  Recommended for: Physics 101
                </span>
              </div>
            </div>
            
            <div className="bg-secondary-50 dark:bg-gray-800 p-3 rounded-lg">
              <h3 className="font-medium text-secondary-700 dark:text-secondary-400 mb-1">Spaced Repetition</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Review matrix operations at increasing intervals to optimize long-term retention for your Mathematics course.
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 py-0.5 px-2 rounded-full">
                  Recommended for: Mathematics
                </span>
              </div>
            </div>
            
            <div className="bg-success-50 dark:bg-gray-800 p-3 rounded-lg">
              <h3 className="font-medium text-success-700 dark:text-success-400 mb-1">Focused Writing Sessions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Schedule 25-minute focused writing blocks with 5-minute breaks for your Literature essay.
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 py-0.5 px-2 rounded-full">
                  Recommended for: World Literature
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Study resources and materials */}
        <div className="card">
          <h2 className="heading-3 text-gray-900 dark:text-white mb-4">Study Materials</h2>
          
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center">
              <div className="p-2 rounded-md bg-primary-100 dark:bg-primary-900/30 mr-3">
                <FiFile className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Physics 101 Syllabus</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded 3 days ago</p>
              </div>
              <button className="text-xs text-primary-600 hover:text-primary-500">View</button>
            </div>
            
            <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center">
              <div className="p-2 rounded-md bg-secondary-100 dark:bg-secondary-900/30 mr-3">
                <FiFile className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Literature Essay Guidelines</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded 1 week ago</p>
              </div>
              <button className="text-xs text-primary-600 hover:text-primary-500">View</button>
            </div>
            
            <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center">
              <div className="p-2 rounded-md bg-success-100 dark:bg-success-900/30 mr-3">
                <FiFile className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Linear Algebra Formulas</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Generated by AI • 2 days ago</p>
              </div>
              <button className="text-xs text-primary-600 hover:text-primary-500">View</button>
            </div>
            
            <button className="w-full py-2 mt-2 text-sm text-primary-600 hover:text-primary-500 flex items-center justify-center">
              <FiUpload className="mr-1" /> Upload Material
            </button>
          </div>
        </div>
      </div>

      {/* Study sessions schedule */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3 text-gray-900 dark:text-white">Upcoming Study Sessions</h2>
          <button className="text-sm text-primary-600 hover:text-primary-500 flex items-center">
            <FiCalendar className="mr-1" /> View Calendar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject/Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Techniques
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {studyPlan.upcomingStudySessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{session.subject}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{session.topic}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{session.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {session.startTime} - {session.endTime}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <FiClock className="mr-1 h-3 w-3" />
                      {(() => {
                        const [startHour, startMin] = session.startTime.split(':');
                        const [endHour, endMin] = session.endTime.split(':');
                        const startDate = new Date();
                        startDate.setHours(parseInt(startHour), parseInt(startMin.replace(' PM', '').replace(' AM', '')));
                        const endDate = new Date();
                        endDate.setHours(parseInt(endHour), parseInt(endMin.replace(' PM', '').replace(' AM', '')));
                        const diff = (endDate - startDate) / (1000 * 60);
                        return `${diff} min`;
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {session.techniques.map((technique, index) => (
                        <span 
                          key={index} 
                          className="text-xs py-0.5 px-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {technique}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button className="text-primary-600 hover:text-primary-500 mr-3">Edit</button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}