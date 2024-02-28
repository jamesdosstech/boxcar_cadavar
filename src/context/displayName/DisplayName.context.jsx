import React, { useState, useEffect, createContext } from "react";

export const DisplayNameContext = createContext({
  displayName: "",
  setDisplayName: () => {},
});

// Provider component for displayName
export const DisplayNameProvider = ({ children }) => {
  const [displayName, setDisplayName] = useState(null);
  const value = { displayName, setDisplayName };

  // Effect to update sessionStorage when displayName changes
  useEffect(() => {
    sessionStorage.setItem("displayName", displayName);
  }, [displayName]);

  return (
    <DisplayNameContext.Provider value={{ displayName, setDisplayName }}>
      {children}
    </DisplayNameContext.Provider>
  );
};
