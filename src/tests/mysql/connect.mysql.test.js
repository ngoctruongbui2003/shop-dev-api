const mysql = require('mysql2');

// Tạo một connection pool
const pool = mysql.createPool({
    host: 'localhost',
    port: 8811,
    user: 'root',
    password: 'mysql',
    database: 'test',
});

const batchSize = 100000;
const total = 10_000_000;

let currentId = 1;
console.timeStamp('----------------START----------------');
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= total ; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId++, name, age, address]);
    }

    if (!values.length) {
        pool.end(error => {
            if (error) {
                console.error(`error occurred while running batch`);
            } else {
                console.log(`Connection pool closed successfully`);
                
            }
        })

        return;
    }

    const query = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
    pool.query(query, [values], async (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        
        console.log(`Inserted ${results.affectedRows} rows`);
        await insertBatch();
    });
}

console.timeEnd('----------------STOP----------------');

insertBatch().catch(console.error);
