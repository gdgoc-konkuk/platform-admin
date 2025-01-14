import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

export default function App() {
  const routing = useRoutes(routes());

  return (
    <QueryClientProvider client={queryClient}>
      {routing}
      <Toaster />
    </QueryClientProvider>
  );
}
