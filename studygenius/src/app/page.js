import Image from "next/image";
import Link from "next/link";
import { FiBook, FiBarChart, FiUsers, FiClock, FiTarget } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">StudyGenius AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div className="pt-16 pb-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Level up your</span>
                <span className="block text-primary-600 dark:text-primary-400">study sessions</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg">
                Your AI-powered study companion for academic success. StudyGenius helps you learn more effectively with personalized study plans, progress tracking, and collaborative learning.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Get started for free
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-300 dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 relative lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden">
                <Image
                  width={800}
                  height={600}
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80"
                  alt="Students collaborating"
                  className="w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to excel in your studies
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              StudyGenius combines AI-powered tools with proven study techniques to help you achieve your academic goals.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start">
                <div className="p-3 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <FiTarget className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Personalized Study Plans</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  AI-generated study schedules tailored to your learning style, goals, and deadlines.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start">
                <div className="p-3 rounded-md bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400">
                  <FiBarChart className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Progress Tracking</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Visualize your progress, identify strengths and weaknesses, and optimize your study habits.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start">
                <div className="p-3 rounded-md bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400">
                  <FiUsers className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Collaborative Learning</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Connect with study buddies, join study groups, and share resources with peers.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start">
                <div className="p-3 rounded-md bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400">
                  <FiClock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Time Management</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Optimize your study time with focus timers, breaks, and productivity metrics.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start">
                <div className="p-3 rounded-md bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400">
                  <FiBook className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Smart Resources</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  AI-curated study materials, practice quizzes, and learning resources based on your courses.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start">
                <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6M4 19h16c0.6 0 1-0.4 1-1V6c0-0.6-0.4-1-1-1H4C3.4 5 3 5.4 3 6v12c0 0.6 0.4 1 1 1z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Cross-Platform</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Access your study dashboard from any device - desktop, tablet, or mobile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Hear from our users
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xl font-bold text-primary-700 dark:text-primary-300">
                  J
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">James K.</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Physics Major</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "StudyGenius helped me organize my complex physics coursework. The AI-generated study plans were spot on, and I saw my grades improve by the second month of using it."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center text-xl font-bold text-secondary-700 dark:text-secondary-300">
                  M
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Maria S.</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medical Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The collaborative features were a game-changer for my study group. We could share resources, track progress together, and hold each other accountable."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center text-xl font-bold text-success-700 dark:text-success-300">
                  L
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Liam T.</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The analytics provided deep insights into my study habits. I discovered my most productive hours and optimized my schedule accordingly. Highly recommend!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star, i) => (
                  <svg key={star} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600 dark:bg-primary-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your academic performance?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join thousands of students who are achieving their academic goals with StudyGenius AI.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Get started today
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Features
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Pricing
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Blog
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Terms
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Privacy
              </a>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-500 dark:text-gray-400">
            &copy; 2025 StudyGenius AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
