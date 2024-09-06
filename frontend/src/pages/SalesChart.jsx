import {useState, useEffect} from 'react'
import axios from 'axios'
import DesktopMenu from "../components/DesktopMenu"
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';

const baseUrl = import.meta.env.VITE_BASE_URL;
const SalesChart = () => {
  const [type, setType] = useState("invoicing")
  const [invoicingFigure, setInvoicingFigure] = useState(null)
  const [salesFigure, setSalesFigure] = useState(null)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const fetchKPI = async() => {
      try {
        const response = await axios.get(`${baseUrl}/api/kpi`)
        const kpiData = response.data 
        splitDataByType(kpiData)
      } catch(err) {
        console.error("Error fetching KPI data:",err)
      }
    }
    fetchKPI()
  },[])
  
  const splitDataByType = (kpis) => {
    if (!kpis.length) return;
    
    let invoicingData = kpis.filter((kpi) => kpi.title.includes("Invoicing"));
    let salesData = kpis.filter((kpi) => kpi.title.includes("Sales"));
    
    setInvoicingFigure(transformData(invoicingData))
    setSalesFigure(transformData(salesData))
  }

  const transformData = (dataArray) => {
    const result = []
    
    if (!dataArray.length) return result;

    const names = dataArray[0].rankings.map((ranking) => ranking.name)
    names.forEach((name) => {
      const dataObject = { label: name, data: []}

      dataArray.forEach(item => {
        const dataByPerson = item.rankings.find(ranking => ranking.name === name)
        dataObject.data.push(dataByPerson.value)
      })
      result.push(dataObject)
    })
    return result;
  }

  useEffect(() => {
    if(type === 'invoicing' && invoicingFigure) {
      setData(invoicingFigure)
    } else if(type === 'sales' && salesFigure) {
      setData(salesFigure)
    }
  },[type, invoicingFigure, salesFigure])

  const highlightScope = {
    highlight: 'series',
    fade: 'global',
  };

  const series = data ? data.map((s) => ({ ...s, highlightScope })) : [];

  return (
    <div className='saleschart page'>
      <DesktopMenu />
      <div className='saleschart-contents'>
        <h2>Sales Chart</h2>
        <Box sx={{ width: '100%' }}>
          {/* Radio button */}
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="tick-placement-radio-buttons-group-label"
              name="tick-placement"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <FormControlLabel value="invoicing" control={<Radio />} label="Invoicing" />
              <FormControlLabel value="sales" control={<Radio />} label="Sales" />
            </RadioGroup>
          </FormControl>
          {/* Bar graph */}
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['This Week', 'MTD', 'QTD', 'FYTD'] }]}
            height={550}
            series={series}
            skipAnimation={false}
          />
        </Box>
      </div>
    </div>
  )
}

export default SalesChart
