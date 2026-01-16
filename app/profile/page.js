'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import AddAddressForm from '../components/AddAddressForm';
import AddressList from '../components/AddressList';
import EditAddressForm from '../components/EditAddressForm';
import { authApi } from '../lib/api';
import { ArrowRightCircle } from "lucide-react";
import Avatar from '../components/Avatar';
import OrderHistory from '@/app/components/orderhistory.js';
import { isExist } from '@/app/lib/auth';

function SignOutButton({ handleLogout }) {
    return (
        <button
            onClick={handleLogout}
            className="group relative mx-4 sm:mx-0 px-3 md:px-6 py-2 md:py-3 text-white font-semibold rounded-xl 
                 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 
                 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-500
                 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-70
                 shadow-lg hover:shadow-xl active:scale-95
                 transition-all duration-500 overflow-hidden flex items-center justify-center"
        >
            <span
                className="flex items-center space-x-2 transform transition-transform duration-500 group-hover:translate-x-2"
            >
                {/* Hidden initially → slides in on hover */}
                <ArrowRightCircle className="h-0 w-0 opacity-0 group-hover:h-6 group-hover:w-6 group-hover:opacity-100 transition-all duration-500" />

                {/* Text */}
                <span className="whitespace-nowrap text-sm md:text-md">Sign Out</span>
            </span>
        </button>
    );
}
function BackButton({ handleBack }) {
    return (
        <button
            onClick={handleBack}
            className="group relative mx-4 sm:mx-0 px-3 md:px-6 py-2 md:py-3 text-white font-semibold rounded-xl 
                 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 
                 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-500
                 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-70
                 shadow-lg hover:shadow-xl active:scale-95
                 transition-all duration-500 overflow-hidden flex items-center justify-center"
        >
            <span
                className="flex items-center space-x-2 transform transition-transform duration-500 group-hover:translate-x-2"
            >
                {/* Hidden initially → slides in on hover */}
                <ArrowRightCircle className="h-0 w-0 opacity-0 group-hover:h-6 group-hover:w-6 group-hover:opacity-100 transition-all duration-500" />

                {/* Text */}
                <span className="whitespace-nowrap text-sm md:text-md">Back</span>
            </span>
        </button>
    );
}



