import { 
  FiUsers, 
  FiMessageSquare, 
  FiSearch, 
  FiStar, 
  FiPlusCircle, 
  FiFilter, 
  FiBook,
  FiCalendar,
  FiClock,
  FiFileText,
  FiThumbsUp
} from "react-icons/fi";

// Sample data for study groups
const studyGroups = [
  {
    id: 1,
    name: "Quantum Physics Study Group",
    course: "Physics 101",
    members: 24,
    activity: "High",
    lastActive: "2 hours ago",
    isMember: true
  },
  {
    id: 2,
    name: "Literary Analysis Circle",
    course: "World Literature",
    members: 18,
    activity: "Medium",
    lastActive: "Yesterday",
    isMember: true
  },
  {
    id: 3,
    name: "Linear Algebra Problem Solvers",
    course: "Mathematics",
    members: 32,
    activity: "High",
    lastActive: "Just now",
    isMember: false
  },
  {
    id: 4,
    name: "Python Programming Workshop",
    course: "Intro to CS",
    members: 42,
    activity: "Medium",
    lastActive: "3 days ago",
    isMember: false
  }
];

// Add AI chatbot data
const aiChatbots = [
  {
    id: 1,
    name: "StudyBot",
    initials: "SB",
    role: "Study Strategy Expert",
    color: "primary"
  },
  {
    id: 2,
    name: "MathBot",
    initials: "MB", 
    role: "Math Expert",
    color: "secondary"
  },
  {
    id: 3, 
    name: "ReviewBot",
    initials: "RB",
    role: "Peer Reviewer",
    color: "success"
  }
];

// Modify a discussion to include AI responses
const communityDiscussions = [
  {
    id: 1,
    title: "Understanding Wave-Particle Duality",
    author: {
      name: "Alex Johnson",
      initials: "AJ"
    },
    course: "Physics 101",
    replies: 15,
    views: 128,
    timePosted: "4 hours ago",
    isHot: true,
    responses: [
      {
        id: 1,
        author: aiChatbots[0],
        text: "Let me help explain wave-particle duality. It's a central concept in quantum mechanics where particles can exhibit both wave and particle properties...",
        timePosted: "3 hours ago"
      },
      {
        id: 2,
        author: aiChatbots[1],
        text: "Adding to StudyBot's explanation, we can see this mathematically through the de Broglie equation: λ = h/p...",
        timePosted: "3 hours ago"
      },
      {
        id: 3,
        author: aiChatbots[2],
        text: "Great explanations! I'd also suggest checking out the double-slit experiment visualization in our resources section...",
        timePosted: "3 hours ago"
      }
    ]
  },
  {
    id: 2,
    title: "Best approach for analyzing Shakespeare's sonnets?",
    author: {
      name: "Emma Rodriguez",
      initials: "ER"
    },
    course: "World Literature",
    replies: 8,
    views: 64,
    timePosted: "Yesterday",
    isHot: false
  },
  {
    id: 3,
    title: "Tips for solving complex eigenvalue problems",
    author: {
      name: "Michael Chen",
      initials: "MC"
    },
    course: "Mathematics",
    replies: 22,
    views: 196,
    timePosted: "2 days ago",
    isHot: true
  },
  {
    id: 4,
    title: "Struggling with recursive functions in Python",
    author: {
      name: "Sophia Williams",
      initials: "SW"
    },
    course: "Intro to CS",
    replies: 12,
    views: 85,
    timePosted: "3 days ago",
    isHot: false
  }
];

// Sample data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Physics Exam Prep Session",
    organizer: "Quantum Physics Study Group",
    date: "Tomorrow",
    time: "6:00 PM - 8:00 PM",
    attendees: 18,
    maxAttendees: 25
  },
  {
    id: 2,
    title: "Literary Analysis Workshop",
    organizer: "Prof. Williams",
    date: "Apr 18, 2025",
    time: "4:00 PM - 5:30 PM",
    attendees: 12,
    maxAttendees: 30
  },
  {
    id: 3,
    title: "Math Problem Solving Marathon",
    organizer: "Linear Algebra Problem Solvers",
    date: "Apr 20, 2025",
    time: "10:00 AM - 2:00 PM",
    attendees: 24,
    maxAttendees: 40
  }
];

// Sample data for shared resources
const sharedResources = [
  {
    id: 1,
    title: "Quantum Mechanics Cheat Sheet",
    type: "PDF",
    author: {
      name: "Alex Johnson",
      initials: "AJ"
    },
    course: "Physics 101",
    downloads: 87,
    rating: 4.8,
    timeShared: "2 days ago"
  },
  {
    id: 2,
    title: "Literary Devices in Shakespeare's Works",
    type: "Notes",
    author: {
      name: "Emma Rodriguez",
      initials: "ER"
    },
    course: "World Literature",
    downloads: 42,
    rating: 4.5,
    timeShared: "1 week ago"
  },
  {
    id: 3,
    title: "Matrix Operations Reference Guide",
    type: "PDF",
    author: {
      name: "Michael Chen",
      initials: "MC"
    },
    course: "Mathematics",
    downloads: 115,
    rating: 4.9,
    timeShared: "3 days ago"
  },
  {
    id: 4,
    title: "Python Recursion Examples",
    type: "Code",
    author: {
      name: "Sophia Williams",
      initials: "SW"
    },
    course: "Intro to CS",
    downloads: 64,
    rating: 4.6,
    timeShared: "5 days ago"
  }
];

