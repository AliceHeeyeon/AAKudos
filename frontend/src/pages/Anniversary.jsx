import {useState, useEffect} from 'react'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import DesktopMenu from '../components/DesktopMenu'

const baseUrl = import.meta.env.VITE_BASE_URL;

const Anniversary = () => {
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const today = new Date()

  useEffect(() => {
    const fetchUserData = async() => {
      try {
        const results = await axios.get(`${baseUrl}/api/user`)
        setUsers(results.data[0])
      } catch(err) {
        console.error('Error feching user data:',err)
      }
    }
    fetchUserData()
  },[])

  useEffect(() => {
    if(users.length > 0) {
      const upcomingAnniversarues = findAnniversaries(users)
      const upcomingBirthdays = findBirthdays(users)

      setEvents([...upcomingAnniversarues, ...upcomingBirthdays])
    }
  },[users])
  
  function findAnniversaries(users) {
    return users
      .map((user) => {
      const joinDate = new Date(user.JoinDate)
      const currentYearAnniversary = new Date(Date.UTC(today.getFullYear(), joinDate.getUTCMonth(), joinDate.getUTCDate()))
      const anniversaryYear = today.getFullYear() - joinDate.getUTCFullYear()

      if(anniversaryYear > 0) {
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
      const birthday = new Date(user.DOB)
      const currentYearBirthday = new Date(Date.UTC(today.getFullYear(), birthday.getUTCMonth(), birthday.getUTCDate()))
      
      return {
        title: `🎂${user.Name}`,
        start: currentYearBirthday,
      };
    })
  }
  
  function renderEventContent(eventInfo) {
    console.log((eventInfo));
    
    return (
      <div className='calendar-event'>
        <b>{eventInfo.event.title}</b>
      </div>
    )
  }
  return (
    <div className='anniversary page'>
      <DesktopMenu />
      <div className='anniversary-contents'>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView='dayGridMonth'
          weekends={true}
          events={events}
          eventContent={renderEventContent}
        />
      </div>
    </div>
  )
}

export default Anniversary
