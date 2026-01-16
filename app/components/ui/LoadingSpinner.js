// components/ui/LoadingSpinner.js
export default function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
    xlarge: 'h-16 w-16 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid border-indigo-500 border-t-transparent ${
          sizeClasses[size] || sizeClasses.medium
        }`}
        aria-label="Loading"
      />
    </div>
  );
}