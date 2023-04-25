<template>
  <publicL :Lname="name"></publicL>
</template>
  
<script>

import publicL from './publicL.vue'

export default {

  data() {
    return {
      name: this.$route.params.id
    }
  },
  components: {
    publicL
  },
  mounted() {
    // console.log(this.$route.params.id)
    
  }
}
</script>
  
  