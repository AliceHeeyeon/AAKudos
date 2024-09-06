import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    server : process.env.MSSQL_HOST,
    database : process.env.MSSQL_AAKPI_DB,
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    options: {
        encrypt: false
    }
}

let poolPromise = null;

async function getSqlPool() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('Connected to SQL Server');
                return pool;
            })
            .catch(err => {
                console.error('Database connection failed:', err);
                poolPromise = null;
                throw err; 
            });
    }
    return poolPromise;
}

// Get KPI groups and order by 'ordinal'. 
// There are 6 groups where k.LeaderboardEnabled = 1
export async function getGroups(req, res) {
    try {
        const pool = await getSqlPool();
        const request = pool.request();
        const response = await request.query(
            `SELECT DISTINCT g.Id AS id, g.Name AS text, g.Ordinal AS ordinal
            FROM [UserKPIGroup] g
            JOIN [UserKPI] uk ON uk.UserKpiGroupId = g.Id
            JOIN [KPI] k ON uk.KPIId = k.Id
            WHERE k.LeaderboardEnabled = 1
            `
        );
        
        const groups = response.recordset;
        groups.sort((a, b) => a.ordinal - b.ordinal)
        const leaderboardPages = await getAllKPIData(groups);
        res.status(200).json(leaderboardPages);
        console.log(response.recordset);
        
    } catch (err) {
        console.error('Error querying to get groups:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Query SQL database to retrieve KPI data matching the given conditions for all groups
async function getAllKPIData(groups) {
    try {
        const pool = await getSqlPool();

        let today = new Date();
        let dayOfWeek = today.getDay();
        let first = today.getDate() - ((dayOfWeek + 6) % 7);
        let last = first + 6
        
        // Define the start and end of the week
        let startOfweek = new Date(today);
        startOfweek.setUTCDate(first)
        startOfweek.setUTCHours(0, 0, 0 ,0)
        
        let endOfWeek = new Date(startOfweek);
        endOfWeek.setUTCDate(last)
        endOfWeek.setUTCHours(0, 0, 0, 0)

        let weekEnding = endOfWeek.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '.000');

        let allKpis = [];
        for(let group of groups) {
            const request = pool.request();
            const kpis = await request
            .input('userKpiGroup', sql.UniqueIdentifier, group.id)
            .input('weekEnding', weekEnding)
            .query(
                    `
                    SELECT k.Id AS KPIId, k.Name, k.GridFactor, 
                    u.FirstName, u.LastName, s.Value
                    FROM [KPI] k
                    JOIN [UserKPI] uk ON k.Id = uk.KPIId
                    JOIN [User] u ON uk.UserId = u.Id
                    JOIN [UserKPIEntry] s ON uk.Id = s.UserKPIId
                    WHERE k.LeaderboardEnabled = 1
                    AND uk.WhenObsoleted IS NULL
                    AND uk.UserKpiGroupId = @userKpiGroup
                    AND u.WhenDeleted IS NULL
                    AND s.ForWeekEnding = @weekEnding
                    ORDER BY k.Ordinal
                  `);
                
                allKpis = allKpis.concat(kpis.recordset);
            }
        console.log(allKpis)
        return getLeaderboardPage(allKpis);
    } catch (err) {
        console.error('Error querying the database:', err);
    } finally {
        sql.close();
    }
}

// Group KPI data by KPIId and create leaderboard rankings
async function getLeaderboardPage(kpis) {
    let pages = [];

    // Group KPI entries by KPIId
    let groupedKPIs = kpis.reduce((acc, kpi) => {
        if (!acc[kpi.KPIId]) {
            acc[kpi.KPIId] = {
                id: kpi.KPIId,
                title: kpi.Name,
                rankings: []
            };
        }

        //Filter user name
        let firstName = kpi.FirstName
        if(hideUsers(firstName)) {
            return acc;
        }

        // Add user data to the corresponding KPIId group
        let value = parseFloat(kpi.Value) || 0;
        let calculatedValue = applyGridFactor(kpi.GridFactor, value);
        acc[kpi.KPIId].rankings.push({
            name: `${kpi.FirstName} ${kpi.LastName}`,
            value: calculatedValue
        });

        return acc;
    }, {});

    //Slice top 8 group as we wish to display only Invoicing and Sales ranking
    let kpiArray = Object.values(groupedKPIs)
    kpiArray = kpiArray.slice(0, 8);

    // sorting rankings
    for (let kpiId in kpiArray) {
        let kpiData = kpiArray[kpiId];

        kpiData.rankings.sort((a, b) => b.value - a.value);

        // add positions after sorting
        // kpiData.rankings = kpiData.rankings.map((r, index) => ({
        //     position: index + 1,
        //     name: r.name,
        //     value: r.value
        // }));

        pages.push(kpiData);
    }

    return pages;
}

// Hide ex staff from leaderboard
function hideUsers(name) {
    const hiddenNames = ["Dean", "Dwayne", "Rhys", "Gary", "Blair", "Erik", "Jay"];
    return hiddenNames.some(hidden => name.startsWith(hidden));
}

// Apply the GridFactor to the value and format the result
function applyGridFactor(gridFactor, value) {
    if (gridFactor === 'K') {
        return Math.round(value / 1000);
    }
    return value;
}