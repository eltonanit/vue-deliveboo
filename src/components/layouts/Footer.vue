<script>
export default {
  name: "Footer",
};
</script>

<template>
  <div class="bg-dark text-white py-5">
    <div class="container">
      <div class="row">

        <!-- Logo e Informazioni tablet e maggiore-->
        <div class="col-12 col-md-3 d-none d-md-block text-center text-md-start mb-3">
          <h2 class="text_orange">Deliveboo</h2>
          <p class="mb-0">&copy; 2024 Deliveboo - All rights reserved.</p>
        </div>

        <!-- Link Utili -->
        <div class="col-12 col-md-3 text-center mb-3">
          <h5 class="text-warning">Link Utili</h5>
          <ul class="list-unstyled mb-0">
            <li><a href="/about" class="text-white text-decoration-none">Chi Siamo</a></li>
            <li><a href="/privacy-policy" class="text-white text-decoration-none">Privacy Policy</a></li>
            <li><a href="/contact" class="text-white text-decoration-none">Contatti</a></li>
          </ul>
        </div>

        <!-- Social Media -->
        <div class="col-12 col-md-3 text-center mb-3">
          <h5 class="text-warning">Seguici</h5>
          <a href="https://www.facebook.com/deliveboo" target="_blank" class="text-white me-3">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/deliveboo" target="_blank" class="text-white me-3">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com/deliveboo" target="_blank" class="text-white">
            <i class="fab fa-twitter"></i>
          </a>
        </div>

        <div class="col-12 col-md-3 d-md-flex flex-md-column text-center mb-3">
          <h5 class="text-warning">Stay Tuned</h5>
          <p class="mb-3">Presto anche su:</p>
          <div class="d-flex d-md-block d-xl-flex justify-content-center">
            <div class="text-white mb-md-3">
              <span class="border rounded py-1 px-2 me-2 me-md-0 me-xl-2">
                <i class="fa-brands fa-apple"></i>
                <span> App Store</span>
              </span>
            </div>
            <div class="text-white">
              <span class="border rounded py-1 px-2">
                <i class="fa-brands fa-google-play"></i>
                <span> Google Play</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Logo e Informazioni mobile-->
        <div class="col-12 col-md-3 d-md-none text-center text-md-start mb-3">
          <h2 class="text_orange">Deliveboo</h2>
          <p class="mb-0">&copy; 2024 Deliveboo - All rights reserved.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.text_orange {
  color: rgba(255, 128, 1, 1);
}
.text-warning {
  color: #ffd700 !important;
}
</style>
