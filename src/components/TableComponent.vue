<template>
  <v-container>
    {{bets[0]}}
    <v-data-table :headers="headers" :items="sortSlots(bets)" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-dialog v-model="editDialogOpen" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" v-on="on">
              <v-icon>fas fa-dice</v-icon>
               Neue Wette
              </v-btn>
            <v-spacer></v-spacer>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{dialogTitle}}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                     <v-select v-model="editedSlot.slot" :items="slotList" item-text="slot" label="Zeitslot">
                     </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedSlot.bettor" label="Wettender"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedSlot.amount" label="Einsatz in €"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!betValid(editedSlot)" color="primary" @click="saveSlot(editedSlot)">Speichern</v-btn>
              <v-btn  @click="closeDialog">Abbrechen</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editSlot(item)"
      >
        fas fa-pencil-alt
      </v-icon>
      <v-icon
        small
        @click="deleteSlot(item)"
      >
        fa fa-trash
      </v-icon>
    </template>
  </v-data-table>
  </v-container>
</template>

<script>
import {db} from '../db'

export default {
  name: 'TableComponent',
  data() {
      return {
          bets: [],
          headers: [
            { text: 'Zeitslot', align: 'left', value: 'slot', sortable: false },
            { text: 'Wettender', value: 'bettor', sortable: false },
            { text: 'Einsatz in €', value: 'amount', sortable: false },
            { text: 'Aktion', value: 'action', sortable: false }],
          editDialogOpen: false,
          editedSlot: undefined
      }
  },
  firestore: {
    bets: db.collection('bets')
  },
  beforeMount () {
    this.resetEditedSlot()
  },
  methods: {
    editSlot (slot) {
      this.editedSlot = Object.assign({}, slot)
      this.editDialogOpen = true
    },
    saveSlot (slot){
      if(slot.id !== '') {
        db.collection('bets').doc(slot.id).set(slot)
      } else {
        db.collection('bets').add(slot)
      }
      this.closeDialog()
    },
    closeDialog () {
      this.editDialogOpen = false
      this.resetEditedSlot()
    },
    deleteSlot (slot) {
      db.collection('bets').doc(slot.id).delete()
    },
    resetEditedSlot () {
      this.editedSlot = {
            slot: "",
            bettor: "",
            amount: "",
            subject: "Alex",
            id: ''
          }
    },
    betValid (bet) {
      if(!bet){
        return false
      }
      if(bet.slot === undefined || bet.slot === null || bet.slot.replace(/\s/g, '') === '') {
        return false
      }
      if(bet.bettor === undefined || bet.bettor === null || bet.bettor.replace(/\s/g, '') === ''){
        return false
      }
      if(isNaN(bet.amount) || bet.amount === '' || bet.amount <= 0.5){
        return false
      }
      this.slotList.forEach(function(slot){
        if(slot.slot === bet.slot) {
          return !(slot.id === bet.id)
        }
      })
      return true
    },
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
    },
    checkSlotExistence(slot) {
      let slotExists = false
        this.bets.forEach(function(bet){
          if(bet.slot === slot.slot && bet.id !== slot.id){
            slotExists = true
          }
        })
      return slotExists
    }
  },
  computed: {
    dialogTitle () {
      if (this.editedSlot.slot === "") {
        return 'Neue Wette anlegen'
      }
      return this.editedSlot.slot + ' bearbeiten'
    },
    slotList () {
      if(!this.bets){
        return []
      }
      let slots = []
      for (let i = 8; i < 18; i++) {
        let hourSlots = [] 
        hourSlots.push({
            slot: i + ':00 - ' + i + ':15',
            bettor: '',
            amount: '',
            subject: "Alex",
            id: ''
          })
        hourSlots.push({
          slot: i + ':15 - ' + i + ':30',
          bettor: "",
          amount: "",
          subject: "Alex",
          id: ''
        })
        hourSlots.push({
          slot: i + ':30 - ' + i + ':45',
          bettor: "",
          amount: "",
          subject: 'Alex',
          id: ''
        })
        hourSlots.push({
          slot: i + ':45 - ' + (i + 1) + ':00',
          bettor: "",
          amount: "",
          subject: "Alex",
          id: ''
        })
        let self = this
        hourSlots.forEach(function(slot){
          if(!self.checkSlotExistence(slot)){
            slots.push(slot)
          }
        })
      }
      return slots
    }
  }
};
</script>
