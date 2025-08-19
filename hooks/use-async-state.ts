"use client"

import { useState, useCallback } from "react"

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncStateOptions {
  initialLoading?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: any) => void
}

export function useAsyncState<T>(
  initialData: T | null = null,
  options: UseAsyncStateOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: options.initialLoading || false,
    error: null
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }))
  }, [])

  const setData = useCallback((data: T) => {
    setState({ data, loading: false, error: null })
    options.onSuccess?.(data)
  }, [options])

  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error, loading: false }))
    options.onError?.(error)
  }, [options])

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      setLoading(true)
      const result = await asyncFunction()
      setData(result)
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setError(errorObj)
      throw errorObj
    }
  }, [setLoading, setData, setError])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null
    })
  }, [initialData])

  const retry = useCallback(async (asyncFunction: () => Promise<T>) => {
    return execute(asyncFunction)
  }, [execute])

  return {
    ...state,
    setLoading,
    setData,
    setError,
    execute,
    reset,
    retry,
    isIdle: !state.loading && !state.error && state.data === null,
    isSuccess: !state.loading && !state.error && state.data !== null,
    isError: !state.loading && state.error !== null,
    isLoading: state.loading
  }
}

// Hook específico para operações de salvamento
export function useSaveOperation() {
  return useAsyncState<boolean>(null, {
    onSuccess: () => {
      // Pode adicionar toast de sucesso aqui
      console.log("✅ Dados salvos com sucesso")
    },
    onError: (error) => {
      // Pode adicionar toast de erro aqui
      console.error("❌ Erro ao salvar:", error)
    }
  })
}

// Hook para carregamento de dados
export function useDataLoader<T>(initialData: T | null = null) {
  return useAsyncState<T>(initialData, {
    initialLoading: false,
    onError: (error) => {
      console.error("❌ Erro ao carregar dados:", error)
    }
  })
}
