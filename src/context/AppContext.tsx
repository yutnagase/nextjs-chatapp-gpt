'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

type AppProviderProps = {
  children: ReactNode;
};
type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectRoomName: string | null;
  setSelectRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};
const defalutContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectRoomName: null,
  setSelectRoomName: () => {},
};
// AppContext
// auth, components等コンポーネント間の共通の値を管理する　※非props
const AppContext = React.createContext<AppContextType>(defalutContextData);

// AppProvider
// AppContextで使用したい値を定義
// AppProviderでラップされたアプリケーションは、共通の値を使いまわすことが出来る
export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectRoomName, setSelectRoomName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // アンマウント時に購読を解除したいので、unsubscribeする
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);

      if (!user) {
        router.push('/auth/login');
      }
    });

    // コンポーネントのアンマウント時に購読を解除
    return () => {
      unsubscribe();
    };
  });
  return (
    <AppContext.Provider
      value={{
        user,
        userId,
        setUser,
        selectedRoom,
        setSelectedRoom,
        selectRoomName,
        setSelectRoomName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// useContextは呼ぶ側で各々定義しておくと大変なので、大本のAppContextの中で一度読んであげる形とする
export function useAppContext() {
  return useContext(AppContext);
}
