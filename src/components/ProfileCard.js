import React from 'react';
import DefaultProfileImage from '../assets/avatars.png'; 

const UserProfileCard = ({ user }) => {

  return (
    <div className="w-3/6 bg-white rounded-lg border-2 overflow-hidden m-4">
      <div className="flex justify-center mt-6">
        <img className="h-24 w-24 rounded-full border-4 border-indigo-300" src={user.profileImage} alt={user.name} />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-indigo-800 text-center mb-2">{user.name}</h2>
        <p className="text-center text-indigo-600 italic mb-4">{user.currentRole} at {user.currentCompany}</p>
        <div className="text-sm text-gray-700">
          <DetailRow label="Total Experience:" value={user.totalExperience || 'N/A'} />
          <DetailRow label="Location:" value={user.location || 'N/A'} />
          <DetailRow label="Degree" value={user.degree || 'N/A'} />
          <DetailRow label="School" value={user.college || 'N/A'} />
          <p className="text-gray-600 text-center mt-4">{user.about || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};


const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center mb-2">
    <span className="text-left">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);


export default UserProfileCard;
