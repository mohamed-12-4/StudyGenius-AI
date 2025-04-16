import { FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar, FiClock, FiBook, FiAward } from "react-icons/fi";

export default function Analytics() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="heading-1 text-gray-900 dark:text-white">Analytics & Insights</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Period:</span>
          <select className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last semester</option>
            <option>All time</option>
          </select>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center p-4">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 mr-3">
            <FiClock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Study Time</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">46.5 hrs</p>
            <p className="text-xs text-success-600 dark:text-success-400 flex items-center">
              <FiTrendingUp className="mr-1" /> +12% from last week
            </p>
          </div>
        </div>
        
        <div className="card flex items-center p-4">
          <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/30 mr-3">
            <FiBook className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Tasks</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">24/36</p>
            <p className="text-xs text-warning-600 dark:text-warning-400 flex items-center">
              <FiTrendingUp className="mr-1" /> +5% from last week
            </p>
          </div>
        </div>
        
        <div className="card flex items-center p-4">
          <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/30 mr-3">
            <FiCalendar className="h-6 w-6 text-success-600 dark:text-success-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Sessions</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">18</p>
            <p className="text-xs text-success-600 dark:text-success-400 flex items-center">
              <FiTrendingUp className="mr-1" /> +20% from last week
            </p>
          </div>
        </div>
        
        <div className="card flex items-center p-4">
          <div className="p-3 rounded-full bg-warning-100 dark:bg-warning-900/30 mr-3">
            <FiAward className="h-6 w-6 text-warning-600 dark:text-warning-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Focus Score</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">82/100</p>
            <p className="text-xs text-success-600 dark:text-success-400 flex items-center">
              <FiTrendingUp className="mr-1" /> +7% from last week
            </p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study time by subject */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3 text-gray-900 dark:text-white">
              <FiBarChart2 className="inline-block mr-2 text-primary-500" />
              Study Time by Subject
            </h2>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            {/* Chart would be rendered here with a library like Chart.js */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-w-md">
                {/* Physics subject bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Physics 101</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">15.2 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-primary-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                {/* Literature subject bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">World Literature</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">12.8 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-secondary-500 h-3 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
                
                {/* Mathematics subject bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Mathematics</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">10.5 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-success-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                {/* CS subject bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Intro to CS</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">8.0 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-warning-500 h-3 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Weekly study pattern */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3 text-gray-900 dark:text-white">
              <FiPieChart className="inline-block mr-2 text-secondary-500" />
              Study Time Distribution
            </h2>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            {/* Chart would be rendered here with a library like Chart.js */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {/* Time of day distribution */}
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time of Day</h3>
                <div className="flex justify-between items-center h-10">
                  <div className="flex-1 bg-primary-200 dark:bg-primary-900/30 h-full rounded-l-lg"></div>
                  <div className="flex-1 bg-primary-300 dark:bg-primary-800/40 h-full"></div>
                  <div className="flex-1 bg-primary-400 dark:bg-primary-700/50 h-full"></div>
                  <div className="flex-1 bg-primary-500 dark:bg-primary-600/60 h-full"></div>
                  <div className="flex-1 bg-primary-600 dark:bg-primary-500/70 h-full"></div>
                  <div className="flex-1 bg-primary-700 dark:bg-primary-400/80 h-full rounded-r-lg"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>6AM</span>
                  <span>10AM</span>
                  <span>2PM</span>
                  <span>6PM</span>
                  <span>10PM</span>
                </div>
              </div>
              
              {/* Study technique breakdown */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Study Techniques</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Active Recall (40%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary-500 mr-2"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Spaced Repetition (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Focused Sessions (20%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-warning-500 mr-2"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Other Methods (15%)</span>
                  </div>
                </div>
              </div>
              
              {/* Weekly trend */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Weekly Pattern</h3>
                <div className="flex justify-between items-end h-24">
                  <div className="w-6 bg-secondary-500/80 dark:bg-secondary-500/50 rounded-t-sm" style={{ height: '40%' }}>
                    <div className="text-xs text-center mt-2">M</div>
                  </div>
                  <div className="w-6 bg-secondary-500/80 dark:bg-secondary-500/50 rounded-t-sm" style={{ height: '60%' }}>
                    <div className="text-xs text-center mt-2">T</div>
                  </div>
                  <div className="w-6 bg-secondary-500/80 dark:bg-secondary-500/50 rounded-t-sm" style={{ height: '75%' }}>
                    <div className="text-xs text-center mt-2">W</div>
                  </div>
                  <div className="w-6 bg-secondary-500/80 dark:bg-secondary-500/50 rounded-t-sm" style={{ height: '90%' }}>
                    <div className="text-xs text-center mt-2">T</div>
                  </div>
                  <div className="w-6 bg-secondary-500/80 dark:bg-secondary-500/50 rounded-t-sm" style={{ height: '65%' }}>
                    <div className="text-xs text-center mt-2">F</div>
                  </div>
                  <div className="w-6 bg-secondary-500/80 dark:bg-secondary-500/50 rounded-t-sm" style={{ height: '45%' }}>
                    <div className="text-xs text-center mt-2">S</div>
                  </div>
                  <div className="w-6 bg-secondary-500/80 dark:bg-secondary-500/50 rounded-t-sm" style={{ height: '30%' }}>
                    <div className="text-xs text-center mt-2">S</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity insights */}
        <div className="card">
          <h2 className="heading-3 text-gray-900 dark:text-white mb-4">Productivity Insights</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 p-1 rounded-full bg-primary-100 dark:bg-primary-900/30 mt-0.5 mr-3">
                <FiTrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Peak Productivity Time</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You're most productive between <span className="font-medium">3 PM - 6 PM</span>. Consider scheduling challenging tasks during this period.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 p-1 rounded-full bg-secondary-100 dark:bg-secondary-900/30 mt-0.5 mr-3">
                <FiClock className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Optimal Session Length</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your focus peaks in <span className="font-medium">45-minute sessions</span> with short breaks. Try the Pomodoro technique.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 p-1 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 mr-3">
                <FiBook className="h-4 w-4 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Learning Strength</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You excel with <span className="font-medium">visual learning methods</span>. Try more diagrams and mind maps.
                </p>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Areas for improvement */}
        <div className="card">
          <h2 className="heading-3 text-gray-900 dark:text-white mb-4">Areas for Improvement</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Mathematics - Consistency
                </p>
                <span className="text-xs py-0.5 px-2 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 rounded-full">
                  Priority
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Consider scheduling regular short study sessions instead of infrequent long ones.
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-warning-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Physics - Practice Problems
                </p>
                <span className="text-xs py-0.5 px-2 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 rounded-full">
                  Priority
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Increase time spent on solving practice problems to strengthen practical application.
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-warning-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Literature - Critical Analysis
                </p>
                <span className="text-xs py-0.5 px-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full">
                  Moderate
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Focus more on critical analysis techniques and peer discussion for deeper understanding.
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-gray-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skill development progress */}
        <div className="card">
          <h2 className="heading-3 text-gray-900 dark:text-white mb-4">Skill Development</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Quantum Physics Concepts</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">68%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +12% improvement in the last 2 weeks
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Literary Analysis</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +8% improvement in the last 2 weeks
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Matrix Operations</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">82%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +15% improvement in the last 2 weeks
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Python Programming</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">30%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +5% improvement in the last 2 weeks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}