import { Navigate, Route, Routes } from 'react-router-dom';
import { BioPage } from '../presentation/pages/BioPage';
import { AdminPage } from '../presentation/pages/AdminPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<BioPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
