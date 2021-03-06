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
      <v-row class="pa-3 justify-center">
        <p class="display-1">aktiver Slot: <strong>{{activeSlot}}</strong></p>
      </v-row>
      <v-row class="pa-3 justify-center">
        <p class="display-1">Einsatz: <strong>1 €</strong></p>
      </v-row>
      <v-spacer style="padding-top:4.5em"></v-spacer>
      <v-stepper alt-labels class="mt-12" value=" ">
        <v-stepper-header>
          <v-stepper-step step="">
            {{previousBettor.bettor}}
            <small class="pa-1">{{previousBettor.slot}}</small>
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step=" ">
            {{currentBettor.bettor}}
            <small class="pa-1">{{currentBettor.slot}}</small>
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="">
            {{nextBettor.bettor}}
            <small class="pa-1">{{nextBettor.slot}}</small>
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
    </div>
    <div v-if="alreadyArrived">
      <v-row class="justify-center">
        <p class="display-4 pa-6">Ankunft: {{arrivalTime}}</p>
      </v-row>
      <v-row class="justify-center">
        <p class="display-1">Slot: <strong>{{getSlot(arrivalTime)}}</strong></p>
      </v-row>
      <v-card color="primary" dark class="mx-auto" max-width="600">
        <v-card-title class="display-1">{{winner.bettor}} gewinnt!</v-card-title>
        <v-card-subtitle class="headline">{{winner.slot}}</v-card-subtitle>
        <v-card-text class="body-1">Gewinn: {{pot}}€</v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import {db, TimeStamp} from '../db'

export default {
  name: 'BetComponent',
  props: ['bets', 'alreadyArrived', 'pot'],
  data() { return {
    liveTime: '',
    timeCounter: undefined,
    arrivals: [],
    }
  },
  firestore: {
    arrivals: db.collection('arrivals'),
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
      if(time === undefined){
        return '/'
      }
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
    },
    getNearestBetIndex(date) {
      let index = 0
      let position = ''
      let distance = 86400000
      for(let i = 0; i < this.bets.length; i++) {
        let slot = this.bets[i].slot
        if(this.activeSlot === slot) {
          index = i
          distance = 0
          position = 'in'
        } else {
          let startDate = new Date()
          let hours = slot.split(' - ')[0].split(':')[0]
          let minutes = slot.split(' - ')[0].split(':')[1]
          startDate.setUTCHours(parseInt(hours))
          startDate.setMinutes(parseInt(minutes))
          let endDate = new Date()
          hours = slot.split(' - ')[1].split(':')[0]
          minutes = slot.split(' - ')[1].split(':')[1]
          endDate.setUTCHours(parseInt(hours))
          endDate.setMinutes(parseInt(minutes))
          if(Math.abs(startDate - date) > Math.abs(endDate - date)){
            if(Math.abs(endDate - date) < distance){
              distance = Math.abs(endDate - date)
              index = i
              position = 'before'
            }
          } else {
            if(Math.abs(startDate - date) < distance){
              distance = Math.abs(startDate - date)
              index = i
              position ='after'
            }
          }
        }
      }
      return {
        index: index, 
        position: position}
    }
  },
  beforeMount(){
    this.startTime()
  },
  computed: {
    activeSlot () {
      return this.getSlot(this.liveTime)
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
    },
    previousBettor() {
      if(this.bets.length < 1){
        return {
          bettor: 'Keine Gebote',
          slot: ' '
        }
      }
      if(this.nearestBettorIndex.index === 0){
        return {
          bettor: 'Kein vorhergehender Bieter',
          slot: ' '
        }
      }
      if((this.nearestBettorIndex.position === 'in' || this.nearestBettorIndex.position === 'after') && this.nearestBettorIndex.index > 0) {
        return this.bets[this.nearestBettorIndex.index - 1]
      } else if (this.nearestBettorIndex.position === 'before') {
        return this.bets[this.nearestBettorIndex.index]
      }
      return null
    },
    currentBettor() {
      let self = this
      if(this.bets.length < 1){
        return {
          bettor: 'Keine Gebote',
          slot: ' '
        }
      }
      let bet = {
        bettor: 'Keine Wette',
        slot: this.activeSlot
      }
      this.bets.forEach(function(element){
        if(element.slot === self.activeSlot){
          bet = element
        }
      })
      return bet
    },
    nextBettor() {
     if(this.bets.length < 1){
        return {
          bettor: 'Keine Gebote',
          slot: ' '
        }
      }
      if(this.nearestBettorIndex.index === this.bets.length - 1){
        return {
          bettor: 'Kein nachfolgender Bieter',
          slot: ' '
        }
      }
      if(this.nearestBettorIndex.position === 'in' || this.nearestBettorIndex.position === 'before') {
        return this.bets[this.nearestBettorIndex.index + 1]
      } else if (this.nearestBettorIndex.position === 'after') {
        return this.bets[this.nearestBettorIndex.index]
      }
      return null
    },
    nearestBettorIndex() {
      return this.getNearestBetIndex(new Date())
    },
    winner () {
      if(this.arrivalTime === undefined) {
        return ''
      }
      let winningBet = {
          bettor: 'Niemand',
          slot: this.getSlot(this.arrivalTime)
        }
      this.bets.forEach(function(element){
        if(element.slot === winningBet.slot){
          winningBet = element
          return
        }
      })
      return winningBet
    }
  }
}
</script>
