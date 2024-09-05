import {useState, useEffect} from 'react'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL;
const KudosBoard = () => {
  const [kudosMessages, setKudosMessages] = useState([])
  const [users, setUsers] = useState([])
  const [kudosRanking, setKudosRanking] = useState([])
  const [sendersRanking, setSendersRanking] = useState([])
  const [filterType, setFilterType] = useState('monthly')

  useEffect(() => {
    const fetchKudosMessage = async() => {
      try {
        const messageResponse = await axios.get(`${baseUrl}/api/message`)
        const userResponse = await axios.get(`${baseUrl}/api/user`)

        setKudosMessages(messageResponse.data[0])
        setUsers(userResponse.data[0])  
      } catch(err) {
        console.error(err)
      }
    } 
    fetchKudosMessage()
  },[])
  
  useEffect(() => {
    if(filterType === 'monthly') {
      calculateTopKudos('monthly')
    } else if(filterType === 'yearly') {
      calculateTopKudos('yearly')
    }
  },[kudosMessages, users, filterType])

  const findUserNameById = (userId) => {
    const user = users.find((u) => u.Id === parseInt(userId))
    return user? {name: user.Name, role: user.Role} : "UnKnown"
  }

  const calculateTopKudos = (type) => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    let filteredMessages = []

    if(type === 'monthly') {
      filteredMessages = kudosMessages.filter((message) => {
        const createdAtDate = new Date(message.CreatedAt) 
  
        return (
          createdAtDate.getFullYear() == currentYear && createdAtDate.getMonth() == currentMonth
        )
      })
    } else if (type === 'yearly') {
      filteredMessages = kudosMessages.filter((message) => {
        const createdAtDate = new Date(message.CreatedAt)
        return (
          createdAtDate.getFullYear() === currentYear
        )
      })
    }

    const authorCount = {}
    filteredMessages.forEach((message) => {
      if(authorCount[message.AuthorId]) {
        authorCount[message.AuthorId]++
      } else {
        authorCount[message.AuthorId] = 1
      }
    })

    const recipientCount = {}
    filteredMessages.forEach((message) => {
      if(recipientCount[message.TargetId]) {
        recipientCount[message.TargetId]++
      } else {
        recipientCount[message.TargetId] = 1
      }
    })

    const topAuthors = Object.entries(authorCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const topRecipients = Object.entries(recipientCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
    
      setSendersRanking(topAuthors)
      setKudosRanking(topRecipients)
  }

  return (
    <div className='kudos-board page'>
      <div className='leaderboard'>
        <h2>Kudos Leaderboard</h2>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value={'monthly'}>Monthly</option>
          <option value={'yearly'}>Yearly</option>
        </select>

        <ul>
          {kudosRanking.length > 0 ? (
            <ul>
            {kudosRanking.map(([targetId, count]) => {
              const { name, role } = findUserNameById(targetId);
              return (
                <li key={targetId}>
                  {name} ({role}) received {count} Kudos
                </li>
              );
            })}
            </ul>
          ) : (
            <p>No data available for this period</p>
          )}
          
        </ul>
      </div>
    </div>
  )
}

export default KudosBoard
