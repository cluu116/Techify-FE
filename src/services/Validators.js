export const validateEmail = (email) => {
    if (!email) {
        return "Email không được để trống";
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return "Email không hợp lệ";
    }
    if (email.length > 255) {
        return "Email không được vượt quá 255 ký tự";
    }
    return "";
};

export const validatePassword = (password) => {
    if (!password) {
        return "Mật khẩu không được để trống";
    }
    if (password.length < 8) {
        return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (password.length > 50) {
        return "Mật khẩu không được vượt quá 50 ký tự";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt";
    }
    return "";
};

export const validateFullName = (fullName) => {
    if (!fullName) {
        return "Họ và tên không được để trống";
    }
    if (fullName.length < 2) {
        return "Họ và tên phải có ít nhất 2 ký tự";
    }
    if (fullName.length > 50) {
        return "Họ và tên không được vượt quá 50 ký tự";
    }
    const fullNameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!fullNameRegex.test(fullName)) {
        return "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
    }
    return "";
};

export const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
        return "Số điện thoại không được để trống";
    }
    const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    if (!phoneRegex.test(phoneNumber)) {
        return "Số điện thoại không hợp lệ";
    }
    return "";
};