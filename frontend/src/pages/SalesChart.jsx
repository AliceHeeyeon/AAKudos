import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
//component
import Navbar from "../components/Navbar";

const baseUrl = import.meta.env.VITE_BASE_URL;
const SalesChart = () => {
  const [initialKPIData, setInitialKPIData] = useState(null);
  const [type, setType] = useState("invoicing");
  const [invoicingFigure, setInvoicingFigure] = useState(null);
  const [salesFigure, setSalesFigure] = useState(null);
  const [data, setData] = useState(null);
  const [currentWeek, setCurrentWeek] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchKPI = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/kpi`);
        const kpiData = response.data;

        setInitialKPIData(response.data);
        splitDataByType(kpiData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching KPI data:", err);
        setLoading(false);
      }
    };
    function getCurrentWeekRange() {
      const today = new Date();
      const firstDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      );
      const lastDayOfWeek = new Date(
        today.setDate(firstDayOfWeek.getDate() + 6)
      );

      const options = { month: "short", day: "numeric" };
      const startOfWeek = firstDayOfWeek.toLocaleDateString("en-US", options);
      const endOfWeek = lastDayOfWeek.toLocaleDateString("en-US", options);

      setCurrentWeek({
        startOfWeek: startOfWeek,
        endOfWeek: endOfWeek,
      });
    }
    fetchKPI();
    getCurrentWeekRange();
  }, []);

  const splitDataByType = (kpis) => {
    if (!kpis.length) return;

    let invoicingData = kpis.filter((kpi) => kpi.title.includes("Invoicing"));
    let salesData = kpis.filter((kpi) => kpi.title.includes("Sales"));

    setInvoicingFigure(transformData(invoicingData));
    setSalesFigure(transformData(salesData));
  };

  const transformData = (dataArray) => {
    const result = [];

    if (!dataArray.length) return result;

    const names = dataArray[0].rankings.map((ranking) => ranking.name);
    names.forEach((name) => {
      const dataObject = { label: name, data: [] };

      dataArray.forEach((item) => {
        const dataByPerson = item.rankings.find(
          (ranking) => ranking.name === name
        );
        dataObject.data.push(dataByPerson.value);
      });
      result.push(dataObject);
    });
    return result;
  };

  useEffect(() => {
    if (type === "invoicing" && invoicingFigure) {
      setData(invoicingFigure);
    } else if (type === "sales" && salesFigure) {
      setData(salesFigure);
    }
  }, [type, invoicingFigure, salesFigure]);

  const highlightScope = {
    highlight: "series",
    fade: "global",
  };

  const series = data ? data.map((s) => ({ ...s, highlightScope })) : [];

  return (
    <>
      <Navbar />
      {!loading ? (
        <div className="saleschart page">
          <div className="saleschart-contents">
            <div className="sales-graph">
              <div className="saleschart-title-box">
                <h2>Sales Chart</h2>
                <h3>
                  Week: {currentWeek.startOfWeek} - {currentWeek.endOfWeek}
                </h3>
              </div>

              <Box sx={{ width: "100%" }}>
                {/* Radio button */}
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="tick-placement-radio-buttons-group-label"
                    name="tick-placement"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <FormControlLabel
                      value="invoicing"
                      control={<Radio />}
                      label="Invoicing"
                    />
                    <FormControlLabel
                      value="sales"
                      control={<Radio />}
                      label="Sales"
                    />
                  </RadioGroup>
                </FormControl>
                {/* Bar graph */}
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["This Week", "MTD", "QTD", "FYTD"],
                    },
                  ]}
                  height={550}
                  series={series}
                  skipAnimation={false}
                />
              </Box>
            </div>

            <div className="salesRanking">
              {initialKPIData?.map((kpi) => (
                <div key={kpi.id} className="kpi-card">
                  <h4>{kpi.title}</h4>
                  <ul>
                    {kpi.rankings?.map((item, index) => (
                      <li key={index} className="ranking-item">
                        <span className="rank">{index + 1}</span>
                        <span className="name">{item.name}</span>
                        <span className="value">{item.value}K</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default SalesChart;
