import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GeneratedPass {
  bookingId: string;
  qrCodeId: string;
  targetDate: string;
  ticketName: string;
  ticketNameAr: string;
  quantity: number;
  totalPrice: number;
  color: string;
}

interface BookingState {
  step: number;
  selectedCategory: 'INDIVIDUAL' | 'GROUP';
  selectedTicketId: string;
  generatedPass: GeneratedPass | null;
}

const initialState: BookingState = {
  step: 1,
  selectedCategory: 'INDIVIDUAL',
  selectedTicketId: '',
  generatedPass: null,
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<'INDIVIDUAL' | 'GROUP'>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedTicketId: (state, action: PayloadAction<string>) => {
      state.selectedTicketId = action.payload;
    },
    setGeneratedPass: (state, action: PayloadAction<GeneratedPass | null>) => {
      state.generatedPass = action.payload;
    },
    resetBookingFlow: (state) => {
      state.step = 1;
      state.generatedPass = null;
    }
  },
});

export const { 
  setStep, 
  setSelectedCategory, 
  setSelectedTicketId, 
  setGeneratedPass,
  resetBookingFlow
} = bookingSlice.actions;

export default bookingSlice.reducer;
