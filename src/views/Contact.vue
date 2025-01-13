<template>
    <div class="contact-container">
      <!-- Phần liên hệ và bản đồ chia thành hai cột -->
      <div class="content-wrapper">
        <!-- Cột bên trái: Thông tin liên hệ -->
        <div class="contact-info">
          <h2 class="title">Cửa hàng Công nghệ và Điện tử Techify</h2>
          <div class="info-item">
            <span class="icon">📍</span>
            <p><strong>Địa chỉ:</strong> Trường Cao đẳng FPT Polytechnic Hà Nội, Trịnh Văn Bô</p>
          </div>
          <div class="info-item">
            <span class="icon">☎️</span>
            <p><strong>Hotline:</strong> +84 867110604</p>
          </div>
          <div class="info-item">
            <span class="icon">✉️</span>
            <p><strong>Email:</strong> techifyshop@gmail.com</p>
          </div>
          <div class="info-item">
            <span class="icon">💬</span>
            <p><strong>Zalo:</strong> Techify - Công nghệ và điện tử</p>
          </div>
        </div>
  
        <!-- Cột bên phải: Google Map -->
        <div class="map-container">
          <iframe
            title="Google Map FPT Polytechnic"
            src="https://maps.google.com/maps?q=21.0266468,105.7703291&hl=vi&z=17&output=embed"
            width="100%"
            height="100%"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
  
      <!-- Phần email đăng ký -->
      <div class="subscribe-section">
        <input
          type="email"
          placeholder="Nhập email để nhận tin khuyến mãi"
          class="email-input"
        />
        <button class="subscribe-button">ĐĂNG KÝ</button>
      </div>
    </div>
  </template>
  
  <script setup>
  // Không cần logic JS cho phiên bản này
  </script>
  
  <style scoped>
  /* Container chính */
  .contact-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
  }
  
  /* Chia hai cột cho nội dung chính */
  .content-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 90%;
    max-width: 1200px;
    margin-bottom: 20px;
  }
  
  /* Cột bên trái: thông tin liên hệ */
  .contact-info {
    flex: 1;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .title {
    color: #003cb3;
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  
  .icon {
    font-size: 1.5rem;
    margin-right: 10px;
  }
  
  /* Cột bên phải: bản đồ */
  .map-container {
    flex: 1;
    border: 2px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    height: 350px; /* Chiều cao cho bản đồ */
  }
  
  /* Phần email đăng ký */
  .subscribe-section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    width: 90%;
    max-width: 800px;
  }
  
  .email-input {
    padding: 12px 15px;
    width: 70%; /* Độ dài của input */
    border: 1px solid #ccc;
    border-radius: 4px 0 0 4px;
    font-size: 1rem;
  }
  
  .subscribe-button {
    background-color: #ffcc00;
    color: #000;
    border: none;
    padding: 12px 20px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    font-size: 1rem;
  }
  
  .subscribe-button:hover {
    background-color: #ffb300;
  }
  </style>
  