export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileEditMode, setProfileEditMode] = useState(false);
    const [previousProducts, setPreviousProducts] = useState([]);
    const [phoneEditMode, setPhoneEditMode] = useState(false);
    const [phoneVerificationSent, setPhoneVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        addresses: [],
        upi_methods: []
    });
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [mapReady, setMapReady] = useState(false);
    const [orders, setOrders] = useState([]);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const router = useRouter();
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const r = isExist();
            if (!r) {
                router.replace('/Auth?mode=signin');
                return;
            }
            const [profileData, ordersData, prevProductsData] = await Promise.all([
                authApi.getProfile(),
                authApi.getOrderHistory(),
                authApi.getPreviousProducts(),
            ]);
            setUser(profileData);
            setOrders(ordersData);
            setPreviousProducts(prevProductsData);
            console.log('Previous Products:', prevProductsData);
            console.log('Orders:', ordersData);
            console.log('Previous Products:', prevProductsData);
            setFormData({ username: profileData.username || '', phone: profileData.phone || '' });
        } catch (error) {
            console.error('Profile fetch error:', error);
            toast.error(error.message || 'Failed to load profile.');
            if (error.status === 401) router.push('/Auth?mode=signin');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAllData();
    }, [router]);

    const handleAddSuccess = async (newAddress) => {
        try {
            const response = await authApi.addAddress(newAddress);
            setUser(prev => ({
                ...prev,
                addresses: [...(prev.addresses || []), response]
            }));
            setShowAddForm(false);
            fetchAllData();
            toast.success('Address added successfully');
        } catch (error) {
            console.error('Add address error:', error);
            toast.error(error.message || 'Failed to add address');
        }
    };

    const handleUpdate = async (updatedAddress) => {
        try {
            const response = await authApi.updateAddress(updatedAddress._id, updatedAddress);
            setUser(prev => ({
                ...prev,
                addresses: prev.addresses.map(addr =>
                    addr._id === response._id ? response : addr
                )
            }));
            setEditingAddress(null);
            toast.success('Address updated successfully');
        } catch (error) {
            console.error('Update address error:', error);
            toast.error(error.message || 'Failed to update address');
        }
    };

    const handleDelete = async (addressId) => {
        try {
            console.log(addressId)
            await authApi.deleteAddress(addressId);
            setUser(prev => ({
                ...prev,
                addresses: prev.addresses.filter(addr => addr._id !== addressId)
            }));
            toast.success('Address deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Failed to delete address');
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await authApi.updateAddress(addressId, { is_default: true });
            setUser(prev => ({
                ...prev,
                addresses: prev.addresses.map(a => ({
                    ...a,
                    is_default: a._id === addressId
                }))
            }));
            toast.success('Default address updated');
        } catch (error) {
            console.error('Set default error:', error);
            toast.error(error.message || 'Failed to update address');
        }
    };

    const handleSendVerification = async () => {
        if (!formData.phone || formData.phone.length !== 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            // Note: You'll need to implement sendPhoneVerification in your authApi
            // This is a placeholder - adjust according to your actual API
            await authApi.sendOtp(formData.phone);
            setPhoneVerificationSent(true);
            toast.success('Verification code sent to your phone');
        } catch (error) {
            console.error('Verification error:', error);
            if (error.message && error.message.includes('rate limit')) {
                toast.error('Too many attempts. Please try again later.');
            } else {
                toast.error(error.message || 'Failed to send verification code');
            }
        }
    };

    const handleVerifyPhone = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        try {
            // Note: You'll need to implement verifyPhone in your authApi
            // This is a placeholder - adjust according to your actual API
            const data = await authApi.verifyOtp(formData.phone, verificationCode);
            setUser(data.user);
            setPhoneEditMode(false);
            setPhoneVerificationSent(false);
            setVerificationCode('');
            toast.success('Phone number verified successfully!');
        } catch (error) {
            console.error('Verification error:', error);
            if (error.status === 429) {
                toast.error('Too many attempts. Please wait a minute.');
            } else if (error.status === 400) {
                toast.error('Verification failed');
            } else {
                toast.error(error.message || 'An error occurred during verification');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.username && formData.username.trim().length < 2) {
                toast.error('Name must be at least 2 characters long');
                return;
            }

            const updatedUser = await authApi.updateProfile({
                username: formData.username,
                phone: phoneEditMode ? undefined : formData.phone
            });

            setUser(updatedUser);
            setProfileEditMode(false);
            setPhoneEditMode(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
            router.push('/Auth?mode=signin');

            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error(error.message || 'Failed to logout');
        }
    };

    const renderPhoneEditForm = () => {
        return (
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {user?.phone ? 'Update Phone Number' : 'Add Phone Number'}
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                        />
                    </div>

                    {phoneVerificationSent ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter 6-digit code"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleVerifyPhone}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Verify Code
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPhoneVerificationSent(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleSendVerification}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Send Verification
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPhoneEditMode(false);
                                    setFormData({ ...formData, phone: user?.phone || '' });
                                }}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderPhoneSection = () => {
        if (!user) return null;

        return (
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-md md:text-xl font-semibold mb-2 text-gray-800">Phone Number</h2>
                        <p className="text-gray-700">
                            {user.phone_verified ? (
                                <span className="flex items-center">
                                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified: {user.phone}
                                </span>
                            ) : user.phone ? (
                                <span className="flex items-center">
                                    <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Unverified: {user.phone}
                                </span>
                            ) : (
                                'Not set'
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setPhoneEditMode(true);
                            if (user.phone) {
                                setFormData(prev => ({ ...prev, phone: user.phone }));
                            }
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                        {user.phone ? 'Change' : 'Add'} Phone
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                        <p className="mt-4 text-gray-600">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Unable to load profile</h3>
                        <p className="mt-1 text-gray-500">We couldn't load your profile information at this time.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => fetchAllData()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    async function handleAvatarUpload(file) {
        try {

            const formData = new FormData();
            formData.append('file', file);


            const uploadResponse = await authApi.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const avatarUrl = uploadResponse.data.url;

            if (avatarUrl) {
                const profileResponse = await authApi.updateProfile('/user/profile', {
                    avatarUrl: avatarUrl,
                });

                // Step 4: Update the UI with the final user data from your database
                setUser(profileResponse.data);
                console.log('Avatar uploaded and profile updated!');
            }
        } catch (error) {
            console.error('Error in avatar upload process:', error);
            // You could add a user-facing error message here
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl px-4 sm:px-0 sm:text-2xl md:text-3xl font-bold text-gray-900">My Account</h1>
                    <SignOutButton handleLogout={handleLogout} />
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 flex-col items-center justify-items-center">
                        <Avatar user={user} onUpdateUser={setUser} />
                        <h2 className="text-md sm:text-xl font-semibold text-gray-800">{user.username || 'Not set'}</h2>
                    </div>
                    {!profileEditMode ? (
                        <div className="p-6 md:p-8 space-y-8">
                            {phoneEditMode ? renderPhoneEditForm() : renderPhoneSection()}

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-md sm:text-xl font-semibold text-gray-800">Personal Information</h2>
                                    <button
                                        onClick={() => setProfileEditMode(true)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                                        <span className="text-gray-600 w-24">Name:</span>
                                        <span className="text-gray-800">{user.username || 'Not set'}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                                        <span className="text-gray-600 w-24">Email:</span>
                                        <span className="text-gray-800">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Addresses</h2>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Add New
                                    </button>
                                </div>

                                {showAddForm && (
                                    <AddAddressForm
                                        onClose={() => setShowAddForm(false)}
                                        onAddSuccess={handleAddSuccess}
                                    />
                                )}

                                {editingAddress && (
                                    <EditAddressForm
                                        address={editingAddress}
                                        onClose={() => setEditingAddress(null)}
                                        onUpdateSuccess={handleUpdate}  // Changed from onSave to onUpdateSuccess
                                    />
                                )}

                                <AddressList
                                    addresses={user.addresses || []}
                                    onEditClick={setEditingAddress}
                                    onDeleteClick={handleDelete}
                                    onSetDefaultClick={handleSetDefault}
                                    onAddClick={() => setShowAddForm(true)}
                                />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            {renderPhoneEditForm()}

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileEditMode(false);
                                        setPhoneEditMode(false);
                                        fetchAllData();
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                    <div className="m-6 flex-col space-y-2">
                        <OrderHistory orders={orders} previousProducts={previousProducts} />
                    </div>
                    <div className='flex justify-end m-4'>
                        <BackButton handleBack={() => {
                            router.back();
                        }} /></div>
                </div>
            </div>
        </div>
    );
}