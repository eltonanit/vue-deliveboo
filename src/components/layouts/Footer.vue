<script>
export default {
  name: "Footer",
};
</script>

<template>
  <div class="container p-5">
    <div class="row">
      <div class="col-12 pt-5">
        <div class="footer-content">
          <div class="footer-left pt-5 text_orange">
            <p>&copy; 2024 Deliveboo - All rights reserved.</p>
          </div>
          <div class="footer-links pt-5">
            <ul>
              <li><a href="/about">Chi Siamo</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/contact">Contatti</a></li>
            </ul>
          </div>
          <div class="pt-5">
            <h5 class="text-white mb-3">Social</h5>
            <ul class="list-unstyled">
              <li>
                <a href="https://www.facebook.com/deliveboo" target="_blank" class="social-icon">
                  <i class="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/deliveboo" target="_blank" class="social-icon">
                  <i class="fab fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/deliveboo" target="_blank" class="social-icon">
                  <i class="fab fa-twitter"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

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

.social-icon {
  color: #fff;
  font-size: 18px;
  transition: color 0.3s;
}

.social-icon:hover {
  color: #ffd700; /* colore dorato per hover */
}

.text_orange {
  color: rgba(255,128,1,1);
}
</style>
