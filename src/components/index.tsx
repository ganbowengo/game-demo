/*
 * @Author       : ganbowen
 * @Date         : 2022-07-13 17:15:53
 * @LastEditors  : ganbowen
 * @LastEditTime : 2022-07-13 17:16:23
 * @Descripttion : 
 */
import { ReactNode } from 'react';
import { SocketProvider } from './Socket';

const AppContextProviders = ({ children }: { children: ReactNode }) => (
  <SocketProvider>{children}</SocketProvider>
);

export default AppContextProviders;