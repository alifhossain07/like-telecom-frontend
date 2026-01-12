
"use client";
import { useAuth } from '@/app/context/AuthContext';
import React, { useState } from 'react';

export default function ProfilePage() {
  const { user, loading, refreshUser, accessToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null); // To show preview
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isImageSubmitting, setIsImageSubmitting] = useState(false);
  const [imageMessage, setImageMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const openModal = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        password: ''
      });
      setIsModalOpen(true);
      setMessage(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', password: '' });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!accessToken) {
        setMessage({ type: 'error', text: 'Authentication required. Please log in again.' });
        setIsSubmitting(false);
        return;
      }

      const body: Record<string, string> = {
        name: formData.name,
        phone: formData.phone
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        body.password = formData.password;
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });

        // Refresh user data
        if (refreshUser) {
          await refreshUser();
        }

        // Close modal after a short delay
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image handling functions
  const openImageModal = () => {
    setProfileImage(user?.avatar || null);
    setSelectedImageFile(null);
    setImageMessage(null);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageFile(null);
    setProfileImage(user?.avatar || null);
    setImageMessage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSubmit = async () => {
    if (!selectedImageFile || !accessToken) return;

    setIsImageSubmitting(true);
    setImageMessage(null);

    try {
      const base64Image = await fileToBase64(selectedImageFile);

      const payload = {
        image: base64Image,
        filename: selectedImageFile.name
      };

      const response = await fetch('/api/profile/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        setImageMessage({ type: 'success', text: 'Profile image updated successfully!' });

        // Refresh user data
        if (refreshUser) {
          await refreshUser();
        }

        // Close modal after a short delay
        setTimeout(() => {
          closeImageModal();
        }, 1500);
      } else {
        setImageMessage({ type: 'error', text: data.message || 'Failed to update profile image' });
      }
    } catch (error) {
      console.error('Profile image update error:', error);
      setImageMessage({ type: 'error', text: 'An error occurred while updating profile image' });
    } finally {
      setIsImageSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-[26px] font-semi text-gray-800 mb-4">Please log in to view your profile</h1>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 relative bg-gray-50">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              onClick={openImageModal}
              className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
              title="Change Profile Photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div>
            <h1 className="text-[26px] font-semi text-gray-800">Welcome, {user.name}!</h1>
            <p className="text-gray-500 text-sm">Manage your profile and account settings</p>
          </div>
        </div>

        <h2 className="text-lg text-gray-600 mb-6">My Account Information</h2>

        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full-name *</label>
            <input
              type="text"
              value={user.name}
              placeholder="Enter Name"
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
              readOnly
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="text"
                value={user.phone || ''}
                placeholder="No phone provided"
                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                readOnly
              />
            </div>
          </div>

          {/* Account Created Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Member Since</label>
            <input
              type="text"
              value={user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
              readOnly
            />
          </div>

          {/* Update Profile Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={openModal}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-12 rounded-lg transition-transform active:scale-95"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>

            {/* Message Display */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            {/* Update Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password (Optional)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Change Profile Photo</h2>

            {imageMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm text-center ${imageMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {imageMessage.text}
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 relative group">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}

                <label className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center cursor-pointer transition-all group-hover:bg-opacity-30">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <div className="text-white opacity-0 group-hover:opacity-100 flex flex-col items-center transform scale-90 group-hover:scale-100 transition-all">
                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-semibold">Select Photo</span>
                  </div>
                </label>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={handleImageSubmit}
                  disabled={!selectedImageFile || isImageSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImageSubmitting ? 'Uploading...' : 'Save Photo'}
                </button>
                <button
                  onClick={closeImageModal}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                  disabled={isImageSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}