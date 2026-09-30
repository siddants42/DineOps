import { useEffect, useRef, useState } from "react"

interface UseWebSocketOptions {
  enabled?: boolean
  onMessage?: (data: unknown) => void
}

export function useWebSocket(path: string, options: UseWebSocketOptions = {}) {
  const { enabled = true, onMessage } = options
  const socketRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"
    const httpUrl = new URL(apiUrl)
    const protocol = httpUrl.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${protocol}//${httpUrl.host}${path}`

    const socket = new WebSocket(wsUrl)
    socketRef.current = socket

    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)
    socket.onmessage = (event) => {
      try {
        onMessage?.(JSON.parse(event.data) as unknown)
      } catch {
        onMessage?.(event.data)
      }
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [enabled, onMessage, path])

  return { connected, socket: socketRef.current }
}
