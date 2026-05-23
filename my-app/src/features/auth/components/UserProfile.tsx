"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { useGetProfileQuery, useGetUserBookingsQuery, useLogoutServerMutation, authApi } from '@/src/lib/features/auth/authApi';
import { clearCredentials } from '@/src/lib/features/auth/authSlice';
import { Link } from '@/src/i18n/routing';
import { useRouter } from 'next/navigation';
import { BookingQrCard } from '@/src/components/ui/BookingQrCard';
import { useTranslations } from 'next-intl';

export const UserProfile: React.FC = () => {
  const t = useTranslations('Auth');
  const tNavigation = useTranslations('Navigation');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutServer] = useLogoutServerMutation();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data: profileRes, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetUserBookingsQuery(
    { from: 'all', sort: 'desc', order: 'targetDate' },
    { skip: !isAuthenticated }
  );

  const handleLogout = async () => {
    try {
      await logoutServer().unwrap();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      dispatch(clearCredentials());
      dispatch(authApi.util.resetApiState());
      router.push('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <div className="bg-primary/10 border-l-4 border-primary p-6 mb-8 max-w-md w-full rounded-r-xl">
          <p className="text-secondary font-bold text-lg">
            Please log in to view your profile.
          </p>
        </div>
        <Link href="/login" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform">
          {tNavigation('login')}
        </Link>
      </div>
    );
  }

  if (isProfileLoading || isBookingsLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const user = profileRes?.data?.user;
  const bookings = bookingsRes?.data || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((b: any) => {
    const d = new Date(b.targetDate);
    return d >= today && b.status !== 'USED';
  });

  const pastBookings = bookings.filter((b: any) => {
    const d = new Date(b.targetDate);
    return d < today || b.status === 'USED';
  });

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      
      {/* Zone 1: Header & Profile Summary (Editorial Look) */}
      <div className="glassmorphism bg-white rounded-3xl p-8 md:p-12 shadow-ambient border border-white/40 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 relative overflow-hidden">
        {/* Decorative Background Blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex flex-shrink-0 items-center justify-center text-4xl md:text-6xl font-black text-primary shadow-inner border-4 border-white z-10">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <div className="flex-1 text-center md:text-left z-10 flex flex-col justify-center h-full pt-2">
          <h1 className="text-3xl md:text-5xl font-black text-secondary font-cairo mb-2 tracking-tight">
            {user?.name || 'Dreamer'}
          </h1>
          <p className="text-on-surface/60 font-medium text-lg mb-6">{user?.email}</p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-surface px-4 py-2 rounded-lg border border-outline-variant/30 shadow-sm">
              <span className="text-xs text-on-surface/50 uppercase tracking-wider font-bold block mb-1">Phone</span>
              <span className="font-semibold text-secondary">{user?.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="bg-surface px-4 py-2 rounded-lg border border-outline-variant/30 shadow-sm">
              <span className="text-xs text-on-surface/50 uppercase tracking-wider font-bold block mb-1">Status</span>
              <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded text-sm">Verified</span>
            </div>
          </div>
        </div>

        <div className="z-10 mt-4 md:mt-0">
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors border border-red-100 shadow-sm"
          >
            {tNavigation('logout') || 'Logout'}
          </button>
        </div>
      </div>

      {/* Zone 2 & 3: Bookings Manager */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-black text-secondary font-cairo">
          My <span className="text-primary italic">Magic Passes</span>
        </h2>
        
        <div className="flex bg-surface p-1 rounded-xl shadow-sm border border-outline-variant/30">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'upcoming' ? 'bg-primary text-white shadow-md' : 'text-on-surface/60 hover:text-secondary'}`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'past' ? 'bg-secondary text-white shadow-md' : 'text-on-surface/60 hover:text-secondary'}`}
          >
            Past ({pastBookings.length})
          </button>
        </div>
      </div>

      {displayBookings.length === 0 ? (
        <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl p-16 text-center">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🎫</span>
          </div>
          <h3 className="text-xl font-bold text-secondary mb-2">No passes found</h3>
          <p className="text-on-surface/60 max-w-md mx-auto mb-6">
            You don't have any {activeTab} magic passes yet. Book a ticket to start your adventure!
          </p>
          <Link href="/tickets" className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
            Book a Pass
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayBookings.map((booking: any) => (
            <BookingQrCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}

    </div>
  );
};
