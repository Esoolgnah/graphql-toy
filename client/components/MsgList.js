import { useEffect, useState } from 'react';
import MsgItem from './MsgItem';

const UserIds = ['roy', 'jay'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

const MsgList = () => {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const generatedMsgs = Array(50)
      .fill(0)
      .map((_, i) => ({
        id: 50 - i,
        userId: getRandomUserId(),
        timestamp: 1234567890123 + (50 - i) * 1000 * 60,
        text: `${50 - i} mock test`,
      }));
    setMsgs(generatedMsgs);
  }, []);

  return (
    <ul className="messages">
      {msgs.map((x) => (
        <MsgItem
          key={x.id}
          {...x}
        />
      ))}
    </ul>
  );
};

export default MsgList;
