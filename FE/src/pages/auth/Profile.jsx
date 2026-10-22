import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

// Preset avatar options for quick selection
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=200',
];

const Profile = () => {
  const { user, updateProfile, fetchProfile, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password fields
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & feedback
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProfileData = async () => {
      const freshData = await fetchProfile();
      if (freshData) {
        setName(freshData.name || '');
        setEmail(freshData.email || '');
        setPhone(freshData.phone || '');
        setAddress(freshData.address || '');
        setAvatar(freshData.avatar || '');
      }
    };

    loadProfileData();
  }, [user?._id, navigate]);

  // Handle avatar upload with canvas compression
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file (.jpg, .png, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(dataUrl);
        setMessage(null);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar('');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSuccess(false);

    // Validate phone number if entered
    if (phone && !/^[0-9+() -]{8,15}$/.test(phone.trim())) {
      setMessage('Invalid phone number format (please enter 8-15 digits)');
      return;
    }

    // Validate password change
    if (isChangingPassword) {
      if (!currentPassword) {
        setMessage('Please enter your current password to proceed with password change');
        return;
      }
      if (!password || password.length < 6) {
        setMessage('New password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setMessage('New password and confirm password do not match');
        return;
      }
    }

    const payload = {
      name,
      email,
      phone,
      address,
      avatar,
      ...(isChangingPassword ? { currentPassword, password } : {}),
    };

    const res = await updateProfile(payload);

    if (res.success) {
      setSuccess(true);
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      setTimeout(() => setSuccess(false), 4000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMessage(res.message);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">Admin</span>;
      case 'staff':
        return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">Staff</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">Customer</span>;
    }
  };

  return (
    <div className="py-10 px-4 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">User Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account details, shipping address, and security settings</p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-medium text-brand-orange hover:underline flex items-center gap-1.5"
          >
            <i className="fas fa-arrow-left text-xs"></i> Continue Shopping
          </Link>
        </div>

        {/* Global Feedback Banners */}
        {message && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-xl text-red-500"></i>
              <span className="text-sm font-medium">{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-red-400 hover:text-red-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-xl text-emerald-500"></i>
              <div>
                <p className="text-sm font-semibold">Profile updated successfully!</p>
                <p className="text-xs text-emerald-600">Your personal information and settings have been saved.</p>
              </div>
            </div>
            <button onClick={() => setSuccess(false)} className="text-emerald-400 hover:text-emerald-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: User Summary & Avatar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              {/* Avatar section */}
              <div className="relative inline-block mx-auto mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-orange-50 mx-auto flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name || 'Avatar'}
                      className="w-full h-full object-cover"
                      onError={() => setAvatar('')}
                    />
                  ) : (
                    <div className="text-4xl font-extrabold text-brand-orange">
                      {name ? name.charAt(0).toUpperCase() : <i className="far fa-user text-3xl"></i>}
                    </div>
                  )}
                </div>

                {/* Camera upload overlay trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload photo from device"
                  className="absolute bottom-1 right-1 bg-brand-orange text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-transform active:scale-95"
                >
                  <i className="fas fa-camera text-sm"></i>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              {/* Avatar management buttons */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-xs text-brand-orange bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1 rounded-full font-medium transition-colors"
                >
                  <i className="fas fa-paw mr-1"></i> Choose Pet Avatar
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-full font-medium transition-colors"
                  >
                    <i className="fas fa-trash-alt mr-1"></i> Remove Photo
                  </button>
                )}
              </div>

              {/* Preset selection dropdown */}
              {showPresets && (
                <div className="mb-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100 animate-fadeIn">
                  <p className="text-xs text-gray-500 font-medium mb-2">Select an avatar:</p>
                  <div className="flex justify-center gap-2">
                    {PRESET_AVATARS.map((presetUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatar(presetUrl);
                          setShowPresets(false);
                        }}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                          avatar === presetUrl ? 'border-brand-orange ring-2 ring-orange-300' : 'border-white'
                        }`}
                      >
                        <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* User details */}
              <h2 className="text-xl font-bold text-brand-dark mb-1">{name || 'User'}</h2>
              <p className="text-sm text-gray-500 mb-3">{email}</p>
              <div className="mb-4">{getRoleBadge(user?.role)}</div>

              <div className="pt-4 border-t border-gray-100 text-left text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <i className="fas fa-phone text-brand-orange w-4"></i>
                  <span>{phone || 'No phone number added'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-brand-orange w-4"></i>
                  <span className="truncate">{address || 'No shipping address added'}</span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Quick Access</h3>
              <nav className="space-y-1">
                <Link
                  to="/orders/myorders"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <i className="fas fa-box-open text-gray-400 w-5"></i> My Orders
                  </span>
                  <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                </Link>
                <Link
                  to="/pets"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <i className="fas fa-paw text-gray-400 w-5"></i> Pet Profiles
                  </span>
                  <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <i className="far fa-heart text-gray-400 w-5"></i> My Wishlist
                  </span>
                  <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                </Link>
                <Link
                  to="/book-appointment"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <i className="far fa-calendar-check text-gray-400 w-5"></i> Book Appointment
                  </span>
                  <i className="fas fa-chevron-right text-xs text-gray-300"></i>
                </Link>
              </nav>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Forms */}
          <div className="lg:col-span-2">
            <form onSubmit={submitHandler} className="space-y-6">
              {/* Card 1: Personal & Shipping Information */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold">
                    <i className="far fa-id-card"></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-dark">Personal & Shipping Information</h2>
                    <p className="text-xs text-gray-500">This information is used for order checkouts and delivery</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-1">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i className="far fa-user text-sm"></i>
                      </div>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-1">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i className="far fa-envelope text-sm"></i>
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-1">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i className="fas fa-phone-alt text-sm"></i>
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 555-0199 or 0912 345 678"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                      />
                    </div>
                  </div>

                  {/* Avatar URL direct input */}
                  <div className="md:col-span-1">
                    <label htmlFor="avatarUrl" className="block text-sm font-semibold text-gray-700 mb-1">
                      Avatar Image URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <i className="fas fa-link text-sm"></i>
                      </div>
                      <input
                        id="avatarUrl"
                        type="url"
                        value={avatar.startsWith('data:') ? '' : avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                      Default Shipping Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                        <i className="fas fa-map-marker-alt text-sm"></i>
                      </div>
                      <textarea
                        id="address"
                        rows="3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address, apartment, suite, city, state/province, postal code..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Security & Change Password */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-brand-dark">Security & Password</h2>
                      <p className="text-xs text-gray-500">Keep your account secure with a strong password</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(!isChangingPassword);
                      if (isChangingPassword) {
                        setCurrentPassword('');
                        setPassword('');
                        setConfirmPassword('');
                      }
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      isChangingPassword
                        ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        : 'bg-orange-50 text-brand-orange border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    {isChangingPassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {!isChangingPassword ? (
                  <p className="text-sm text-gray-500 py-2">
                    Your password is secure. Click <strong className="text-brand-dark font-medium">"Change Password"</strong> above if you wish to set a new password.
                  </p>
                ) : (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-start gap-2">
                      <i className="fas fa-info-circle text-amber-500 mt-0.5"></i>
                      <span>For your security, you must enter your current password before setting a new one.</span>
                    </div>

                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <i className="fas fa-key text-sm"></i>
                        </div>
                        <input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <i className={showCurrentPassword ? 'fas fa-eye-slash text-sm' : 'fas fa-eye text-sm'}></i>
                        </button>
                      </div>
                    </div>

                    {/* New Password & Confirm */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <i className="fas fa-lock text-sm"></i>
                          </div>
                          <input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <i className={showNewPassword ? 'fas fa-eye-slash text-sm' : 'fas fa-eye text-sm'}></i>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                          Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <i className="fas fa-check-double text-sm"></i>
                          </div>
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <i className={showConfirmPassword ? 'fas fa-eye-slash text-sm' : 'fas fa-eye text-sm'}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password match indicator */}
                    {password && confirmPassword && (
                      <p className={`text-xs font-medium flex items-center gap-1.5 ${password === confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                        <i className={`fas ${password === confirmPassword ? 'fa-check' : 'fa-times'}`}></i>
                        {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand-dark text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-orange transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
