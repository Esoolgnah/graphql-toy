import MsgList from '../components/MsgList';
import fetcher from '../fetcher';

const Home = ({ smgs, users }) => {
  console.log(users);

  return (
    <>
      <h1>SIMPLE SNS</h1>
      <MsgList
        smgs={smgs}
        users={users}
      />
    </>
  );
};

export const getServerSideProps = async () => {
  const smgs = await fetcher('get', '/messages');
  const users = await fetcher('get', '/users');

  return {
    props: { smgs, users },
  };
};

export default Home;
