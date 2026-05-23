import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { useTranslations, useLocale } from 'next-intl';

interface BookingQrCardProps {
  booking: {
    _id: string;
    qrCodeId: string;
    ticketType?: {
      name: string;
      nameAr?: string;
    };
    targetDate: string;
    status: string;
    quantity: number;
    totalPrice: number;
  };
}

export const BookingQrCard = ({ booking }: BookingQrCardProps) => {
  const t = useTranslations('booking');
  const locale = useLocale() || 'en';

  const ticketName = locale === 'ar' && booking.ticketType?.nameAr 
    ? booking.ticketType.nameAr 
    : booking.ticketType?.name || 'Magic Pass';

  const isPaid = booking.status === 'PAID';
  const isUsed = booking.status === 'USED';
  const isPending = booking.status === 'PENDING_PAYMENT';
  
  let statusColor = 'bg-yellow-100 text-yellow-800';
  let statusText = isPending ? 'Pending Payment' : booking.status;
  
  if (isPaid) {
    statusColor = 'bg-green-100 text-green-800';
    statusText = 'Paid & Active';
  } else if (isUsed) {
    statusColor = 'bg-gray-100 text-gray-800';
    statusText = 'Used';
  }

  const dateObj = new Date(booking.targetDate);
  const isValidDate = !isNaN(dateObj.getTime());
  const formattedDate = isValidDate ? format(dateObj, 'MMM dd, yyyy') : 'Invalid Date';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row h-full">
      {/* Left side / Top side: Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold font-cairo text-primary">
              {ticketName}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
              {statusText}
            </span>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm">
              <span className="w-24 text-on-surface/60 font-medium">Date:</span>
              <span className="font-semibold">{formattedDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-24 text-on-surface/60 font-medium">Quantity:</span>
              <span className="font-semibold">{booking.quantity}x Tickets</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-24 text-on-surface/60 font-medium">Total:</span>
              <span className="font-semibold">{booking.totalPrice} EGP</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-24 text-on-surface/60 font-medium">ID:</span>
              <span className="font-mono text-xs">{booking._id.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {isPending && (
          <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
            Show QR code at gate to pay cash and activate your pass.
          </p>
        )}
      </div>

      {/* Right side / Bottom side: QR Code */}
      <div className="bg-surface-container-lowest p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-outline-variant/30 min-w-[200px]">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-outline-variant/20 mb-3">
          <QRCodeSVG 
            value={booking.qrCodeId || booking._id} 
            size={120}
            level="H"
            includeMargin={false}
          />
        </div>
        <p className="text-xxs font-mono text-on-surface/50 text-center tracking-widest uppercase">
          {booking.qrCodeId || 'SCAN ME'}
        </p>
      </div>
    </div>
  );
};
