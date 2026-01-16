"use client";
import { useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { authApi } from "../lib/api"; // 👈 Make sure this path is correct

// Helper function to upload the file to your backend and track progress
const uploadToCloudinary = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true); 
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.url);
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed due to a network error."));
    xhr.send(formData);
  });
};


export default function UserAvatar({ user, onUpdateUser }) { // ✅ CHANGED: Prop is now onUpdateUser
  const fileInputRef = useRef(null);
  // ✅ NEW: State for tracking upload progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Your custom fallback pictures are kept
  const fallbackAvatars = [
    "https://res.cloudinary.com/dy0l4pnjh/image/upload/v1758702250/Screenshot_2025-09-24_134934_ug6zgi.png",
    "https://res.cloudinary.com/dy0l4pnjh/image/upload/v1758702287/Screenshot_2025-09-24_134949_ppqbvz.png",
    "https://res.cloudinary.com/dy0l4pnjh/image/upload/v1758702302/Screenshot_2025-09-24_135005_waxbs4.png",
    "https://res.cloudinary.com/dy0l4pnjh/image/upload/v1758702311/Screenshot_2025-09-24_135023_ej8jo7.png",
    "https://res.cloudinary.com/dy0l4pnjh/image/upload/v1758702321/Screenshot_2025-09-24_135120_gphyes.png",
    "https://res.cloudinary.com/dy0l4pnjh/image/upload/v1758702331/Screenshot_2025-09-24_135136_bjdszn.png",
  ];

  const randomAvatar = useMemo(() => {
    const index = user?.username
      ? user.username.charCodeAt(0) % fallbackAvatars.length
      : Math.floor(Math.random() * fallbackAvatars.length);
    // ✅ CHANGED: Removed the unnecessary timestamp for static Cloudinary URLs
    return fallbackAvatars[index];
  }, [user?.username]);

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current.click();
    }
  };

  // ✅ CHANGED: Replaced old handler with the full upload logic
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const avatarUrl = await uploadToCloudinary(file, setUploadProgress);
      if (avatarUrl) {
        const updatedUser = await authApi.updateProfile({ avatarUrl });
        onUpdateUser(updatedUser); // Notify the parent page of the change
      }
    } catch (error) {
      console.error("Upload process failed:", error);
      // You could add a toast notification for the error here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: isUploading ? 1 : 1.05 }}
        className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl group"
        style={{ cursor: isUploading ? 'progress' : 'pointer' }}
        onClick={handleClick}
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.username || 'User avatar'} className="w-full h-full object-cover" />
        ) : (
          <img src={randomAvatar} alt="Random Avatar" className="w-full h-full object-cover" />
        )}

        {/* ✅ NEW: Conditional UI for showing upload progress */}
        {isUploading ? (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold text-xl">
            {`${uploadProgress}%`}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <Camera className="w-8 h-8 text-white" />
          </motion.div>
        )}
      </motion.div>

      <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}