export async function login({ email, password }) {
    try {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
        const data = await res.json();
        return { ok: res.ok, data };
    } catch (e) {
        return { ok: false, data: { message: e.message || "Lỗi không xác định" } };
    }
}

export async function register({ name, email, password }) {
    try {
        const res = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "include",
        });
        const data = await res.json();
        return { ok: res.ok, message: data.message };
    } catch (e) {
        return { ok: false, message: e.message || "Lỗi không xác định" };
    }
}

// Hàm xác thực OTP khi đăng ký
export async function verifyOtpRegister({ email, otp }) {
    try {
        const res = await fetch("/auth/verify-otp-register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
            credentials: "include",
        });
        const data = await res.json();
        return { ok: res.ok, message: data.message };
    } catch (err) {
        return { ok: false, message: err.message || "Lỗi không xác định" };
    }
}

// Hàm xác thực OTP khi quên mật khẩu
export async function verifyOtpForgotPassword({ email, otp }) {
    try {
        const res = await fetch("/auth/verify-otp-forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
            credentials: "include",
        });
        const data = await res.json();
        return { ok: res.ok, message: data.message };
    } catch (err) {
        return { ok: false, message: err.message || "Lỗi không xác định" };
    }
}

// Hàm gửi OTP
export async function sendOtp({ email }) {
    try {
        const res = await fetch("/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            credentials: "include",
        });
        const data = await res.json();
        return { ok: res.ok, message: data.message };
    } catch (err) {
        return { ok: false, message: err.message || "Gửi lại otp thất bại" };
    }
}

// Hàm đổi mật khẩu
export async function resetPassword({ email, password }) {
  try {
    const res = await fetch("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json();
    return { ok: res.ok, message: data.message };
  } catch (e) {
    return { ok: false, message: e.message || "Lỗi không xác định" };
  }
}