import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../../store'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TicketType {
  id: string
  _id?: string
  name: string
  nameAr: string
  category: 'INDIVIDUAL' | 'GROUP'
  icon?: string
  color?: string
  price: number
  description: string[]
  descriptionAr: string[]
  discount?: number
  isActive?: boolean
  updatedAt: string
  createdAt: string
}

export interface Booking {
  id: string
  ticketTypeId: string
  ticketType: TicketType
  targetDate: string
  totalPrice: number
  qrCodeId: string
  status: 'PENDING_PAYMENT' | 'PAID'
  quantity: number
  createdAt: string
}

// Request / Response shapes
export interface CreateBookingRequest {
  ticketTypeId: string
  targetDate: string
  quantity: number
  email?: string
  phoneNumber?: string
}

export interface CreateBookingResponse {
  success: true
  data: {
    bookingId: string
    qrCodeId: string
  }
}

export interface VerifyPaymentRequest {
  qrCodeId?: string
  phoneNumber?: string
  bookingId?: string
}

export interface VerifyPaymentResponse {
  success: true
  data: {
    bookingId: string
    status: string
    customerName: string
    ticketName: string
    quantity: number
    totalPrice: number
  }
}

export interface UpdateTicketPriceRequest {
  ticketTypeId: string
  newPrice: number
}

export interface ApiListResponse<T> {
  success: true
  data: T[]
}

export interface ApiItemResponse<T> {
  success: true
  data: T
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/tickets`,

    // Automatically attach the Bearer token stored in Redux auth state
    // (or fallback to localStorage for SSR-safe hydration)
    prepareHeaders: (headers, { getState }) => {
      // Try Redux store first (set by authSlice after login)
      const token = (getState() as RootState & { auth?: { token?: string } }).auth?.token
        ?? (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),

  // Cache tag types for invalidation
  tagTypes: ['TicketType', 'Booking'],

  endpoints: (builder) => ({
    // ── Query: GET /api/tickets/types ──────────────────────────────────────
    getTicketTypes: builder.query<ApiListResponse<TicketType>, void>({
      query: () => '/types',
      providesTags: ['TicketType'],
    }),

    // ── Mutation: POST /api/tickets/bookings ───────────────────────────────
    createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),

    // ── Query: GET /api/tickets/bookings/user ──────────────────────────────
    getUserBookings: builder.query<ApiListResponse<Booking>, string | void>({
      query: (email) => ({
        url: '/bookings/user',
        params: email ? { email } : undefined,
      }),
      providesTags: ['Booking'],
    }),

    // ── Mutation: POST /api/tickets/verify (Admin/Agent protected) ─────────
    verifyAndConfirmPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: (body) => ({
        url: '/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),

    // ── Mutation: PATCH /api/tickets/types/price (Admin protected) ─────────
    updateTicketPrice: builder.mutation<ApiItemResponse<TicketType>, UpdateTicketPriceRequest>({
      query: (body) => ({
        url: '/types/price',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['TicketType'],
    }),
  }),
})

export const {
  useGetTicketTypesQuery,
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useVerifyAndConfirmPaymentMutation,
  useUpdateTicketPriceMutation,
} = bookingsApi
