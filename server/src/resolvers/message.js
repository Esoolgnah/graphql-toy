import { v4 } from 'uuid';
import { writeDB } from '../dbController.js';

const setMsgs = (data) => writeDB('messages', data);

/*
parent: parent 객체, 거의 사용 x
args: Query에 필요한 필드에 제공되는 인수(parameter)
context: 로그인한 사용자, DB Access 등의 중요한 정보들
*/

const messageResolver = {
  Query: {
    messages: (parent, arg, { db }) => {
      // console.log({ parent, arg, context });
      return db.messages;
    },
    message: (parent, { id = '' }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMsg);
      setMsgs(db.messages);
      return newMsg;
    },
    updateMessage: (parent, { id, text, userId }, { db }) => {
      const targetIndex = db.messsages.findIndex((msg) => msg.id === id);

      if (targetIndex < 0) {
        throw Error('메시지가 없습니다.');
      }
      if (db.messsages[targetIndex].userId !== userId) {
        throw Error('사용자가 다릅니다.');
      }

      const newMsg = { ...db.messsages[targetIndex], text };
      db.messsages.splice(targetIndex, 1, newMsg);
      setMsgs(db.messsages);
      return newMsg;
    },
    deleteMessage: (parent, { text, userId }, { db }) => {
      const targetIndex = db.message.findIndex((msg) => msg.id === id);

      if (targetIndex < 0) {
        throw '메시지가 없습니다.';
      }
      if (db.message[targetIndex].userId !== userId) {
        throw '사용자가 다릅니다.';
      }

      db.message.splice(targetIndex, 1);
      setMsgs(db.message);
      return id;
    },
  },
};

export default messageResolver;
