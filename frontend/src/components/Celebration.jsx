import { useEffect, useState } from "react";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useSelector } from "react-redux";

const Celebration = () => {
  const [anniversaries, setAnniversaries] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const today = new Date();
  const users = useSelector((state) => state.user.list);
  console.log(anniversaries, birthdays);

  useEffect(() => {
    if (users.length > 0) {
      findUpcomingAnniversaries(users);
      findUpcomingBirthdays(users);
    }
  }, [users]);

  function findUpcomingAnniversaries(users) {
    const upcomingAnniversaries = users.filter((user) => {
      const joinDate = new Date(user.JoinDate);

      const currentYearAnniversary = new Date(
        Date.UTC(
          today.getFullYear(),
          joinDate.getUTCMonth(),
          joinDate.getUTCDate()
        )
      );

      const timeDiff = currentYearAnniversary - today;
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return dayDiff >= 0 && dayDiff <= 7;
    });

    const anniversaryMessages = upcomingAnniversaries.map((user) => {
      const joinDate = new Date(user.JoinDate);
      const anniversaryYear = today.getFullYear() - joinDate.getUTCFullYear();
      const currentYearAnniversary = new Date(
        Date.UTC(
          today.getFullYear(),
          joinDate.getUTCMonth(),
          joinDate.getUTCDate()
        )
      );

      const formattedDate = currentYearAnniversary.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      return {
        message: `${user.Name}'s ${anniversaryYear}yrs service`,
        date: { formattedDate },
      };
    });

    setAnniversaries(anniversaryMessages);
  }

  function findUpcomingBirthdays(users) {
    const upcomingBirthdays = users.filter((user) => {
      const birthday = new Date(user.DOB);

      const currentYearBirthday = new Date(
        Date.UTC(
          today.getFullYear(),
          birthday.getUTCMonth(),
          birthday.getUTCDate()
        )
      );

      const timeDiff = currentYearBirthday - today;
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      return dayDiff >= 0 && dayDiff <= 7;
    });

    const BirthdayMessages = upcomingBirthdays.map((user) => {
      const birthday = new Date(user.DOB);
      const currentYearBirthday = new Date(
        Date.UTC(
          today.getFullYear(),
          birthday.getUTCMonth(),
          birthday.getUTCDate()
        )
      );

      const formattedDate = currentYearBirthday.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      return {
        message: `Happy Birthday, ${user.Name}`,
        date: { formattedDate },
      };
    });

    setBirthdays(BirthdayMessages);
  }

  return (
    <div className="celebration">
      <div className="title-box">
        <CelebrationIcon />
        <h5>Celebration</h5>
      </div>
      {(anniversaries && anniversaries.length > 0) ||
      (birthdays && birthdays.length > 0) ? (
        <>
          {anniversaries?.map((anniversary, index) => (
            <div key={index} className="celebration-content">
              <p>{anniversary.message}</p>
              <span>{anniversary.date.formattedDate}</span>
            </div>
          ))}
          {birthdays?.map((birthday, index) => (
            <div key={index} className="celebration-content">
              <p>{birthday.message}</p>
              <span>{birthday.date.formattedDate}</span>
            </div>
          ))}
        </>
      ) : (
        <p>No Celebration upcoming</p>
      )}
    </div>
  );
};

export default Celebration;
