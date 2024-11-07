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
          <span class="logo">Delive</span><span class="boo">Boo</span>
        </div>
        <p class="m-0 text-white">Qui andrà un menù</p>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.header {
  background: #4D148C;
  padding: 15px 0;
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
