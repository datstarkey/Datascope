import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
};

type ContextProps = {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  bearer: string;
  setBearer: (value: string) => void;
};

export const AppContext = React.createContext<Partial<ContextProps>>({});

export default ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [bearer, setBearer] = useState("");

  const values = {
    authenticated: authenticated,
    setAuthenticated: setAuthenticated,
    bearer: bearer,
    setBearer: setBearer,
  };
  return <AppContext.Provider value={values}> {children} </AppContext.Provider>;
};
