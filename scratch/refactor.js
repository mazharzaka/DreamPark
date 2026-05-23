const fs = require('fs');

const file = 'd:/bit68/DreamPark/my-app/src/components/BookingFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize CRLF to LF
content = content.replace(/\r\n/g, '\n');

// 1. Imports
content = content.replace(
  'import React, { useState, useEffect } from "react";',
  'import React, { useState, useEffect } from "react";\nimport { useForm, SubmitHandler } from "react-hook-form";'
);

content = content.replace(
  'import { useParams } from "next/navigation";',
  `import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/src/lib/hooks";
import { 
  setStep, 
  setSelectedCategory, 
  setSelectedTicketId, 
  setGeneratedPass,
  resetBookingFlow
} from "@/src/lib/features/booking/bookingSlice";

type BookingFormData = {
  targetDate: string;
  quantity: number;
  phoneNumber: string;
};

type LoginFormData = {
  loginEmail: string;
  loginPassword: string;
};`
);

// 2. State setup
content = content.replace(
  `  // Step state: 1 = Select Ticket, 2 = Customize & Details, 3 = Confirmation
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<"INDIVIDUAL" | "GROUP">("INDIVIDUAL");
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  
  // Auth state local fallback
  const [token, setToken] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Success state booking details
  const [generatedPass, setGeneratedPass] = useState<{
    bookingId: string;
    qrCodeId: string;
    targetDate: string;
    ticketName: string;
    ticketNameAr: string;
    quantity: number;
    totalPrice: number;
    color: string;
  } | null>(null);`,
  `  const dispatch = useAppDispatch();

  // Redux State
  const { step, selectedCategory, selectedTicketId, generatedPass } = useAppSelector(state => state.booking);

  // React Hook Form for Booking
  const { register: registerBooking, handleSubmit: handleBookingSubmit, watch: watchBooking, setValue: setBookingValue } = useForm<BookingFormData>({
    defaultValues: { targetDate: "", quantity: 1, phoneNumber: "" }
  });
  const targetDate = watchBooking("targetDate");
  const quantity = watchBooking("quantity");
  const phoneNumber = watchBooking("phoneNumber");

  // React Hook Form for Login
  const { register: registerLogin, handleSubmit: handleLoginSubmit, reset: resetLogin } = useForm<LoginFormData>({
    defaultValues: { loginEmail: "", loginPassword: "" }
  });

  // Auth state local fallback
  const [token, setToken] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);`
);

// 3. Replacements for setters. 
content = content.replace(
  'setGeneratedPass({',
  'dispatch(setGeneratedPass({'
);

content = content.replace(
  `        });
        setStep(3); // Success Screen`,
  `        }));
        dispatch(setStep(3)); // Success Screen`
);

// Also null setter
content = content.replace(
  'setGeneratedPass(null);',
  'dispatch(setGeneratedPass(null));'
);

content = content.replace(/setStep\(([^)]+)\)/g, 'dispatch(setStep($1))');
content = content.replace(/setSelectedCategory\(([^)]+)\)/g, 'dispatch(setSelectedCategory($1))');

content = content.split('\n').map(line => {
  if (line.includes('setSelectedTicketId(')) {
    return line.replace(/setSelectedTicketId\((.*)\)(;?)/, 'dispatch(setSelectedTicketId($1))$2');
  }
  return line;
}).join('\n');

// 4. Form Handlers
content = content.replace(
  `  // Handle checkout / JWT protection
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();`,
  `  // Handle checkout / JWT protection
  const onSubmitBooking: SubmitHandler<BookingFormData> = async (data) => {
    // data contains targetDate, quantity, phoneNumber but we also watch them`
);

content = content.replace(
  `  // Inline login submit
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();`,
  `  // Inline login submit
  const onSubmitLogin: SubmitHandler<LoginFormData> = async (data) => {
    const { loginEmail, loginPassword } = data;`
);

content = content.replace(/setLoginEmail\(""\);/g, '');
content = content.replace(/setLoginPassword\(""\);/g, 'resetLogin();');

// 5. Update HTML elements
content = content.replace(
  '<form onSubmit={handleCheckoutSubmit}',
  '<form onSubmit={handleBookingSubmit(onSubmitBooking)}'
);

content = content.replace(
  '<form onSubmit={handleInlineLogin}',
  '<form onSubmit={handleLoginSubmit(onSubmitLogin)}'
);

content = content.replace(
  /onChange=\{\(e\) => setTargetDate\(e.target.value\)\}/g,
  '{...registerBooking("targetDate", { required: true })}'
);

content = content.replace(
  /onChange=\{\(e\) => setPhoneNumber\(e.target.value\)\}/g,
  '{...registerBooking("phoneNumber", { required: true })}'
);

content = content.replace(/value=\{targetDate\}/g, '');
content = content.replace(/value=\{phoneNumber\}/g, '');

content = content.replace(
  /setTargetDate\(getTodayDateString\(\)\)/g,
  'setBookingValue("targetDate", getTodayDateString())'
);
content = content.replace(
  /setTargetDate\(getTomorrowDateString\(\)\)/g,
  'setBookingValue("targetDate", getTomorrowDateString())'
);
content = content.replace(
  /setTargetDate\((.*?)\)/g,
  'setBookingValue("targetDate", $1)'
);

content = content.replace(
  /setQuantity\(Math.max\(1, quantity - 1\)\)/g,
  'setBookingValue("quantity", Math.max(1, quantity - 1))'
);
content = content.replace(
  /setQuantity\(quantity \+ 1\)/g,
  'setBookingValue("quantity", quantity + 1)'
);
content = content.replace(
  /setQuantity\((.*?)\)/g,
  'setBookingValue("quantity", $1)'
);

content = content.replace(
  /value=\{loginEmail\}/g,
  ''
);
content = content.replace(
  /onChange=\{\(e\) => setLoginEmail\(e.target.value\)\}/g,
  '{...registerLogin("loginEmail", { required: true })}'
);

content = content.replace(
  /value=\{loginPassword\}/g,
  ''
);
content = content.replace(
  /onChange=\{\(e\) => setLoginPassword\(e.target.value\)\}/g,
  '{...registerLogin("loginPassword", { required: true })}'
);

// Fix unexpected any error while we are at it
content = content.replace(
  /\(bookingError as any\)\.data\?\.error/g,
  '(bookingError as { data?: { error?: string } })?.data?.error'
);

// Finally, fix the 'Unexpected expression' for isLoggingIn ? null : setIsLoggingIn(true);
content = content.replace(
  /isLoggingIn \? null : setIsLoggingIn\(true\);/g,
  'if (!isLoggingIn) setIsLoggingIn(true);'
);

fs.writeFileSync(file, content);
console.log("Refactoring complete");
