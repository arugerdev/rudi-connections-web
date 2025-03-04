import { useEffect, useState } from 'react';

export const useIsElectron = () => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('rud1-electron-app')) {
      setIsElectron(true);
    }
  }, []);

  return isElectron;
};
