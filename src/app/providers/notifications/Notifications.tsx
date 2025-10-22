import { Toaster } from 'react-hot-toast';

export function Notifications() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: '10px' },
      }}
    />
  );
}