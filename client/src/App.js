import {
  Link,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import AccountPage from "pages/Account";
import CreateTask from "pages/CreateTask/index.jsx";
import Header from "components/Header.jsx";
import LoginPage from "pages/Login";
import MainPage from "pages/Main/index.jsx";
import PrivacyPage from "pages/Privacy";
import React from "react";
import RegisterPage from "pages/Register";
import TermsPage from "pages/Terms";
import User from "./api/User.js";
import { useMainStore } from "stores";

function App() {
  const { user } = useMainStore();
  React.useEffect(() => {
    User.refresh();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-y-auto bg-black text-white items-center">
      {/* user is only undefined while loading, this is to avoid UI flashing */}
      {user !== undefined && (
        <React.Fragment>
          <Header />
          <div className="h-full w-full max-w-6xl p-6 ">
            <Routes>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="new-task" element={<CreateTask />} />

              <Route path="*" element={<MainPage />} />
            </Routes>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
