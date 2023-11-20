import React, { useState, useEffect } from 'react';
import Modal from './TableModal';

const Table = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 8;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('googleAuthToken');
      if (token) {
        try {
          const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
              headers: { Authorization: `Bearer ${token}` },
            });
          if (response.ok) {
            const data = await response.json();
            setEvents(data.items);
          } else {
            console.error("Failed to fetch events");
          }
        } catch (error) {
          console.error("Error fetching events: ", error);
        }
        setIsLoading(false); 
      }
    };

    fetchEvents();
  }, [localStorage.getItem('googleAuthToken')]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const formattedEvents = events.map(event => ({
    date: event.start ? (event.start.dateTime || event.start.date) : 'No date',
    eventName: event.summary || 'No title',
    attendees: event.attendees ? event.attendees.map(att => att.email).join(', ') : 'No attendees',
    count: event.attendees ? event.attendees.length : 0,
  }));

  const currentItems = formattedEvents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalItems = events.length;
  const firstItemShown = (currentPage - 1) * itemsPerPage + 1;
  const lastItemShown = Math.min(firstItemShown + itemsPerPage - 1, totalItems);

  const renderAttendees = (attendees) => {
    const attendeeEmails = attendees.split(', ');
    const displayedEmails = attendeeEmails.slice(0, 2);
    const additionalEmails = attendeeEmails.slice(2);

    const openModalWithAttendees = () => {
      setModalContent(additionalEmails);
      setModalOpen(true);
    };

    return (
      <div className="flex items-center">
        <span>{displayedEmails.join(', ')}</span>
        {additionalEmails.length > 0 && (
            <button className="ml-2 bg-blue-500 text-white hover:bg-blue-700 px-1 py-0.5 text-xs rounded" onClick={openModalWithAttendees}>
  +
</button>
        )}
      </div>
    );
  };

  const LoadingSkeleton = () => {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-300 h-4 w-3/4 mb-4"></div>
        <div className="bg-gray-300 h-4 w-1/2"></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white border-2 rounded-lg p-6">
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-gray-800">Event Details</h1>
          <p className="text-md text-gray-600">Overview of past events.</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{firstItemShown}</span> to <span className="font-medium">{lastItemShown}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div className="flex flex-col mt-4">
          <div className="overflow-x-auto">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
            <div className="align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Event Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Attendees
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Count
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.eventName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {renderAttendees(item.attendees)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href={`/info?attendees=${encodeURIComponent(item.attendees)}`} className="text-indigo-600 hover:text-indigo-900">Know more</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ul>
          {modalContent.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      </Modal>
        </div>
        <Pagination itemsPerPage={itemsPerPage} totalItems={totalItems} paginate={paginate} currentPage={currentPage} />
      </div>
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex items-center space-x-1">
        {currentPage > 1 && (
          <li className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 cursor-pointer rounded-full" onClick={() => paginate(currentPage - 1)}>
            &#8592; Prev
          </li>
        )}
        {pageNumbers.map(number => (
          <li key={number} className={`px-3 py-1 border border-gray-300 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-gray-100 cursor-pointer rounded-full`} onClick={() => paginate(number)}>
            {number}
          </li>
        ))}
        {currentPage < pageNumbers.length && (
          <li className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 cursor-pointer rounded-full" onClick={() => paginate(currentPage + 1)}>
            Next &#8594;
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Table;
