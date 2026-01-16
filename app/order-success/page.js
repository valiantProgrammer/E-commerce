import { Suspense } from 'react';
import OrderSuccessDetails from '../components/OrderSuccessDetails';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <OrderSuccessDetails />
    </Suspense>
  );
}
