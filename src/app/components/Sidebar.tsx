'use client';

import React, { useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { auth, db } from '../../../firebase';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { useAppContext } from '@/context/AppContext';

const Sidebar = () => {
  // コンテキストで取得している値を使用する
  const { user, userId, setSelectedRoom, setSelectRoomName } = useAppContext();
  // サイドバーに初期表示する部屋リストをuseStateする
  const [rooms, setRooms] = useState<Room[]>([]);
  type Room = {
    id: string;
    name: string;
    createdAt: Timestamp;
  };
  // useEffect 処理実装する
  useEffect(() => {
    if (user) {
      // 部屋情報取得処理
      // コレクションより部屋情報を取得し、useStateしたRoomsに値設定する
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, 'rooms');
        const q = query(
          roomCollectionRef,
          where('userId', '==', userId),
          orderBy('createdAt'),
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newRooms: Room[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));
          setRooms(newRooms);
        });
        // アンマウント時に購読を解除する
        return () => {
          unsubscribe();
        };
      };
      // 部屋情報取得処理を呼び出す
      fetchRooms();
    }
  }, [userId, user]);

  const selectRoom = (roomId: string, roomName: string) => {
    setSelectedRoom(roomId);
    setSelectRoomName(roomName);
  };

  const addNewRoom = async () => {
    const roomName = prompt('ルーム名を入力してください。');
    if (roomName) {
      const newRoomRef = collection(db, 'rooms');
      await addDoc(newRoomRef, {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
      });
    }
  };
  const handleLogout = () => {
    auth.signOut();
  };
  // サイドバーの生成HTMLをレンダリング
  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div
          onClick={addNewRoom}
          className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-600 duration-100"
        >
          <span className="text-white p-4 text-2xl">+</span>
          <h1 className="text-white texd-xl font-semibold p-4">New Chat</h1>
        </div>

        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150 "
              onClick={() => selectRoom(room.id, room.name)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      {user && (
        <div className="mb-2 p-4 text-slate-100 text-lg">{user.email}</div>
      )}

      <div
        onClick={() => handleLogout()}
        className="text-lg flex items-center justify-evenly mb-2 cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150"
      >
        <BiLogOut />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
