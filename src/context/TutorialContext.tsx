import React, { createContext, useContext, useState, useEffect } from 'react';

interface TutorialContextType {
  currentStep: number;
  dismissTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const TUTORIAL_SHOWN_KEY = 'tutorial_shown';

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(() => {
    const shown = localStorage.getItem(TUTORIAL_SHOWN_KEY);
    return shown ? -1 : 0;
  });

  const dismissTutorial = () => {
    setCurrentStep(-1);
    localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true');
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <TutorialContext.Provider value={{ currentStep, dismissTutorial, nextStep, prevStep }}>
      {children}
    </TutorialContext.Provider>
  );
};