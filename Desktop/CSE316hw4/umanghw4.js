var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password123',
    database: 'hw4'
});

const express = require('express');
const app = express();
const url = require('url');

app.get('/', (req, res) => {
writeSearch(req, res);
});

app.get('/schedule', (req, res) => {
    writeSchedule(req,res);
});

port = process.env.port || 3000;
app.listen(port, () => {
    console.log('server started!');
});

function writeSearch(req, res){
    res.writeHead(200, { 'Content-Type': 'text/html'});
    let query = url.parse( req.url, true).query;
    let search = query.search ? query.search : '';
    let filter = query.filter ? query.filter: '';

    let html = `
    <!DOCTYPE html>
    <html lang='en'>

    <head>
        <title> Spring 2021 CSE Class Find </title>
    </head>

    <body>
        <h1> Spring 2021 CSE Class Find </h1><br>
        <form methods = 'get' action ='/'>
            <input type ='text' name = 'search' value=''>
            <b>in</b>
            <select name = 'filter'>
                <option value='allFields'>All Fields</option>
                <option value='courseName'>Course Title</option>
                <option value='courseNum'>Course Num</option>
                <option value='instructor'>Instructor</option>
                <option value='day'>Day</option>
                <option value='time'>Time</option>
            </select>
            <input type = 'submit' value ='Submit'>
            <br>
            </form>
            <br><br>
            `;

            let sql = ' SELECT * FROM trial1;';

            if(filter == 'allFields')
                sql =  `SELECT * FROM trial1
                    WHERE  Subj  LIKE '%` + search +   `%' OR
                        CRS LIKE '%` + search + `%' OR
                        Cmp  LIKE '%` + search + `%' OR
                        Sctn  LIKE '%` + search + `%' OR
                        Days  LIKE '%` + search + `%' OR
                        StartTime  LIKE '%` + search + `%' OR
                        EndTime  LIKE '%` + search + `%' OR
                        MtgStartDate  LIKE '%` + search + `%' OR
                        MtgEndDate  LIKE '%` + search + `%' OR
                        Duration  LIKE '%` + search + `%' OR
                        InstructionMode  LIKE '%` + search + `%' OR
                        Building  LIKE '%` + search + `%' OR
                        Room  LIKE '%` + search + `%' OR
                        Instr  LIKE '%` + search + `%' OR
                        EnrlCap  LIKE '%` + search + `%' OR
                        WaitCap  LIKE '%` + search + `%' OR
                        CmbndDescr  LIKE '%` + search + `%' OR
                        CmbndEnrlCap  LIKE '%` + search + `%';`;
            else if (filter == 'courseNum')
                sql = `SELECT * FROM trial1
                    WHERE  CRS   LIKE '%` + search + `%';`;
            else if (filter == 'courseName')
                sql = `SELECT * FROM trial1
                WHERE  Subj   LIKE '%` + search + `%';`;
            else if (filter == 'Instructor ')
                sql = `SELECT * FROM trial1
                    WHERE  Instr   LIKE '%` + search + `%';`;
            else if (filter == 'day')
                    sql = `SELECT * FROM trial1
                        WHERE  days   LIKE '%` + search + `%';`;
                else if ( filter == 'time')
                    sql = ` SELECT * FROM trial1 
                        WHERE StartTime  LIKE '%` + search + `%' OR
                            EndTime   LIKE '%` + search +  `%';`;
                
                con.query(sql, function(err, result)    {
                    if(err) throw err;
                    for(let item of result){
                        html += `
                        <button type ='button' class='toggle'> CSE ` + item.CRS +   `-` +
                        item.Subj +  `-` + item.Cmp + ` - Section ` + item.Sctn +   `</button>
                        <pre>
                        Days: ` + item.Days + `
                        Start Time:  ` + item.StartTime + `
                        End Time: ` + item.EndTime + `
                        Start Date: ` + item.MtgStartDate + `
                        End Date:  ` + item.MtgEndDate + `
                        Duration: ` + item.Duration + `
                        Intruction Mode:  ` + item.InstructionMode + `
                        Building: ` + item.Building + `
                        Room: ` + item.Room + `
                        Instructor:  ` + item.Instr + `
                        Enrollment Cap: ` + item.EnrlCap + `
                        Wait Cap:  ` + item.WaitCap + `
                        Combined Description: ` + item.CmbndDescr + `
                        Combined Enrollment Cap: ` + item.CmbndEnrlCap + `<form action='/schedule' method= 'get'>
                        <button name = 'add' value ='` + item.id + `'> Add Class </button></form> </pre>`;
                         }
                         res.write(html+ '\n\n</body>\n</html>');
                         res.end();
                        });
                    };
                    function writeSchedule(req, res){
                        let query = url.parse(req.url, true).query;
                        let addQuery = `INSERT INTO trial2 SELECT * FROM trial1 WHERE trial1.id='` + query.add + `';`

                        let html = 
                        `<!DOCTYPE html>
                        <html>
                        <head>
                            <title> Schedule </title>
                            <style type = text/css>
                            table, tr,th ,td {
                                border: 1px solid black;
                                height: 50px;
                                vertical-align: bottom;
                                padding: 15px;
                                text-align: left;
                            }
                            </style>
                        </head>
                        <body>
                            <h1> Schedule </h1><br>
                            <a href = '/'><b> Return to Search </b></a>
                            <br><br>

                            <table>
                                <tr>
                                    <th> Mon </th>
                                    <th> Tue </th>
                                    <th> Wed </th>
                                    <th> Thu </th>
                                    <th> Fri </th>
                                </tr>
                                <tr>
                                <td> Mon </td>
                                <td> Tue </td>
                                <td> Wed </td>
                                <td> Thu </td>
                                <td> Fri </td>
                            </tr>
                            </table>
                        </body>
                        </html>
                        `;

    con.query(addQuery, function(err, result){
        if(err) console.log(err);
        con.query(construcSQLDayCommand('M'), function(err, result){
         if (err) throw err;
         html = html.replace('<td> Mon </td>', getDay(result, 'MON'));
         con.query(construcSQLDayCommand('TU'), function(err, result){
            if (err) throw err;
            html = html.replace('<td> Tue </td>', getDay(result, 'TUE'));
            con.query(construcSQLDayCommand('W'), function(err, result){
                if (err) throw err;
                html = html.replace('<td> Wed </td>', getDay(result, 'WED'));
                con.query(construcSQLDayCommand('TH'), function(err, result){
                    if (err) throw err;
                    html = html.replace('<td> Thu </td>', getDay(result, 'THU'));
                    con.query(construcSQLDayCommand('F'), function(err, result){
                        if (err) throw err;
                        html = html.replace('<td> Fri </td>', getDay(result, 'TUE'));
                        res.write(html+'\n\n</body>\n</html>');
                        res.end();
           
                    });    
                });      
            });      
        });      
    });      
});         
          

}

function getDay(SQLResult, tableHeader){
    let restStr = '<td>';
    for(let item of SQLResult){
        restStr += '\n       <b> ' +  item.Subj  + " " +
                            item.CRS + '-' + item. StartTime + ' - '
        +
                            item.EndTime + ' <br><br>' +
                          
                            item.Sctn + ' </b> <p> ' +
                            item.Subj + '<br><br>' +
                            item.Instr + '<br><br>'+
                            '<br/><br/>';
                        
    }
    return restStr + '</td>';

}
function construcSQLDayCommand(search){
    var sql = `SELECT * FROM trial2
                WHERE  DAYS             LIKE '%` + search + `%';`;
                return sql;
};