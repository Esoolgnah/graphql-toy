'use client';
import { useEffect, useRef, useState } from 'react';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';
import fetcher from '../fetcher';
import { useRouter } from 'next/router';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const MsgList = ({ smgs, users }) => {
  const { query } = useRouter();
  const userId = query.userId || query.userid || '';
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const [msgs, setMsgs] = useState(smgs);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  const onCreate = async (text) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });
    if (!newMsg) throw Error('something wrong');
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error('something wrong');

    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = async (id) => {
    const recievedId = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });

    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex(
        (msg) => msg.id === String(recievedId)
      );
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const doneEdit = () => setEditingId(null);

  const getMessages = async () => {
    if (msgs) {
      const mewMsgs = await fetcher('get', '/messages', {
        params: { cursor: msgs[msgs?.length - 1]?.id || '' },
      });
      if (mewMsgs?.length === 0) {
        setHasNext(false);
        return;
      }
      setMsgs((msgs) => [...msgs, ...mewMsgs]);
    }
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs?.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
            user={users[x.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
