import React from 'react';
import DividerWithLabels from '../components/Divider'; 

const ExtraInsightsCard = ({ newsItems }) => {
  return (
    <div className="max-w-md bg-white rounded-lg border-2 overflow-hidden m-4">
      <h2 className="text-xl text-center font-semibold text-gray-800 p-2 mb-4">Extra Insights Curated with Love By AttendeesAI</h2>
      {newsItems.map((item, index) => (
        <div key={index}>
          <h3 className="font-semibold p-2 text-center text-gray-700">{item.title}</h3>
          <p className="text-gray-600 text-center p-2">{item.description}</p>
          {index < newsItems.length - 1 && <DividerWithLabels />}
        </div>
      ))}
    </div>
  );
};

export default ExtraInsightsCard;
