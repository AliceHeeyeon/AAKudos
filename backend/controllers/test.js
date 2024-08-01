import sql from 'mssql';

const config = {
    server : "192.168.20.13",
    database : "AAStaffRecognition",
    user: "gareth.evans",
    password: "acvt3rva",
    options: {
        encrypt: false
    }
}

sql.connect(config, err => {
    if(err) {
        console.error("Error Connecting to SQL Server", err)
    } else {
        console.log("Connecting estabilish successfully");

        const request = new sql.Request();
        request.query('SELECT * FROM [User]', (err, result) => {
            if(err){
                console.error("Error querying data: ", err)
            } else {
                console.log(result.recordsets)
            }
        })
    }
})