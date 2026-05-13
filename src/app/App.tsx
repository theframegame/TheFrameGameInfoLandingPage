import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { MetaTagsLoader } from './components/meta-tags-loader';
import '/src/i18n'; // Initialize i18n

export default function App() {
  return (
    <>
      <MetaTagsLoader />
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </>
  );
}