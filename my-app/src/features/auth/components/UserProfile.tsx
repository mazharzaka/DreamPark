"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { useGetProfileQuery, useGetUserBookingsQuery, useLogoutServerMutation, authApi, useChangeBookingDateMutation } from '@/src/lib/features/auth/authApi';
import { clearCredentials } from '@/src/lib/features/auth/authSlice';
import { Link } from '@/src/i18n/routing';
import { useRouter } from 'next/navigation';
import { BookingQrCard } from '@/src/components/ui/BookingQrCard';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const t = useTranslations('Auth');
  const tNavigation = useTranslations('Navigation');
  const tBooking = useTranslations('booking');
  const locale = useLocale() || 'en';
  const isRtl = locale === 'ar';
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [logoutServer] = useLogoutServerMutation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  
  // Date modification state
  const [selectedBookingForDateChange, setSelectedBookingForDateChange] = useState<string | null>(null);
  const [newVisitDate, setNewVisitDate] = useState<string>('');
  const [dateChangeError, setDateChangeError] = useState<string | null>(null);
  const [dateChangeSuccess, setDateChangeSuccess] = useState<boolean>(false);

  const [changeBookingDate, { isLoading: isChangingDate }] = useChangeBookingDateMutation();

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

  const handleOpenDateChange = (bookingId: string, currentDate: string) => {
    setSelectedBookingForDateChange(bookingId);
    // Default picker to today's date
    const today = new Date();
    today.setDate(today.getDate());
    setNewVisitDate(today.toISOString().split('T')[0]);
    setDateChangeError(null);
    setDateChangeSuccess(false);
  };

  const handleDateChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForDateChange || !newVisitDate) return;

    try {
      setDateChangeError(null);
      await changeBookingDate({
        bookingId: selectedBookingForDateChange,
        visitDate: new Date(newVisitDate).toISOString()
      }).unwrap();
      
      setDateChangeSuccess(true);
      setTimeout(() => {
        setSelectedBookingForDateChange(null);
        setNewVisitDate('');
        setDateChangeSuccess(false);
      }, 1500);
    } catch (err: any) {
      setDateChangeError(err?.data?.error || 'Failed to update visit date. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <div className="bg-primary/10 border-l-4 border-primary p-6 mb-8 max-w-md w-full rounded-r-xl">
          <p className="text-secondary font-bold text-lg text-center">
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

  // Categories Filtering
  const upcomingBookings = bookings.filter((b: any) => {
    const d = new Date(b.targetDate);
    return d >= today && b.status !== 'CANCELLED' && b.status !== 'USED' && b.status !== 'EXPIRED';
  });

  const pastBookings = bookings.filter((b: any) => {
    const d = new Date(b.targetDate);
    return (d < today && b.status !== 'CANCELLED') || b.status === 'USED' || b.status === 'EXPIRED';
  });

  const cancelledBookings = bookings.filter((b: any) => {
    return b.status === 'CANCELLED';
  });

  const displayBookings = 
    activeTab === 'upcoming' ? upcomingBookings : 
    activeTab === 'past' ? pastBookings : 
    cancelledBookings;

  // today's date string for input min-attribute restriction
  const todayStr = new Date(new Date().setDate(new Date().getDate() )).toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Zone 1: Header & Profile Summary (Editorial Look) */}
      <div className="glassmorphism bg-white rounded-3xl p-8 md:p-12 shadow-ambient border border-outline-variant/10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 relative overflow-hidden">
        {/* Decorative Background Blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex flex-shrink-0 items-center justify-center text-4xl md:text-6xl font-black text-primary shadow-inner border-4 border-white z-10">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <div className={`flex-1 z-10 flex flex-col justify-center h-full pt-2 ${isRtl ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
          <h1 className="text-3xl md:text-5xl font-black text-secondary font-cairo mb-2 tracking-tight">
            {user?.name || 'Dreamer'}
          </h1>
          <p className="text-on-surface/60 font-medium text-lg mb-6">{user?.email}</p>
          
          <div className={`flex flex-wrap gap-4 justify-center ${isRtl ? 'md:justify-start' : 'md:justify-start'}`}>
            <div className="bg-surface px-4 py-2 rounded-xl shadow-sm border border-outline-variant/10">
              <span className="text-xs text-on-surface/50 uppercase tracking-wider font-bold block mb-1">
                {isRtl ? 'الهاتف' : 'Phone'}
              </span>
              <span className="font-semibold text-secondary">{user?.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="bg-surface px-4 py-2 rounded-xl shadow-sm border border-outline-variant/10">
              <span className="text-xs text-on-surface/50 uppercase tracking-wider font-bold block mb-1">
                {isRtl ? 'الحالة' : 'Status'}
              </span>
              <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg text-sm">
                {isRtl ? 'مؤكد' : 'Verified'}
              </span>
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
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-black text-secondary font-cairo">
          {isRtl ? (
            <>تذاكري <span className="text-primary italic">السحرية</span></>
          ) : (
            <>My <span className="text-primary italic">Magic Passes</span></>
          )}
        </h2>
        
        {/* Localization TABS selector using layoutId highlight */}
        <div className="flex bg-surface p-1.5 rounded-2xl shadow-sm border border-outline-variant/10 relative">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className="px-4 md:px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative"
          >
            {activeTab === 'upcoming' && (
              <motion.div 
                layoutId="activeProfileTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${activeTab === 'upcoming' ? 'text-white' : 'text-on-surface/60 hover:text-secondary'}`}>
              {tBooking('upcoming_title')} ({upcomingBookings.length})
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('past')}
            className="px-4 md:px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative"
          >
            {activeTab === 'past' && (
              <motion.div 
                layoutId="activeProfileTab"
                className="absolute inset-0 bg-secondary rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${activeTab === 'past' ? 'text-white' : 'text-on-surface/60 hover:text-secondary'}`}>
              {tBooking('past_title')} ({pastBookings.length})
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('cancelled')}
            className="px-4 md:px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative"
          >
            {activeTab === 'cancelled' && (
              <motion.div 
                layoutId="activeProfileTab"
                className="absolute inset-0 bg-on-surface/40 rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${activeTab === 'cancelled' ? 'text-white' : 'text-on-surface/60 hover:text-secondary'}`}>
              {tBooking('cancelled_title')} ({cancelledBookings.length})
            </span>
          </button>
        </div>
      </div>

      {/* Bookings Display Container */}
      {displayBookings.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-16 text-center border border-outline-variant/10">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🎫</span>
          </div>
          <h3 className="text-xl font-bold text-secondary mb-2">
            {tBooking('no_passes_title')}
          </h3>
          <p className="text-on-surface/60 max-w-md mx-auto mb-6">
            {tBooking('no_passes_desc', { tab: tBooking(activeTab + '_title').toLowerCase() })}
          </p>
          <Link href="/tickets" className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
            {tBooking('book_pass')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayBookings.map((booking: any) => (
            <BookingQrCard 
              key={booking._id} 
              booking={booking} 
              showChangeDateButton={activeTab === 'upcoming'}
              onChangeDate={(id) => handleOpenDateChange(id, booking.targetDate)}
            />
          ))}
        </div>
      )}

      {/* Floating Date Change Modal Overlay */}
      <AnimatePresence>
        {selectedBookingForDateChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBookingForDateChange(null)}
              className="absolute inset-0 bg-[#2d2f2f]/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-ambient relative z-10 border border-outline-variant/10"
            >
              <button 
                onClick={() => setSelectedBookingForDateChange(null)}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-full bg-surface hover:bg-surface-container-low text-on-surface/40 hover:text-secondary transition-colors`}
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black text-secondary font-cairo mb-6 flex items-center gap-2">
                <Calendar className="text-primary w-6 h-6" />
                {tBooking('extend_date_title')}
              </h3>

              {dateChangeSuccess ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle className="text-emerald-500 w-16 h-16 mb-4 animate-bounce" />
                  <p className="text-secondary font-bold text-center">
                    {tBooking('date_change_success')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDateChangeSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface/50 uppercase tracking-wider mb-2">
                      {isRtl ? 'اختر التاريخ الجديد' : 'Choose New Date'}
                    </label>
                    <input 
                      type="date" 
                      min={todayStr}
                      value={newVisitDate}
                      onChange={(e) => setNewVisitDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-surface rounded-xl border border-outline-variant/20 font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-secondary"
                    />
                  </div>

                  {dateChangeError && (
                    <div className="bg-red-50 p-4 rounded-xl flex items-start gap-2 border border-red-100">
                      <AlertCircle className="text-red-500 shrink-0 w-5 h-5 mt-0.5" />
                      <p className="text-sm font-bold text-red-600">{dateChangeError}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setSelectedBookingForDateChange(null)}
                      className="flex-1 py-3 bg-surface hover:bg-surface-container-low text-on-surface/60 font-bold rounded-xl transition-colors border border-outline-variant/10 shadow-sm"
                    >
                      {tBooking('cancel_close')}
                    </button>
                    <button 
                      type="submit" 
                      disabled={isChangingDate}
                      className="flex-1 py-3 bg-gradient-to-r from-primary to-[#ff766d] text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      {isChangingDate ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : tBooking('submit_change')}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
