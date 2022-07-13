/*
 * @Author       : ganbowen
 * @Date         : 2022-07-13 17:16:12
 * @LastEditors  : ganbowen
 * @LastEditTime : 2022-07-13 17:50:49
 * @Descripttion : 
 */
import { createContext, ReactNode, useContext } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';

const ENDPOINT = "http://127.0.0.1:5000";
export const socket = socketIOClient(ENDPOINT);

const SocketContext = createContext<Socket>(socket);
SocketContext.displayName = 'SocketContext';

export const SocketProvider = ({ children }: { children: ReactNode }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};