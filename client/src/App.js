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
import MyTasks from "pages/MyTasks/index.jsx";
import PrivacyPage from "pages/Privacy";
import React from "react";
import RegisterPage from "pages/Register";
import TaskApplications from "pages/TaskApplications/index.jsx";
import TaskPage from "pages/Task";
import TermsPage from "pages/Terms";
import User from "./api/User.js";
import { useMainStore } from "stores";

function App() {
  const { user } = useMainStore();
  React.useEffect(() => {
    User.refresh();
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-x-hidden overflow-y-auto">
      {/* user is only undefined while loading, this is to avoid UI flashing */}
      {user !== undefined && (
        <div className="h-full w-full">
          <Header />
          <div className="w-full p-6 flex justify-center bg-black">
            <div className="max-w-6xl w-full h-full flex">
              <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="account" element={<AccountPage />} />

                <Route path="new-task" element={<CreateTask />} />
                <Route path="my-tasks" element={<MyTasks />} />

                <Route
                  path="tasks/:taskId/applications"
                  element={<TaskApplications />}
                />
                <Route path="tasks/:taskId" element={<TaskPage />} />

                <Route path="*" element={<MainPage />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
