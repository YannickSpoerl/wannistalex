<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1><s>Wo</s> Wann ist Alex?</h1>
      <v-spacer></v-spacer>
    </v-app-bar>
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
    <v-footer dark padless height="auto">
      <v-card class="flex primary" flat tile>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn v-for="icon in icons" :key="icon.link" class="mx-3" dark icon v-bind:href="icon.link" target="_blank">
            <v-icon size="24px">{{ icon.icon }}</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import BetComponent from './components/BetComponent'
import TableComponent from './components/TableComponent'
import {db} from './db'

export default {
  name: 'App',

  components: {
    TableComponent,
    BetComponent
  },

  data: () => ({
    icons: [
                { icon: 'fab fa-vuejs', link: "https://vuejs.org/"},
                { icon: 'fas fa-user', link: "http://yannickspoerl.me" },
                { icon: 'fab fa-github', link: "https://github.com/YannickSpoerl" },
                { icon: 'fab fa-spotify', link: "https://open.spotify.com/playlist/454IGseDQQiMdW5y8DReBL?si=2O_FC2R4SF60hxiXnp2KoA" }
            ],
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
