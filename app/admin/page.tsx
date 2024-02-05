import React, { useState } from 'react';

const AdminPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Perform search logic here
  };

  return (
    <div>
      <h1>Admin</h1>
      <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search..." />
      {/* Render your dashboard components here */}
      어드민 페이지
    </div>
  );
};

export default AdminPage;
