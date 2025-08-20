import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import AutoAgentPage from './AutoAgentPage';

const AutoAgentLayout: React.FC = () => {
  return (
    <MainLayout contentScrollable={false}>
      <AutoAgentPage />
    </MainLayout>
  );
};

export default AutoAgentLayout;