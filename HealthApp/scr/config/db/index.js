const mysql = require('mysql2');


const pool = mysql.createPool({
  connectionLimit: 10, // Số kết nối tối đa trong pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db2 = pool.promise();
db2.getConnection()
  .then(connection => {
    console.log('✅ Kết nối MySQL thành công!');
    connection.release(); // Trả kết nối về pool sau khi kiểm tra
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MySQL:', err);
  });
module.exports = db2;

