<template>
    <iframe :src='url' id='show' width='100%' height="780px" frameborder=0 name='showHere' ></iframe>
</template>
<script>
  export default {
    data() {
      return {
        url: severUrl.zipkinUrl
      }
    }
  }
</script>

