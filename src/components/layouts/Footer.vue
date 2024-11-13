<script>
export default {
  name: "Footer",
};
</script>

<template>
  <div class="container-footer overflow-hidden">
    <div class="row">
      <div class="col-12">
        <div class="footer-content mt-5">
          <div class="footer-left text_orange">
            <p>&copy; 2024 Deliveboo - All rights reserved.</p>
          </div>
          <div class="footer-links">
            <ul class="list-unstyled d-flex">
              <li><a href="/about">Chi Siamo</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/contact">Contatti</a></li>
            </ul>
          </div>
          <div class="mt-4">
            <ul class="list-unstyled d-flex">
              <li class="me-3">
                <a href="https://www.facebook.com/deliveboo" target="_blank" class="social-icon">
                  <i class="fab fa-facebook-f"></i>
                </a>
              </li>
              <li class="me-3">
                <a href="https://www.instagram.com/deliveboo" target="_blank" class="social-icon">
                  <i class="fab fa-instagram"></i>
                </a>
              </li>
              <li class="me-3">
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

.container-footer{
  height: calc(100vh - 85vh);
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
