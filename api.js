const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_app_db',
  password: '962002',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Server is running and ready to receive POST requests at /add-point!');
});

app.post('/add-point', async (req, res) => {
  const { name, service_type, description, lat, lng } = req.body;
  const client = await pool.connect();
  try {
    //  تأكد من تحديث جدول `users` في قاعدة البيانات ليشمل الأعمدة الجديدة (service_type, description)
    const query = 'INSERT INTO users (name, service_type, description, location) VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))';
    const values = [name, service_type, description, parseFloat(lng), parseFloat(lat)];
    await client.query(query, values);
    res.status(200).send('تمت إضافة النقطة بنجاح!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('حدث خطأ أثناء إضافة النقطة.');
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});