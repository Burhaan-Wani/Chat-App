import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: authUser.fullName,
    profilePic: "",
  });

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setFormData(formData => ({ ...formData, profilePic: base64Image }));
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await updateProfile(formData);
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={
                    formData.profilePic || authUser.profilePic || "/avatar.png"
                  }
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">FullName</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.fullName}
                  onChange={e =>
                    setFormData(formData => ({
                      ...formData,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={authUser.email}
                  disabled={true}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Update"
              )}
            </button>
          </form>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
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
