"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { getAuthHeadersFromCookies } from "@/app/lib/auth";
import { ModalWrapper } from "./ModalWrapper";
import LocationPicker from "./LocationPicker";

export default function AddAddressForm({ onClose, onAddSuccess, address = null }) {
  const ADDRESS_TYPES = [
    { value: "home", label: "🏠 Home" },
    { value: "work", label: "💼 Work" },
    { value: "other", label: "📍 Other" },
  ];

  const defaultLocation = { lat: 22.5726, lng: 88.3639 };

  const [formData, setFormData] = useState({
    addressType: address?.addressType || "home",
    addressType: address?.addressType || "",
    street: address?.street || "",
    landmark: address?.landmark || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
    country: address?.country || "India",
    is_default: address?.is_default || false,
    location: address?.location || defaultLocation,
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // separate refs for inline and modal maps
  const inlineMapRef = useRef(null);
  const modalMapRef = useRef(null);
  const handleLocationChange = useCallback((locationData) => {
    setFormData(prev => ({
      ...prev,
      ...locationData
    }));
  }, []);
  // Load Google Maps (inline map)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country || "India",
        landmark: formData.landmark || null,
        addressType: formData.addressType || "home",
        is_default: formData.is_default || false,
      };
      toast.success(`Address ${address ? "updated" : "added"} successfully`);
      onAddSuccess(payload);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () =>
    formData.street && formData.city && formData.state && formData.postalCode;

  return (
    <ModalWrapper isOpen={true} onClose={onClose}>
      <div className="bg-white rounded-xl shadow-xl text-black">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {address ? "Edit Address" : "Add New Address"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ADDRESS_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            addressType: type.value === "other" ? "" : type.label,
                          }))
                        }
                        className={`px-3 py-2 rounded-lg border ${formData.address_type === type.value
                          ? "bg-indigo-100 border-indigo-500"
                          : "border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.addressType === "other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Tag *
                    </label>
                    <input
                      type="text"
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street_address"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark (Optional)
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
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
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
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>

              {/* Right side: Google Map */}
              <div className="space-y-4">

                <LocationPicker
                  onLocationChange={handleLocationChange}
                />

                <div className="text-sm text-gray-600">
                  <p>Latitude: {formData.location.lat?.toFixed(6)}</p>
                  <p>Longitude: {formData.location.lng?.toFixed(6)}</p>
                </div>
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
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting
                  ? address
                    ? "Updating..."
                    : "Saving..."
                  : address
                    ? "Update Address"
                    : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Fullscreen Map Modal */}
      {showMapModal && (
        <ModalWrapper isOpen={showMapModal} onClose={() => setShowMapModal(false)}>
          <div className="bg-white rounded-xl shadow-xl flex flex-col h-[90vh] w-full max-w-6xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex-1">
              <div ref={modalMapRef} className="w-full h-full" />
            </div>

            <div className="p-4 flex justify-between items-center border-t">
              <p className="text-sm">
                Selected Location: {formData.location.lat?.toFixed(6)},{" "}
                {formData.location.lng?.toFixed(6)}
              </p>
              <button
                onClick={() => {
                  fetchAddressFromCoords(formData.location.lat, formData.location.lng);
                  setShowMapModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </ModalWrapper>
  );
}
