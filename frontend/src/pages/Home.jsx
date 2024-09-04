//components
import DesktopMenu from "../components/DesktopMenu"
import KudosMessage from "../components/KudosMessage";
import Announcement from "../components/Announcement";
import Celebration from "../components/Celebration";

const baseUrl = import.meta.env.VITE_BASE_URL;
const Home = () => {
  
  return (
    <div className="home page">
      <DesktopMenu />
      <div className="home-contents">
        <div className="notice-board">
          <Announcement />
          <Celebration />
        </div>
        <KudosMessage />
      </div>

    </div>
  )
}

export default Home
