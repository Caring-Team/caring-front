import React, { createContext, useContext, useState } from "react";

const ProgressContext = createContext({
  progress: 0,
  setProgress: (value: number) => {},
});

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(0);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
