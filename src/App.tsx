import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import DeviceListPage from "./pages/DeviceListPage";
import RemoteControlPage from "./pages/RemoteControlPage";
import SessionRecordPage from "./pages/SessionRecordPage";
import FileDeliveryPage from "./pages/FileDeliveryPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DeviceListPage />} />
          <Route path="sessions" element={<SessionRecordPage />} />
          <Route path="files" element={<FileDeliveryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/remote/:id" element={<RemoteControlPage />} />
      </Routes>
    </Router>
  );
}

export default App;
