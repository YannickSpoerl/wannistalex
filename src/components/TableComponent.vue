<template>
  <v-container>
    <ul>
        <li v-for="bet in bets" :key="bet.id">{{bet}}</li>
    </ul>
  </v-container>
</template>

<script>
import {db} from '../db'

export default {
  name: 'TableComponent',
  data() {
      return {
          bets: []
      }
  },
  firestore: {
    bets: db.collection('bets')
  }
};
</script>
