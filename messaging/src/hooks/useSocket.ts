import { useEffect, useCallback } from 'react';
import { socketService } from '@/lib/socket';

export const useSocket = () => {
  const emit = useCallback((event: string, data: any) => {
    socketService.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event: string) => {
    socketService.off(event);
  }, []);

  useEffect(() => {
    const socket = socketService.getSocket();
    
    return () => {
      if (socket) {
        socket.removeAllListeners();
      }
    };
  }, []);

  return {
    socket: socketService.getSocket(),
    emit,
    on,
    off
  };
};
