import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
//component
import Navbar from "../components/Navbar";

const Anniversary = () => {
  const [events, setEvents] = useState([]);
  const today = new Date();
  const users = useSelector((state) => state.user.list);

  useEffect(() => {
    if (users.length > 0) {
      const upcomingAnniversarues = findAnniversaries(users);
      const upcomingBirthdays = findBirthdays(users);

      setEvents([...upcomingAnniversarues, ...upcomingBirthdays]);
    }
  }, [users]);

  function findAnniversaries(users) {
    return users
      .map((user) => {
        const joinDate = new Date(user.JoinDate);
        const currentYearAnniversary = new Date(
          Date.UTC(
            today.getFullYear(),
            joinDate.getUTCMonth(),
            joinDate.getUTCDate()
          )
        );
        const anniversaryYear = today.getFullYear() - joinDate.getUTCFullYear();

        if (anniversaryYear > 0) {
          return {
            title: `${anniversaryYear}yrs 🎉 ${user.Name}`,
            start: currentYearAnniversary,
          };
        }
        return null;
      })
      .filter((event) => event !== null);
  }

  function findBirthdays(users) {
    return users.map((user) => {
      const birthday = new Date(user.DOB);
      const currentYearBirthday = new Date(
        Date.UTC(
          today.getFullYear(),
          birthday.getUTCMonth(),
          birthday.getUTCDate()
        )
      );

      return {
        title: `🎂${user.Name}`,
        start: currentYearBirthday,
      };
    });
  }

  function renderEventContent(eventInfo) {
    return (
      <div className="calendar-event">
        <b>{eventInfo.event.title}</b>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div className="anniversary page">
        <div className="anniversary-contents">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            eventContent={renderEventContent}
          />
        </div>
      </div>
    </>
  );
};

export default Anniversary;
