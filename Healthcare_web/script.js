document.getElementById("appointmentForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const patientId = document.getElementById("patientId").value;
    const doctorId = document.getElementById("doctorId").value;
    const appointmentDate = document.getElementById("appointmentDate").value;

    const token = "YOUR_JWT_TOKEN_HERE"; // Thay thế bằng token hợp lệ từ backend

    const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            patientId,
            doctorId,
            appointmentDate
        })
    });

    const result = await response.json();
    document.getElementById("message").innerText = result.message || "Có lỗi xảy ra!";
});
