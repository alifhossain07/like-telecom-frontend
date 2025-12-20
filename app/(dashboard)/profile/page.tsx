import React from 'react';

export default function ProfilePage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-[26px] font-semi text-gray-800 mb-8">My Account Information</h1>

      <form className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full-name *</label>
          <input 
            type="text" 
            placeholder="Enter Name" 
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">E-mail address *</label>
            <input 
              type="email" 
              placeholder="Enter Email" 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <button type="button" className="md:mt-7 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Send OTP
          </button>
        </div>

        {/* Name / Phone */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Number *</label>
            <input 
              type="text" 
              placeholder="Enter Name" 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <button type="button" className="md:mt-7 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Send OTP
          </button>
        </div>

        {/* Birthday and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Birthday *</label>
            <input 
              type="date" 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender *</label>
            <select className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all appearance-none">
              <option value="">Enter Name</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-sm font-semibold mb-2">Full Address*</label>
          <textarea 
            rows={3}
            placeholder="Enter Name" 
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-12 rounded-lg transition-transform active:scale-95"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}