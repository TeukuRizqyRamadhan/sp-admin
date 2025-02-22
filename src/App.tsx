import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ExportData from "./pages/ExportData";
import UploadSiswa from "./pages/UploadSiswa";
import Panduan from "./pages/Panduan";
import DetailSiswa from "./pages/DetailSiswa";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route element={<AppLayout />}>
            <Route index path="/dashboard" element={<Home />} />
            <Route
              path="/dashboard/detail-siswa/:id/:nama/:kelas"
              element={<DetailSiswa />}
            />
            <Route path="dashboard/upload-siswa" element={<UploadSiswa />} />
            <Route path="/dashboard/panduan" element={<Panduan />} />
            <Route path="/dashboard/export-data" element={<ExportData />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
