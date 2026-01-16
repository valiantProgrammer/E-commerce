'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import EditAddressForm from './EditAddressForm';

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const [showEditForm, setShowEditForm] = useState(false);

  // Ensure we have a consistent ID to work with
  const addressId = address?._id || address?.id;

  // Check if address data is valid
  if (!address || !addressId) {
    console.error('Invalid address data:', address);
    return (
      <div className="border rounded-lg p-4 border-red-200 bg-red-50">
        <p className="text-red-500">Invalid address data</p>
      </div>
    );
  }

  const handleSetDefault = async () => {
    try {
      await onSetDefault(addressId);
    } catch (error) {
      console.error('Address error:', error);
      toast.error(error.message || 'Failed to update address');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      onDelete(addressId);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete address');
    }
  };

  return (
    <>
      <div className={`border rounded-lg p-4 ${address.is_default ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
        <div className="flex-col justify-between items-start">
          <div className='flex justify-between items-start'>
            <h3 className="font-medium text-gray-800">
              {address.is_default && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                  Default
                </span>
              )}
              {address.addressType || 'Address'}
            </h3>
            <div className='flex justify-end space-x-1 items-end'>
              <button
                onClick={() => setShowEditForm(true)}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="flex-col space-x-2">
            <p className="mt-1 text-gray-600">
              {address.street}, {address.landmark && `${address.landmark}, `}
              {address.city}, {address.state} - {address.postalCode}
            </p>
            <p className="text-sm text-gray-500 mt-1">{address.country}</p>
          </div>
        </div>

        {!address.is_default && (
          <button
            onClick={handleSetDefault}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Set as default
          </button>
        )}
      </div>

      {showEditForm && (
        <EditAddressForm
          address={address}
          onClose={() => setShowEditForm(false)}
          onUpdateSuccess={(updatedAddress) => {
            onEdit(updatedAddress);
            setShowEditForm(false);
          }}
        />
      )}
    </>
  );
}