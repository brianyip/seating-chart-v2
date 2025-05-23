'use client'

import Image from "next/image";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
              Seating Chart Planner
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Create beautiful, organized seating arrangements for your events. 
              Perfect for weddings, conferences, and special occasions.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Guest Management</h3>
              <p className="text-slate-600">
                Easily manage your guest list and assign seats with drag-and-drop functionality.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Visual Layout</h3>
              <p className="text-slate-600">
                Create beautiful table layouts and visualize your seating arrangement in real-time.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Export & Share</h3>
              <p className="text-slate-600">
                Export your seating charts and share them with your team or vendors.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-600 mb-6">
              Sign up now to create your first seating chart and make your event planning effortless.
            </p>
            <div className="flex justify-center">
              <div className="text-sm text-slate-500">
                Click "Sign Up" in the navigation bar above to begin
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">© 2024 Seating Chart Planner</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
