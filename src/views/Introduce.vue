<template>
  <div class="about-us">
    <section class="hero-section" data-aos="fade-up">
      <div class="animated-background">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="hero-content">
        <h1>Về Chúng Tôi</h1>
        <p style="color: white;">Techify – Phụ kiện công nghệ và điện tử, chất lượng vượt trội, dịch vụ tận tâm.</p>
        <a href="#company-intro" class="btn btn-alt">Tìm Hiểu Thêm</a>
      </div>
    </section>

    <section id="company-intro" class="company-intro" data-aos="fade-up">
      <div class="content">
        <h2>Giới Thiệu Về Techify</h2>
        <p>
          Techify là một trong những đơn vị hàng đầu cung cấp các sản phẩm phụ kiện công nghệ và điện tử chính hãng. Với cam kết mang đến cho khách hàng những sản phẩm chất lượng cao, Techify tự hào là đối tác tin cậy của hàng triệu người tiêu dùng.
        </p>
        <p>
          Chúng tôi chuyên cung cấp các phụ kiện công nghệ tiên tiến, luôn cập nhật các xu hướng mới nhất từ thị trường toàn cầu. Mỗi sản phẩm đều được kiểm tra chất lượng nghiêm ngặt trước khi đến tay khách hàng.
        </p>
      </div>
      <img src="#" alt="Techify Company" class="intro-img" />
    </section>

    <section class="mission" data-aos="fade-left">
      <div class="content">
        <h2>Sứ Mệnh Của Chúng Tôi</h2>
        <p>
          Tại Techify, sứ mệnh của chúng tôi là đem đến những giải pháp công nghệ tiện ích, hiện đại và phù hợp nhất với nhu cầu của khách hàng. Chúng tôi cam kết cung cấp những sản phẩm chất lượng, với giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.
        </p>
      </div>
      <img src="#" alt="Mission Image" class="mission-img" />
    </section>

    <section class="values" data-aos="fade-right">
  <h2>Giá Trị Cốt Lõi</h2>
  <div class="values-columns">
    <div class="column">
      <div class="value-item">
        <div class="icon">1</div>
        <p>Chất lượng vượt trội</p>
      </div>
      <div class="value-item">
        <div class="icon">2</div>
        <p>Đổi mới sáng tạo</p>
      </div>
    </div>
    <div class="column">
      <div class="value-item">
        <div class="icon">3</div>
        <p>Dịch vụ khách hàng chuyên nghiệp</p>
      </div>
      <div class="value-item">
        <div class="icon">4</div>
        <p>Trách nhiệm xã hội</p>
      </div>
    </div>
  </div>
</section>


    <section class="team" data-aos="fade-up">
      <h2>Đội Ngũ Techify</h2>
      <div class="team-members">
        <div class="member">
          <img src="#" alt="Team Member 1" class="member-img">
          <h3>Nguyễn Văn A</h3>
          <p>Giám Đốc Điều Hành</p>
        </div>
        <div class="member">
          <img src="#" alt="Team Member 2" class="member-img">
          <h3>Trần Thị B</h3>
          <p>Giám Đốc Kỹ Thuật</p>
        </div>
        <div class="member">
          <img src="#" alt="Team Member 3" class="member-img">
          <h3>Phạm Minh C</h3>
          <p>Giám Đốc Marketing</p>
        </div>
      </div>
    </section>

    <section class="contact" data-aos="zoom-in">
      <h2>Liên Hệ Với Chúng Tôi</h2>
      <p>Để biết thêm chi tiết về sản phẩm hoặc dịch vụ, vui lòng liên hệ qua các kênh dưới đây:</p>
      <ul>
        <li>Email: <a href="mailto:contact@techify.vn">techifyshop@gmail.com</a></li>
        <li>Hotline: <a href="tel:19001234">+84 867110604</a></li>
        <li>Địa chỉ: 7 Đường Bảo Đà, Thôn Đìa, Bình Minh, Thanh Oai, TP Hà Nội</li>
      </ul>
      <div class="contact-buttons">
        <a href="mailto:contact@techify.vn" class="btn">Liên Hệ Qua Email</a>
        <a href="tel:19001234" class="btn btn-alt">Gọi Ngay</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import 'aos/dist/aos.css';
import AOS from 'aos';

AOS.init({
  duration: 1500,
  easing: 'ease-in-out',
  once: true,
});
</script>

<style scoped>
/* Toàn cục */
.about-us {
  font-family: 'Poppins', sans-serif;
  line-height: 1.8;
  color: #2c3e50;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1abc9c, #16a085);
  color: white;
  text-align: center;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  position: relative;
}

.hero-content p {
  font-size: 22px;
  font-weight: 300;
  margin-bottom: 20px;
}

.hero-content .btn-alt {
  padding: 12px 24px;
  background: #2980b9;
  color: white;
  font-size: 18px;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.hero-content .btn-alt:hover {
  background: #3498db;
  transform: scale(1.1);
}

/* Images */
.intro-img, .mission-img {
  max-width: 100%;
  border-radius: 12px;
  margin-top: 20px;
}

/* Các Section */
section {
  margin: 80px 20px;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

section h2 {
  font-size: 32px;
  color: #1abc9c;
  text-align: center;
}

section p,
section ul {
  font-size: 18px;
  color: #7f8c8d;
}

/* Team Section */
.team-members {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.member {
  text-align: center;
  max-width: 200px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.member:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.member-img {
  width: 100%;
  height: auto;
  border-radius: 50%;
  border: 3px solid #bdc3c7;
}

/* Contact Buttons */
.contact-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 12px 24px;
  background: #1abc9c;
  color: white;
  font-size: 18px;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.btn:hover {
  background: #16a085;
  transform: scale(1.05);
}

.values-columns { 
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Hai cột bằng nhau */
  gap: 40px; /* Khoảng cách giữa các cột */
}

.column {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Khoảng cách giữa các hàng */
}

.value-item {
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: flex-start; /* Căn trái để duy trì cấu trúc */
  margin-left: 140px; /* Đẩy toàn bộ mục sang phải */
}

.value-item .icon {
  width: 40px;
  height: 40px;
  background: #1abc9c;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0; /* Đảm bảo icon không co lại */
}

.value-item p {
  margin: 0;
  font-size: 18px;
  color: #34495e;
  text-align: left; /* Văn bản căn lề trái */
  line-height: 1.5; /* Dòng chữ cách đều nhau */
}

.values-columns {
  align-items: start; /* Đảm bảo các cột cùng bắt đầu tại một vị trí */
}

.value-item {
  justify-content: start; /* Văn bản và icon căn thẳng theo chiều ngang */
  gap: 15px; /* Khoảng cách giữa icon và văn bản */
}




</style>
