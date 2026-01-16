'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ModalWrapper } from './ModalWrapper';
import LocationPicker from './LocationPicker';

export default function EditAddressForm({ address, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    tag: address.tag || '',
    street: address.street || '',       // ✅ backend expects street
    landmark: address.landmark || '',
    city: address.city || '',
    state: address.state || '',
    postalCode: address.postalCode || '', // ✅ backend expects postalCode
    country: address.country || 'India',
    addressType: address.addressType || 'home', // ✅ camelCase
    isDefault: address.isDefault || false,
    location: address.location || { lat: null, lng: null }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location: { lat, lng }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Format payload to match backend model
      const payload = {
        id: address.id, // Required by backend to identify which address to update
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        landmark: formData.landmark || null,
        addressType: formData.addressType,
        tag: formData.tag || null,
        isDefault: formData.isDefault,
        location: formData.location // ✅ keep location
      };

      const res = await fetch(`/api/user/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update address');
      }

      const data = await res.json();
      toast.success('Address updated successfully');
      onUpdateSuccess(data);
      onClose();
    } catch (error) {
      console.error('Address error:', error);
      toast.error(error.message || 'Failed to update address');
    }
  };

  return (
    <ModalWrapper isOpen={true} onClose={onClose}>
      <div className="bg-white text-black rounded-xl shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Address</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="home">🏠 Home</option>
                    <option value="work">💼 Work</option>
                    <option value="other">📍 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Tag
                  </label>
                  <input
                    type="text"
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>

              {/* Map */}
              <div className="space-y-4">
                <LocationPicker onLocationChange={handleLocationChange} />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
