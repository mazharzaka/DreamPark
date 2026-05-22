# Quickstart: Auth State Management

## Overview
This feature introduces global authentication state management using Redux Toolkit (RTK) and RTK Query.

## How it works

1. **API Integration (`authApi.ts`)**: Provides `useLoginMutation`, `useSignUpMutation`, and `useGetProfileQuery`. It automatically attaches the Bearer token to protected requests.
2. **State Management (`authSlice.ts`)**: Manages the `token` and `isAuthenticated` state. It syncs with `localStorage` for persistence.
3. **Usage in Components**:
   - For login/signup, use the mutations from `authApi`. Upon success, dispatch `setToken` from `authSlice`.
   - To access the current user, simply call `useGetProfileQuery(undefined, { skip: !isAuthenticated })`. If `isAuthenticated` is false, no network request is made.
   - To logout, dispatch `logout()` and clear the API cache using `dispatch(authApi.util.resetApiState())`.

## Example Usage

```tsx
import { useSelector } from 'react-redux';
import { useGetProfileQuery } from '@/lib/features/auth/authApi';
import { RootState } from '@/store';

function ProfileComponent() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) return <p>Please log in.</p>;
  if (isLoading) return <p>Loading...</p>;

  return <div>Welcome, {profile?.name}</div>;
}
```
