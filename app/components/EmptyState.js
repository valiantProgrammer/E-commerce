'use client';
import { useRouter } from 'next/navigation';

export default function EmptyState({ 
  title = "No saved addresses",
  description = "Add an address for faster checkout",
  buttonText = "Add Address",
  onAddClick 
}) {
  const router = useRouter();

  const handleClick = () => {
    onAddClick();
  };

  return (
    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white">
      <svg 
        className="mx-auto h-12 w-12 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="1.5" 
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        {description}
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg 
            className="-ml-1 mr-2 h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {buttonText}
        </button>
      </div>
    </div>
  );
}