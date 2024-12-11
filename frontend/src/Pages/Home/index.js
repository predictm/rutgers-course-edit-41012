import React from 'react';
import { Outlet } from 'react-router-dom';

import PageLayout from '../../Layouts/PageLayout';
import { HomeContextProvider } from './context/HomeContext';

const Home = () => {
  return (
    <HomeContextProvider>
      <PageLayout>
        <Outlet />
      </PageLayout>
    </HomeContextProvider>
  );
};

export default Home;
