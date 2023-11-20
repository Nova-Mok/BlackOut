import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DividerWithLabels from '../../components/Divider';
import UserProfileCard from '../../components/ProfileCard';
import CompanyCard from '../../components/CompanyCard';
import LoadingSkeleton from '../../components/LoadingSkeletion';
import Modal from '../../components/Modal';

const Info = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const attendees = searchParams.get('attendees');
    if (attendees) {
      const emails = attendees.split(',').map(email => email.trim());
      fetchLinkedInProfiles(emails);
      setIsModalOpen(true);
      setModalMessage('Getting User Profile Please wait...');
    }
  }, []);

  const fetchCompanyDetails = async (domain) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/company/${domain}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }
      const data = await response.json();
      setCompanyData(prevData => ({ ...prevData, [domain]: data }));
      return data;
    } catch (error) {
      console.error('Error fetching company data:', error);
      return {}; 
    }
  };

  const fetchLinkedInProfiles = async (emails) => {
    setIsLoading(true);
    setIsModalOpen(true);
    setModalMessage('Getting User Profile Please wait...');
  
    try {
      const idPromises = emails.map(email =>
        fetch('http://127.0.0.1:5000/get_linkedin_id_from_google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        }).then(res => res.json())
      );
  
      const idResponses = await Promise.all(idPromises);
  
      const profileAndCompanyPromises = idResponses.map((idData, index) => {
        const linkedinId = idData.linkedin_id;
        const email = emails[index];
        const domain = email.split('@')[1];
  
        const profilePromise = linkedinId ? 
          fetch('http://127.0.0.1:5000/get_linkedin_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_name: linkedinId })
          }).then(res => res.json()) : 
          Promise.resolve(null);
  
        const companyPromise = !companyData[domain] ? 
          fetchCompanyDetails(domain) : 
          Promise.resolve(companyData[domain]);
  
        return Promise.all([profilePromise, companyPromise]).then(([profileData, companyData]) => {
          return profileData ? transformProfileData(profileData, email) : null;
        });
      });
  
      const profiles = (await Promise.all(profileAndCompanyPromises)).filter(profile => profile !== null);
      setUserProfiles(profiles);
      setModalMessage('Success! Profiles fetched.');
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (error) {
      console.error("Error fetching LinkedIn data", error);
      setModalMessage('Failed to fetch profiles.');
      setTimeout(() => setIsModalOpen(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const extractImageFromArtifacts = (source) => {
    if (!source) return '';
    const root = source?.displayPictureUrl;
    const image = source.img_100_100 || source.img_200_200 || source.img_400_400 || source.img_800_800 || '';
    return `${root || ''}${image || ''}`;
  };

  const transformProfileData = (profileData, email) => {
    const mostRecentEducation = profileData.education[0] || {};
    return {
      name: `${profileData.firstName} ${profileData.lastName}`,
      location: profileData.geoLocationName || profileData.locationName,
      profileImage: extractImageFromArtifacts(profileData),
      totalExperience: calculateTotalExperience(profileData.experience),
      currentRole: profileData.experience[0]?.title,
      currentCompany: profileData.experience[0]?.companyName,
      degree: mostRecentEducation.degreeName || 'Not Available',
      college: mostRecentEducation.schoolName || 'Not Available',
      email: email,
      about: profileData.summary
    };
  };

  const calculateTotalExperience = (experienceArray) => {
    let totalExperience = 0;
    experienceArray.forEach((exp) => {
      const startYear = exp.timePeriod?.startDate?.year;
      const endYear = exp.timePeriod?.endDate?.year || new Date().getFullYear();
      if (startYear) totalExperience += (endYear - startYear);
    });
    return totalExperience + ' years';
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <Modal isOpen={isModalOpen} message={modalMessage} />
        <div className="container mx-auto mt-8">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Modal isOpen={isModalOpen} message={modalMessage} />
      <main className="flex-grow">
        <div className="container mx-auto mt-8">
          <h2 className="text-2xl text-center font-semibold mb-2">Attendee Insights</h2>
          {userProfiles.map((profile, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col md:flex-row justify-around items-center">
                <UserProfileCard user={profile} />
                <CompanyCard company={companyData[profile.email.split('@')[1]] || {}} />
              </div>
              {index < userProfiles.length - 1 && <DividerWithLabels leftLabel="" rightLabel="" />}
            </React.Fragment>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
  
};

export default Info;
