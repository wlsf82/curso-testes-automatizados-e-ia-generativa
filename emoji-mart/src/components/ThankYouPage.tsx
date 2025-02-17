import React from 'react';
import { Check as CheckMark } from 'lucide-react';

interface ThankYouPageProps {
  orderNumber: string;
  onBackToStore: () => void;
}

export function ThankYouPage({ orderNumber, onBackToStore }: ThankYouPageProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckMark className="w-8 h-8 text-green-500" data-testid="check-icon" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been successfully placed. We've sent a confirmation email with your order
          details.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-lg font-semibold">{orderNumber}</p>
        </div>
        <button
          onClick={onBackToStore}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Store
        </button>
      </div>
    </div>
  );
}