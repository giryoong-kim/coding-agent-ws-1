import { useState, useEffect, useRef } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Run an async function and track its loading/error/data states.
 * Re-runs whenever `fetcher` reference changes (use useCallback to control that).
 */
export function useAsyncData<T>(fetcher: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  // Use a ref to cancel stale responses when fetcher changes
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcher()
      .then((data) => {
        if (!cancelRef.current) {
          setState({ data, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (!cancelRef.current) {
          setState({ data: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) })
        }
      })

    return () => {
      cancelRef.current = true
    }
  }, [fetcher])

  return state
}
