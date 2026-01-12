"use client"
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function PasswordPage() {
  const { accessToken } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (value: string, field: 'new' | 'confirm') => {
    if (field === 'new') {
      setNewPassword(value);
      if (confirmPassword && value !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    } else {
      setConfirmPassword(value);
      if (newPassword && value !== newPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!accessToken) {
        setMessage({ type: 'error', text: 'Authentication required. Please log in again.' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });

        // Clear form
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
      {/* Header Section */}
      <div className="relative mb-8 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Set Password</h1>
        {/* The orange underline under the header title */}
        <div className="absolute bottom-[-1px] left-0 w-16 h-1 bg-[#E9672B]"></div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <form className="w-full space-y-6" onSubmit={handleSubmit}>
        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            New Password *
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value, 'new')}
            placeholder="Enter New Password"
            className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400 outline-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => handlePasswordChange(e.target.value, 'confirm')}
            placeholder="Confirm New Password"
            className={`w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 outline-none ${passwordError ? 'focus:ring-red-400 ring-1 ring-red-400' : 'focus:ring-orange-400'
              }`}
            disabled={isSubmitting}
          />
          {passwordError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {passwordError}
            </p>
          )}
        </div>

        {/* Submit Button Section */}
        <div className="flex justify-start pt-4">
          <button
            type="submit"
            className="bg-[#E9672B] hover:bg-[#d55b24] text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !!passwordError}
          >
            {isSubmitting ? 'Saving...' : 'Save password'}
          </button>
        </div>
      </form>
    </div>
  );
}