<template>
  <v-content>
    <v-row no-gutters>
      <v-col cols="6">
        <TableComponent :bets="sortSlots(bets)" :alreadyArrived="alreadyArrived" :pot="pot"></TableComponent>
      </v-col>
      <v-col cols="6">
        <BetComponent :bets="sortSlots(bets)" :alreadyArrived="alreadyArrived" :pot="pot"></BetComponent>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import BetComponent from './BetComponent'
import TableComponent from './TableComponent'
import {db} from '../db'

export default {
  name: 'Home',

  components: {
    TableComponent,
    BetComponent
  },

  data: () => ({
    bets: [],
    arrivals: []
  }),
  firestore: {
    bets: db.collection('bets'),
    arrivals: db.collection('arrivals')
  },
  methods: {
    sortSlots (unsortedBets) {
      let sortedBets = unsortedBets.slice()
      return sortedBets.sort(function (slot1, slot2) {
        let slotTime1 = slot1.slot.split(' - ')[0]
        let slotTime2 = slot2.slot.split(' - ')[0]
        if(slotTime1.split(':')[0] !== slotTime2.split(':')[0]) {
          return slotTime1.split(':')[0] - slotTime2.split(':')[0]
        }
        else if (slotTime1.split(':')[1] !== slotTime2.split(':')[1]) {
          return slotTime1.split(':')[1] - slotTime2.split(':')[1]
        }
      })
    }
  },
  computed: {
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
    pot () {
      let pot = 0
      this.bets.forEach(function(bet){
        pot += parseInt(bet.amount)
      })
      return pot
    }
  }
};
</script>
