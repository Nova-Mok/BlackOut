import React from 'react';
import CompanyLogo from '../assets/avatars.png'; 

const CompanyCard = ({ company }) => {
  const defaultData = {
    name: 'Not Available',
    location: 'Not Available',
    description: 'No description available.',
    headCount: 'N/A',
    technology: 'N/A',
    raised: 'N/A',
    crunchbase: { handle: '#' } 
  };

  const companyInfo = { ...defaultData, ...company };
  console.log('Crunchbase URL:', companyInfo.crunchbase.handle);
  const crunchbaseHandle = companyInfo.crunchbase.handle;
  const crunchbaseUrl = `https://www.crunchbase.com/${crunchbaseHandle}`;

  return (
    <div className="w-3/6 min-h-full bg-white rounded-lg border-2 overflow-hidden m-4">
      <div className="flex justify-center mt-4">
        <img className="h-20 w-20 object-cover" src={companyInfo.logo || CompanyLogo} alt={companyInfo.name} />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center">{companyInfo.name}</h2>
        <p className="text-sm text-gray-600 text-center">{companyInfo.location}</p>
        <p className="text-sm text-gray-600 mt-2">{companyInfo.description}</p>

        <div className="flex justify-between mt-4">
          <span className="text-gray-600 text-sm">Headcount</span>
          <span className="text-gray-600 text-sm">{companyInfo.metrics.employees}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600 text-sm">Category</span>
          <span className="text-gray-600 text-sm">{companyInfo.category.sector}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600 text-sm">Raised</span>
          <span className="text-gray-600 text-sm">{companyInfo.metrics.raised || 'N/A'}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600 text-sm">Founded Year</span>
          <span className="text-gray-600 text-sm">{companyInfo.foundedYear || 'N/A'}</span>
        </div>


        <div className="text-center mt-4">
        <a href={crunchbaseUrl} target="_blank" rel="noopener noreferrer" className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">
            Crunchbase
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
