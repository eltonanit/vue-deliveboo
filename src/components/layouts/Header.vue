<template>
    <div class="container-fluid">
        <header class="d-flex justify-content-between align-items-center p-3 bg-light">
            <h1 class="text-primary">DELIVEBOO</h1>
            <nav>
                <ul class="nav">
                    <li class="nav-item"><a class="nav-link" href="#">Ristoranti</a></li>     
                                   
                    <li class="nav-item"><a class="nav-link" href="#">Diventa Partner</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Accedi</a></li>
                </ul>
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
