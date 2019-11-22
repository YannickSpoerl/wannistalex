<template>
    <v-content>
        <v-row no-gutters class="justify-space-around">
            <v-col cols="4">
                <v-row class="justify-center">
                     <p class="display-1">Personen</p>
                </v-row>
                <v-row>
                    <SubjectsComponent/>
                </v-row>
            </v-col>
            <v-col cols="3">
                <v-row class="justify-center">
                     <p class="display-1">Ankünfte</p>
                </v-row>
                <v-row>
                    <v-container>
                    <v-data-table :headers="arrivalsHeaders" :items="arrivals" class="elevation-1" hide-default-footer no-data-text="Keine bisherigen Ankünfte">
                        <template v-slot:item.timeStamp="{ item }">
                            {{getTimeStamp(item.time)}}
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-icon small @click="deleteArrival(item)">fa fa-trash</v-icon>
                        </template>
                    </v-data-table>
                    </v-container>
                </v-row>
            </v-col>
            <v-col cols="3" v-if="configurations.length > 0">
                <v-row class="justify-center">
                     <p class="display-1">Einstellungen</p>
                </v-row>
                <v-row>
                    <v-container>
                        <v-card>
                            <v-container>
                                <v-row class="justify-center">
                                    <v-col>Startzeit: </v-col>
                                    <v-col>
                                        <v-select @input="changedConfiguration = true" :items="generateStartTimes()" v-model="configurations[0].startTime" label="Wähle Startzeit" solo></v-select>
                                    </v-col>
                                </v-row>
                                <v-row class="justify-center">
                                    <v-col>Endzeit: </v-col>
                                    <v-col>
                                        <v-select @input="changedConfiguration = true" :items="generateEndTimes()" v-model="configurations[0].endTime" label="Wähle Endzeit" solo></v-select>
                                    </v-col>
                                </v-row>
                                <v-row class="justify-center">
                                    <v-col>Slotgröße: </v-col>
                                    <v-col>
                                        <v-select @input="changedConfiguration = true" :items="slotSizes" v-model="configurations[0].slotSize" label="Wähle Slotgrößße" solo></v-select>
                                    </v-col>
                                </v-row>
                                <v-row class="justify-center">
                                    <v-btn color="primary" class="mb-2" @click="saveConfiguration()" :disabled="!changedConfiguration || timesValid">
                                        <v-icon>fas fa-save</v-icon>
                                         Speichern
                                    </v-btn>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-container>
                </v-row>
            </v-col>
        </v-row>
    </v-content>
</template>

<script>
import SubjectsComponent from './SubjectsComponent'
import { db } from '@/db'

export default {
    name: 'AdminPanel',
    components: {
        SubjectsComponent
    },
    data: () => ({
       arrivals: [],
       configurations: [],
       changedConfiguration: false,
       arrivalsHeaders: [
            { text: 'Person', value: 'subject', sortable: false },
            { text: 'Ankunft', value: 'timeStamp', sortable: true },
            { text: 'Aktion', value: 'action', sortable: false}],
        slotSizes: [
            '5 min',
            '10 min',
            '15 min',
            '30 min',
            '60 min'
        ],
    }),
    firestore: {
        arrivals: db.collection('arrivals'),
        configurations: db.collection('configuration')
    },
    methods: {
        saveConfiguration(){
            db.collection('configuration').doc(this.configurations[0].id).set(this.configurations[0])
            this.changedConfiguration = false
        },
        deleteArrival(arrival) {
            db.collection('arrivals').doc(arrival.id).delete()
        },
        getTimeStamp(timeStamp){
            let date = new Date(timeStamp.seconds * 1000)
            return date.toLocaleDateString('de-DE', {hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric'})
        },
        generateStartTimes(){
            let timeList = []
            for(let i = 0; i < 23; i++){
                timeList.push(i + ':00 Uhr')
            }
            return timeList
        },
        generateEndTimes(){
            let timeList = []
            for(let i = 1; i < 24; i++){
                timeList.push(i + ':00 Uhr')
            }
            return timeList
        }
    },
    computed: {
        timesValid (){
            let start = this.configurations[0].startTime.split(' ')[0]
            let end = this.configurations[0].endTime.split(' ')[0]
            return (parseInt(end) <= parseInt(start))
        }
    }
}
</script>
