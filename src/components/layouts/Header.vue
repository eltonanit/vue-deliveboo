<template>
    <div class="container-fluid">
        <header class="d-flex justify-content-center header">
           <div class="logo"><span class="logo">Delive</span><span class="boo">Boo</span></div>
            <nav>
              
            </nav>       
        </header> 
    </div>
  
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
.header {
  background: #4D148C;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: white;
  transition: transform 0.3s ease-in-out;
}

.boo {
  color: rgba(255,128,1,1);
}
</style>
