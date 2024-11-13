<script>
export default {
  name: "Header",
};
</script>

<template>

  <div class="container header">
    <div class="row">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div class="logo">
          <router-link :to="{ name: 'Home' }" class="text_orange link-underline link-underline-opacity-0"> <span class="logo">Delive</span><span class="boo">Boo</span></router-link>
        </div>
        <p class="m-0 text-white">Qui andrà un menù</p>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.header {
  background: #4D148C;
  height: 10vh;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  color: white;
}

.boo {
  color: rgba(255,128,1,1);
}
</style>