export default function Community() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="heading-1 text-gray-900 dark:text-white">Community</h1>
        <div className="flex items-center space-x-2">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search community..."
            />
          </div>
          <button className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiFilter className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
            <FiPlusCircle className="h-4 w-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Community stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card flex flex-col items-center p-6">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-3">
            <FiUsers className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">124</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Study Buddies</p>
        </div>
        
        <div className="card flex flex-col items-center p-6">
          <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/30 mb-3">
            <FiMessageSquare className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">58</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Discussions</p>
        </div>
        
        <div className="card flex flex-col items-center p-6">
          <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/30 mb-3">
            <FiBook className="h-6 w-6 text-success-600 dark:text-success-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">210</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Shared Resources</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussion board section */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3 text-gray-900 dark:text-white">
              <FiMessageSquare className="inline-block mr-2 text-primary-500" />
              Discussion Board
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-500">
              View all discussions
            </button>
          </div>

          <div className="space-y-4">
            {communityDiscussions.map((discussion) => (
              <div 
                key={discussion.id} 
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-medium">{discussion.author.initials}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {discussion.title}
                        {discussion.isHot && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 rounded-full">
                            Hot
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {discussion.timePosted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">by {discussion.author.name}</span>
                        <span className="text-xs py-0.5 px-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                          {discussion.course}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <FiMessageSquare className="h-3 w-3 mr-1" /> {discussion.replies}
                        </span>
                        <span className="flex items-center">
                          <FiUsers className="h-3 w-3 mr-1" /> {discussion.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* AI Responses */}
                {discussion.responses && (
                  <div className="mt-4 pl-12 space-y-4">
                    {discussion.responses.map((response) => (
                      <div key={response.id} className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className={`h-8 w-8 rounded-full bg-${response.author.color}-100 dark:bg-${response.author.color}-900/50 flex items-center justify-center`}>
                            <span className={`text-${response.author.color}-600 dark:text-${response.author.color}-400 text-xs font-medium`}>
                              {response.author.initials}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                              {response.author.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {response.author.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {response.text}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {response.timePosted}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <button className="w-full py-2 text-sm text-primary-600 hover:text-primary-500 border border-gray-200 dark:border-gray-800 rounded-lg">
              Load More Discussions
            </button>
          </div>
        </div>

        {/* Upcoming events section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3 text-gray-900 dark:text-white">
              <FiCalendar className="inline-block mr-2 text-secondary-500" />
              Upcoming Events
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <FiUsers className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{event.organizer}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {event.attendees} / {event.maxAttendees} attending
                  </div>
                  <button className="px-3 py-1 text-xs text-primary-600 hover:text-primary-500 border border-primary-600 hover:border-primary-500 rounded-full">
                    RSVP
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-2 text-sm text-secondary-600 hover:text-secondary-500 border border-gray-200 dark:border-gray-800 rounded-lg">
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Study groups */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiUsers className="inline-block mr-2 text-primary-500" />
            Study Groups
          </h2>
          <button className="text-sm text-primary-600 hover:text-primary-500 flex items-center">
            <FiPlusCircle className="mr-1" /> Create Study Group
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {studyGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{group.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{group.members}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        group.activity === 'High'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300'
                          : 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300'
                      }`}
                    >
                      {group.activity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{group.lastActive}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    {group.isMember ? (
                      <span className="text-success-600 dark:text-success-400 mr-3">Joined</span>
                    ) : (
                      <button className="text-primary-600 hover:text-primary-500 mr-3">Join</button>
                    )}
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shared study resources */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiFileText className="inline-block mr-2 text-primary-500" />
            Shared Resources
          </h2>
          <button className="text-sm text-primary-600 hover:text-primary-500 flex items-center">
            <FiPlusCircle className="mr-1" /> Share Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sharedResources.map((resource) => (
            <div 
              key={resource.id} 
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium py-1 px-2 rounded-full ${
                  resource.type === 'PDF' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300' :
                  resource.type === 'Notes' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
                  resource.type === 'Code' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  {resource.type}
                </span>
                <div className="flex items-center">
                  <FiStar className="h-3 w-3 text-warning-500 mr-1" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{resource.rating}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{resource.title}</h3>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>{resource.course}</span>
                <span className="mx-1">•</span>
                <span>{resource.timeShared}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-1">
                    <span className="text-xs text-primary-600 dark:text-primary-400">{resource.author.initials}</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{resource.author.name}</span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FiThumbsUp className="h-3 w-3 mr-1" />
                  <span>{resource.downloads}</span>
                </div>
              </div>
              
              <button className="w-full mt-3 py-1 text-xs text-primary-600 hover:text-primary-500 border border-gray-200 dark:border-gray-700 rounded">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}