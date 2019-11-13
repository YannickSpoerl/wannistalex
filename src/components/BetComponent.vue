<template>
  <v-container>
    <div v-if="!alreadyArrived">
      <v-row class="justify-center">
        <p v-if="!alreadyArrived" class="display-4 pa-6">{{liveTime}}</p>
      </v-row>
      <v-row class="justify-center pa-2">
        <v-btn elevation="12" x-large color="primary" @click="stopTime" v-if="!alreadyArrived">
          <v-icon>fas fa-user-clock</v-icon>
          Alex ist da!</v-btn>
      </v-row>
      <v-row class="pa-4 justify-center">
        <p class="display-1">aktiver Slot: <strong>{{activeSlot}}</strong></p>
      </v-row>
    </div>
    <div v-if="alreadyArrived">
      <v-row class="justify-center">
        <p class="display-4 pa-6">Ankunft: {{arrivalTime}}</p>
      </v-row>
      <v-row class="justify-center">
        <p class="display-1">Slot: <strong>{{getSlot(arrivalTime)}}</strong></p>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import {db, TimeStamp} from '../db'

export default {
  name: 'BetComponent',
  data() { return {
    liveTime: '',
    timeCounter: undefined,
    arrivals: []
    }
  },
  firestore: {
    arrivals: db.collection('arrivals')
  },
  methods: {
    getTimeString(now){
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
      return timeString
    },
    stopTime() {
      db.collection('arrivals').add({
        subject: 'Alex',
        time: TimeStamp.fromDate(new Date())
      })
    },
    startTime() {
      let now = new Date()
      this.liveTime = this.getTimeString(now)
      let self = this
      this.timeCounter = setInterval(function(){
        self.liveTime = self.getTimeString(new Date())
      }, 1000)
    },
    getSlot(time) {
      let hours = time.split(':')[0]
      if(hours < 8 || hours > 17) {
        return '/'
      }
      let minutes = time.split(':')[1]
      if(minutes >= 45) {
        let nextHour = parseInt(hours) + 1
        return hours + ':' + '45' + ' - ' + nextHour + ':' + '00'
      } else if(minutes >= 30) {
        return hours + ':' + '30' + ' - ' + hours + ':' + '45'
      } else if(minutes >= 15){
        return hours + ':' + '15' + ' - ' + hours + ':' + '30'
      } else {
        return hours + ':' + '00' + ' - ' + hours + ':' + '15'
      }
    }
  },
  beforeMount(){
    this.startTime()
  },
  computed: {
    activeSlot () {
      return this.getSlot(this.liveTime)
    },
    alreadyArrived() {
      let now = new Date()
      let todaysArrivals = []
      this.arrivals.forEach(function(arrival) {
        let timeStamp = new Date(arrival.time.seconds * 1000)
        if(timeStamp.getFullYear() === now.getFullYear() && timeStamp.getMonth() === now.getMonth() && timeStamp.getDate() === now.getDate()) {
          todaysArrivals.push(timeStamp)
        }
      })
      return (todaysArrivals.length === 1)
    },
    arrivalTime() {
      let self = this
      let now = new Date()
      let time
      this.arrivals.forEach(function(arrival) {
        let timeStamp = new Date(arrival.time.seconds * 1000)
        if(timeStamp.getFullYear() === now.getFullYear() && timeStamp.getMonth() === now.getMonth() && timeStamp.getDate() === now.getDate()) {
          time = self.getTimeString(timeStamp)
          return
        }
      })
      return time
    }
  }
}
</script>
