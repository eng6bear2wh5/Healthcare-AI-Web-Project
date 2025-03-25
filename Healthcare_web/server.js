const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "DucHung",
    database: "HEALTHCARE_WEBSITE"
});


// API lấy thông tin bệnh nhân
app.get("/api/patient/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query(`
        SELECT U.USERNAME, U.EMAIL, U.PHONE_NUMBER, U.GENDER, P.PATIENT_ID
        FROM USERS U 
        JOIN PATIENT P ON U.USER_ID = P.USER_ID
        WHERE U.USER_ID = ?
    `, [userId], (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy bệnh nhân" });
        }
        res.json(result[0]);
    });
});
// API lấy thông tin bác sĩ
app.get("/api/doctor/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query(`
        SELECT U.USERNAME, U.EMAIL, U.PHONE_NUMBER, D.DOCTOR_ID, D.SPECIALTY
        FROM USERS U 
        JOIN DOCTOR D ON U.USER_ID = D.USER_ID
        WHERE U.USER_ID = ?
    `, [userId], (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
        }
        res.json(result[0]);
    });
});


app.post("/api/appointments", (req, res) => {
    const { patientId, doctorId, dateTime } = req.body;
    const appointmentId = `AP${Date.now()}`;
    const status = "PENDING"; // Mặc định là PENDING

    console.log("Dữ liệu nhận được:", req.body);

    // Thêm lịch hẹn vào database
    db.query(`
        INSERT INTO APPOINTMENTS (APPOINTMENT_ID, PATIENT_ID, DOCTOR_ID, APPOINTMENT_DATE, APPOINTMENT_STATUS)
        VALUES (?, ?, ?, ?, ?)
    `, [appointmentId, patientId, doctorId, dateTime, status], (err) => {
        if (err) {
            console.error("Lỗi khi thêm vào database:", err);
            return res.status(500).json({ error: err.message });
        }

        // Lấy thông tin bệnh nhân
        db.query(`
            SELECT U.EMAIL, U.USERNAME 
            FROM USERS U 
            JOIN PATIENT P ON U.USER_ID = P.USER_ID
            WHERE P.PATIENT_ID = ?
        `, [patientId], (err, resultPatient) => {
            if (err) {
                console.error("Lỗi khi lấy thông tin bệnh nhân:", err);
                return res.status(500).json({ error: err.message });
            }
            if (resultPatient.length === 0) {
                return res.status(404).json({ error: "Không tìm thấy bệnh nhân." });
            }

            const { EMAIL: patientEmail, USERNAME: patientName } = resultPatient[0];

            // Lấy thông tin bác sĩ
            db.query(`
                SELECT U.EMAIL, U.USERNAME 
                FROM USERS U 
                JOIN DOCTOR D ON U.USER_ID = D.USER_ID
                WHERE D.DOCTOR_ID = ?
            `, [doctorId], (err, resultDoctor) => {
                if (err) {
                    console.error("Lỗi khi lấy thông tin bác sĩ:", err);
                    return res.status(500).json({ error: err.message });
                }
                if (resultDoctor.length === 0) {
                    return res.status(404).json({ error: "Không tìm thấy bác sĩ." });
                }

                const { EMAIL: doctorEmail, USERNAME: doctorName } = resultDoctor[0];

                // Thiết lập transporter để gửi email
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                // Gửi email cho bệnh nhân
                const mailPatient = {
                    from: process.env.EMAIL_USER,
                    to: patientEmail,
                    subject: "Xác nhận đặt lịch khám bệnh",
                    text: `Xin chào ${patientName},\n\nBạn đã đặt lịch hẹn với bác sĩ vào lúc ${dateTime}. 
                    \nVui lòng chờ xác nhận từ bác sĩ.\n\nTrân trọng cảm ơn!
                    \n -Tên trang web- \n\nĐây là email tự động, vui lòng không trả lời.`
                };

                transporter.sendMail(mailPatient, (err, info) => {
                    if (err) {
                        console.error("Lỗi khi gửi email cho bệnh nhân:", err);
                    } else {
                        console.log("Email gửi cho bệnh nhân:", info.response);
                    }
                });

                // Gửi email cho bác sĩ
                const mailDoctor = {
                    from: process.env.EMAIL_USER,
                    to: doctorEmail,
                    subject: "Thông báo lịch hẹn cần xác nhận",
                    text: `Xin chào bác sĩ ${doctorName},\n\nBệnh nhân ${patientName} đã đặt lịch hẹn vào lúc ${dateTime}. 
                    \nVui lòng truy cập vào hệ thống để xác nhận hoặc từ chối lịch hẹn này.\n\n\n\nTrân trọng cảm ơn!
                    \n -Tên trang web- \n\nĐây là email tự động, vui lòng không trả lời.`
                };

                transporter.sendMail(mailDoctor, (err, info) => {
                    if (err) {
                        console.error("Lỗi khi gửi email cho bác sĩ:", err);
                    } else {
                        console.log("Email gửi cho bác sĩ:", info.response);
                    }
                });

                // Phản hồi về client
                res.json({ message: "Lịch hẹn đã được đặt! Email xác nhận đã gửi cho bạn & bác sĩ." });
            });
        });
    });
});


app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await db.query("SELECT * FROM APPOINTMENTS");
        res.json(appointments.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi server khi lấy lịch hẹn" });
    }
});


// Khởi động server
app.listen(3000, () => {
    console.log("Server đang chạy trên cổng 3000...");
});
