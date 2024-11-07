<template>
  <header class="header">
    <div class="logo-container">
      <span class="logo">Delive<span class="boo">Boo</span></span>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
.header {
  background: white;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 90px;
  z-index: 1;
  width: 100%;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  color: rgba(255,128,1,1);
  transition: transform 0.3s ease-in-out;
}

.boo {
  color: rgba(77,3,112,1);
}
</style>
