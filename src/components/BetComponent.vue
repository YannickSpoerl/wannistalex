<template>
  <v-container>
      <h1 class="display-4" font-color="primary">{{liveTime}}</h1>
  </v-container>
</template>

<script>
export default {
  name: 'BetComponent',

  data: () => ({
    liveTime: ''
  }),
  methods: {

  },
  created(){
    let self = this
    setInterval(function(){
      let now = new Date()
      let minutes = now.getMinutes()
      let seconds = now.getSeconds()
      let timeString = now.getHours() + ':'
      if(minutes < 10){
        timeString += '0'
      }
      timeString += minutes + ':'
      if (seconds < 10) {
        timeString += '0'
      }
      timeString += seconds
      self.liveTime = timeString
    }, 1000)
  }
}
</script>
