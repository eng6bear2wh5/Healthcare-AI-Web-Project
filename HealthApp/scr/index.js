const express = require('express'); // Import thư viện Express
require('dotenv').config(); // để trước các import khác để nạp trước khi chạy các file khác.
const path = require('path'); // hỗ trợ tác vụ liên quan đến đường dẫn

// các thư viện hỗ trợ trong quá trình code
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');

//mặc định sẽ luôn tìm file index.js nếu chỉ thêm vào thư mục và không chỉ định cụ thể file nào
const route = require('./routes'); 

//session
//const session = require('express-session');
const passport = require('./config/passport');

// Khởi tạo ứng dụng Express
const app = express();
const port = 3000;

// method-override
app.use(methodOverride('_method'));

//dùng Express để phục vụ file tĩnh (static files)  
app.use(express.static(path.join(__dirname, 'public')));

//Middleware để xử lý JSON (dữ liệu được submit từ form và lưu vào req.body)
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

//HTTP logger
app.use(morgan('combined'));

//Template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    //helpers: require('./helpers/handlebars')
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// test: use 1 middleware để hiển thị lên console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Chuyển tiếp request đến middleware hoặc route handler tiếp theo
});

// middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi!' });
});

// Cấu hình session
// app.use(session({
//   secret: 'my_secret_key',
//   resave: false,
//   saveUninitialized: false
// }));

// Cấu hình Passport
app.use(passport.initialize());
//app.use(passport.session());

//Route init
route(app);

//Lắng nghe kết nối từ client trên cổng 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
