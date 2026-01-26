import React, { createContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

type UserContextValue = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUserContext: (user: User | null) => void;
};

export const UserContext = createContext<UserContextValue>({
  currentUser: null,
  setCurrentUser: () => {
    // no-op default for initialization only
  },
  updateUserContext: () => {
    // no-op default for initialization only
  },
});

type Props = { children: React.ReactNode };

export function UserProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const updateUserContext = (user: User | null) => setCurrentUser(user);

  const value = useMemo(
    () => ({ currentUser, setCurrentUser, updateUserContext }),
    [currentUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
