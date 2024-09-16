//components
import KudosMessage from "../components/KudosMessage";
import Announcement from "../components/Announcement";
import Celebration from "../components/Celebration";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home page">
        <div className="home-contents">
          <div className="notice-board">
            <Announcement />
            <Celebration />
          </div>
          <KudosMessage />
        </div>
      </div>
    </>
  );
};

export default Home;
