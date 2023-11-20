import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import UpcomingTable from '../../components/UpcomingTable';
import Footer from '../../components/Footer';
import DividerWithLabels from '../../components/Divider';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('googleAuthToken');
    if (token) {
      setIsAuthenticated(true);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('googleAuthToken', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {isAuthenticated && (
          <div>
            <div className="container mx-auto mt-8">
              <h2 className="text-2xl text-center font-semibold mb-2">Past Events</h2>
              <DividerWithLabels leftLabel="" rightLabel="" />
              <Table />
            </div>
            <div className="container mx-auto mt-8">
              <h2 className="text-2xl text-center font-semibold mb-2">Upcoming Events</h2>
              <DividerWithLabels leftLabel="" rightLabel="" />
              <UpcomingTable />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
