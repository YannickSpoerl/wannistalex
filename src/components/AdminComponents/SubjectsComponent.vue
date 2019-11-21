<template>
    <v-container>
        <v-data-table :headers="subjectsHeaders" :items="subjects" class="elevation-1" hide-default-footer no-data-text="Keine Personen hinzugefügt">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-dialog v-model="editDialogOpen" max-width="600px">
                        <template v-slot:activator="{ on }">
                            <v-spacer></v-spacer>
                            <v-btn color="primary" dark class="mb-2" v-on="on">
                            <v-icon>fas fa-user-plus</v-icon>
                            Neue Person
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
                                    <v-col cols="2">Name: </v-col>
                                    <v-col><v-text-field v-model="editedSubject.subject"></v-text-field></v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="2">Einsatz: </v-col>
                                    <v-col><v-slider
                                        v-model="editedSubject.jackpot"
                                        :max="10"
                                        :min="1"
                                        step="1"
                                        ticks="always"
                                        thumb-label="always"
                                        tick-size="1"
                                    ></v-slider></v-col>
                                </v-row>
                            </v-container>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" :disabled="editedSubject.subject.replace(/\s/g, '') === ''" @click="saveSubject(editedSubject)">Speichern</v-btn>
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
                    @click="editSubject(item)"
                >
                    fas fa-pencil-alt
                </v-icon>
                <v-icon
                    small
                    @click="deleteSubject(item)"
                >
                    fa fa-trash
                </v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>
<script>
import { db } from '@/db'

export default {
     name: 'SubjectsComponent',
    data: () => ({
        editDialogOpen: false,
        subjects: [],
        subjectsHeaders: [
            { text: 'Erwartete Person', value: 'subject', sortable: false },
            { text: 'Einsatzhöhe in €', value: 'jackpot', sortable: true },
            { text: 'Aktion', value: 'action', sortable: false}],
        editedSubject: undefined
    }),
    firestore: {
        subjects: db.collection('subjects')
    },
    beforeMount(){
        this.resetEditedSubject()
    },
    methods: {
        resetEditedSubject(){
            this.editedSubject = {
                subject: '',
                jackpot: 3,
                id: ''
            }
        },
        editSubject (subject) {
            this.editedSubject = Object.assign({}, subject)
            this.editDialogOpen = true
        },
        saveSubject (subject){
            if(subject.id !== '') {
                db.collection('subjects').doc(subject.id).set(subject)
            } else {
                db.collection('subjects').add(subject)
            }
            this.closeDialog()
        },
        closeDialog () {
            this.resetEditedSubject()
            this.editDialogOpen = false
        },
        deleteSubject (subject) {
            db.collection('subjects').doc(subject.id).delete()
        }
    },
    computed: {
        dialogTitle () {
            if(this.editedSubject.subject !== ''){
                return this.editedSubject.subject + ' bearbeiten'
            }
            return 'Neue Person hinzufügen'
        }
    }
}
</script>