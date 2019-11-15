<template>
  <v-container>
    <v-data-table :headers="headers" :items="bets" class="elevation-1" hide-default-footer no-data-text="Keine Wetten abgegeben">
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
        :disabled="alreadyArrived"
      >
        fas fa-pencil-alt
      </v-icon>
      <v-icon
        small
        @click="deleteSlot(item)"
        :disabled="alreadyArrived"
      >
        fa fa-trash
      </v-icon>
    </template>
    </v-data-table>
    <v-divider style="padding:1em"></v-divider>
    <v-row >
      <v-col cols="6">
        <v-row class="justify-center">
          <p class="headline pa-2">€ Pot: <strong>{{pot}}</strong></p>
        </v-row>
        <v-row class="justify-center">
          <v-data-table :headers="overvieHeaders" :items="overview" class="elevation-1" hide-default-footer no-data-text="Keine Wetten abgegeben"></v-data-table>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row class="justify-center">
          <p class="headline pa-2"># Wetten: <strong>{{bets.length}}</strong></p>
        </v-row>
        <v-row class="justify-center">
          <ChartComponent style="margin-right:0.8em" :bets="bets" :slots="generateSlots()"></ChartComponent>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {db} from '../db'
import ChartComponent from './ChartComponent'

export default {
  name: 'TableComponent',
  props: ['bets', 'alreadyArrived'],
   components: { ChartComponent },
  data() {
      return {
          headers: [
            { text: 'Zeitslot', align: 'left', value: 'slot', sortable: false },
            { text: 'Wettender', value: 'bettor', sortable: false },
            { text: 'Aktion', value: 'action', sortable: false }],
          overvieHeaders: [
            { text: 'Wettender', value: 'bettor', sortable: false },
            { text: 'Slots', value: 'numberOfSlots', sortable: true },
            { text: 'Gesamteinsatz in €', value: 'totalAmount', sortable: true }],
          editDialogOpen: false,
          editedSlot: undefined
      }
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
    checkSlotExistence(slot) {
      let self = this
      let slotExists = false
        this.bets.forEach(function(bet){
          if(bet.slot === slot.slot && bet.id !== self.editedSlot.id){
            slotExists = true
          }
        })
      return slotExists
    },
    generateSlots () {
      let slots = []
      for (let i = 8; i < 18; i++) {
        slots.push({
            slot: i + ':00 - ' + i + ':15',
            bettor: '',
            amount: '',
            subject: "Alex",
            id: ''
          })
        slots.push({
          slot: i + ':15 - ' + i + ':30',
          bettor: "",
          amount: "",
          subject: "Alex",
          id: ''
        })
        slots.push({
          slot: i + ':30 - ' + i + ':45',
          bettor: "",
          amount: "",
          subject: 'Alex',
          id: ''
        })
        slots.push({
          slot: i + ':45 - ' + (i + 1) + ':00',
          bettor: "",
          amount: "",
          subject: "Alex",
          id: ''
        })
      }
      return slots
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
    },
    overview () {
      let names = new Map()
      this.bets.forEach(function(bet){
        if(!names.has(bet.bettor)){
          names.set(bet.bettor,{
            numberOfSlots: 0,
            totalAmount: 0
          })
        }
        names.get(bet.bettor).numberOfSlots +=1
        names.get(bet.bettor).totalAmount += 1
      })
      let array = []
      names.forEach(function(value, key){
        array.push({
          bettor: key,
          numberOfSlots: value.numberOfSlots,
          totalAmount: value.totalAmount
        })
      })
      return array
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
