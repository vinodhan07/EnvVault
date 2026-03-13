'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const EnvironmentContext = createContext(null);

export const EnvironmentProvider = ({ children }) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState('Development');

  return (
    <EnvironmentContext.Provider value={{ selectedEnvironment, setEnvironment: setSelectedEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => useContext(EnvironmentContext);
