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

export const validateHotlineNumber = (hotlineNumber) => {
    if (!hotlineNumber) {
        return "Số điện thoại không được để trống";
    }
    const cleanedNumber = hotlineNumber.replace(/[\s.-]/g, '');

    if (!cleanedNumber.startsWith('1800') && !cleanedNumber.startsWith('1900')) {
        return "Số điện thoại phải bắt đầu bằng 1800 hoặc 1900";
    }

    if (cleanedNumber.length < 8 || cleanedNumber.length > 11) {
        return "Số điện thoại phải có từ 8 đến 11 số";
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

export const validateAddress = (province, district, ward, specificAddress, phoneNumber) => {
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
        return phoneError;
    }
    if (!province) {
        return "Vui lòng chọn Tỉnh/Thành phố";
    }
    if (!district) {
        return "Vui lòng chọn Quận/Huyện";
    }
    if (!ward) {
        return "Vui lòng chọn Phường/Xã";
    }
    if (!specificAddress || specificAddress.trim() === '') {
        return "Vui lòng nhập địa chỉ cụ thể";
    }
    if (specificAddress.length > 255) {
        return "Địa chỉ không được vượt quá 255 ký tự";
    }
    return "";
};

export const validateCitizenId = (citizenId) => {
    if (!citizenId) {
        return "Số CCCD không được để trống";
    }
    const citizenIdRegex = /^[0-9]{12}$/;
    if (!citizenIdRegex.test(citizenId)) {
        return "Số CCCD phải có 12 số";
    }
    return "";
};

export const validateDateOfBirth = (dob) => {
    if (!dob) {
        return "Ngày sinh không được để trống";
    }
    const currentDate = new Date();
    const inputDate = new Date(dob);

    if (isNaN(inputDate.getTime())) {
        return "Ngày sinh không hợp lệ";
    }

    if (inputDate > currentDate) {
        return "Ngày sinh không thể là ngày trong tương lai";
    }

    const minAgeDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    if (inputDate > minAgeDate) {
        return "Phải đủ 18 tuổi trở lên";
    }

    const maxAgeDate = new Date(currentDate.getFullYear() - 50, currentDate.getMonth(), currentDate.getDate());
    if (inputDate < maxAgeDate) {
        return "Tuổi không được vượt quá 50";
    }

    return "";
};

export const validateGender = (gender) => {
    if (!gender) {
        return "Giới tính không được để trống";
    }

    const validGenders = ['Nam', 'Nữ', 'Khác'];
    if (!validGenders.includes(gender)) {
        return "Giới tính không hợp lệ";
    }

    return "";
};

export const validateName = (name) => {
    if (!name) {
        return "Tên không được để trống";
    }
    if (name.length > 50) {
        return "Tên không được vượt quá 50 ký tự";
    }
    if (name.length < 2) {
        return "Tên phải có ít nhất 2 ký tự";
    }
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!nameRegex.test(name)) {
        return "Tên chỉ được chứa chữ cái và khoảng trắng";
    }
    return "";
};

export const validateProduct = (product) => {
    if (!product.name) {
        return "Tên sản phẩm không được để trống";
    } else if (product.name.length < 2) {
        return "Tên sản phẩm phải có ít nhất 2 ký tự";
    } else if (product.name.length > 50) {
        return "Tên sản phẩm không được vượt quá 50 ký tự";
    } else if (!/^[\p{L}\d\s.,!?()&-]+$/u.test(product.name)) {
        return "Tên sản phẩm chỉ được chứa chữ cái, số, và một số ký tự đặc biệt (.,!?()&-)";
    }

    if (product.thumbnail && product.thumbnail.length > 255) {
        return "Đường dẫn ảnh thumbnail không được vượt quá 255 ký tự";
    }

    if (product.brand) {
        if (product.brand.length > 50) {
            return "Tên thương hiệu không được vượt quá 50 ký tự";
        } else if (!/^[\p{L}\d\s&-]+$/u.test(product.brand)) {
            return "Tên thương hiệu chỉ được chứa chữ cái, số, khoảng trắng, &, và -";
        }
    }

    if (!product.origin) {
        return "Xuất xứ không được để trống";
    } else if (product.origin.length > 50) {
        return "Xuất xứ không được vượt quá 50 ký tự";
    } else if (!/^[\p{L}\s]+$/u.test(product.origin)) {
        return "Xuất xứ chỉ được chứa chữ cái và khoảng trắng";
    } else if (product.origin.length < 2) {
        return "Xuất xứ phải có ít nhất 2 ký tự";
    }

    if (!product.unit) {
        return "Đơn vị tính không được để trống";
    } else if (product.unit.length > 20) {
        return "Đơn vị tính không được vượt quá 20 ký tự";
    } else if (!/^[\p{L}\d\s/]+$/u.test(product.unit)) {
        return "Đơn vị tính chỉ được chứa chữ cái, số, khoảng trắng và /";
    }

    if (product.inventoryQuantity === undefined || product.inventoryQuantity === null || product.inventoryQuantity === '') {
        return "Số lượng không được để trống";
    } else {
        const quantity = parseInt(product.inventoryQuantity, 10);
        if (isNaN(quantity) || quantity !== parseFloat(product.inventoryQuantity)) {
            return "Số lượng phải là số nguyên";
        } else if (quantity < 1) {
            return "Số lượng phải lớn hơn 0";
        } else if (quantity > 10000) {
            return "Số lượng không được vượt quá 10,000";
        }
        product.inventoryQuantity = quantity;
    }


    if (product.serial === undefined || product.serial === null) {
        return "Số serial không được để trống";
    } else if (product.serial === '') {
        return "Số serial không được để trống";
    } else if (product.serial.length > 50) {
        return "Số serial không được vượt quá 50 ký tự";
    } else if (!/^[A-Za-z0-9-]+$/.test(product.serial)) {
        return "Số serial chỉ được chứa chữ cái, số và dấu gạch ngang";
    }

    if (product.warranty === undefined || product.warranty === null || product.warranty === '') {
        return "Bảo hành không được để trống";
    } else {
        const warrantyValue = parseInt(product.warranty, 10);
        if (isNaN(warrantyValue) || warrantyValue !== parseFloat(product.warranty)) {
            return "Thời gian bảo hành phải là số nguyên";
        } else if (warrantyValue < 0) {
            return "Thời gian bảo hành không được âm";
        } else if (warrantyValue > 120) {
            return "Thời gian bảo hành không được vượt quá 120 tháng";
        }
        product.warranty = warrantyValue;
    }

    if (!product.buyPrice) {
        return "Giá không được để trống";
    } else if (isNaN(product.buyPrice) || product.buyPrice <= 0) {
        return "Giá phải là số dương";
    }

    if (!product.sellPrice) {
        return "Giá không được để trống";
    } else if (isNaN(product.sellPrice) || product.sellPrice <= 0) {
        return "Giá phải là số dương";
    }


    if (product.tax === undefined || product.tax === null || product.tax === '') {
        return "Thuế không được để trống";
    } else {
        const taxValue = parseFloat(product.tax);
        if (isNaN(taxValue) || taxValue < 0 || taxValue > 100) {
            return "Thuế phải là số từ 0 đến 100";
        }
        product.tax = taxValue;
    }

    if (!product.description) {
        return "Mô tả sản phẩm không được để trống";
    } else if (product.description.length < 10) {
        return "Mô tả sản phẩm phải có ít nhất 10 ký tự";
    } else if (product.description.length > 255) {
        return "Mô tả sản phẩm không được vượt quá 255 ký tự";
    }

    return null;
};