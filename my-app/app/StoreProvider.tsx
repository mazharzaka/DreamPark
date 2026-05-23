'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/src/lib/store'
import { useSessionRestore } from '@/src/features/auth/hooks/useSessionRestore'

function SessionRestorer() {
  useSessionRestore();
  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <SessionRestorer />
      {children}
    </Provider>
  )
}
