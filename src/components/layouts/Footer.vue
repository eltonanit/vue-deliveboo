<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <p>&copy; 2024 Deliveboo - All rights reserved.</p>
      </div>
      <div class="footer-links">
        <ul>
          <li><a href="/about">Chi Siamo</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/contact">Contatti</a></li>
        </ul>
      </div>
      <div class="footer-socials">
        <a
          href="https://www.facebook.com/deliveboo"
          target="_blank"
          class="social-icon"
          ><i class="fab fa-facebook-f"></i
        ></a>
        <a
          href="https://www.instagram.com/deliveboo"
          target="_blank"
          class="social-icon"
          ><i class="fab fa-instagram"></i
        ></a>
        <a
          href="https://twitter.com/deliveboo"
          target="_blank"
          class="social-icon"
          ><i class="fab fa-twitter"></i
        ></a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  color: #fff;
  padding: 20px 0;
  text-align: center;
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-left p {
  margin: 0;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #ffd700; /* colore dorato per hover */
}

.footer-socials {
  display: flex;
  gap: 15px;
}

.social-icon {
  color: #fff;
  font-size: 18px;
  transition: color 0.3s;
}

.social-icon:hover {
  color: #ffd700; /* colore dorato per hover */
}
</style>
