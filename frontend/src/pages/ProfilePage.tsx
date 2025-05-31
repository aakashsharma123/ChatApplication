import { Camera, Mail, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { isUpdatingProfile, authUser ,updateProfile } = useAuthStore();
  const [selectedImage , setSelectedImage] = useState<string | null>(null);
  console.log("selectedImage", selectedImage);
  const [memberSince, setMemberSince] = useState('Loading...');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64Image : any = reader.result ;
      setSelectedImage(base64Image);
      updateProfile({ profilePic: base64Image });
    };
    reader.onerror = () => {
      console.error('Error reading file');
    }

  };

  useEffect(() => {
    if (authUser?.message?.createdAt) {
      const formattedDate = new Date(authUser.message.createdAt).getFullYear();
      setMemberSince(formattedDate.toString());
    }
  }, [authUser]);

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.message.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange} // ✅ Correct file input handler
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? 'Updating...' : 'Click to change profile picture'}
            </p>
          </div>

          {/* user details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.message?.fullName || 'no name'}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.message?.email || 'no email'}
              </p>
            </div>
          </div>

          {/* account info */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{memberSince}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
