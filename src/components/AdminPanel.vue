<template>
    <v-content>
        <v-row no-gutters>
            <v-col cols="4">
                <SubjectsComponent></SubjectsComponent>
            </v-col>
            <v-col cols="4">
            </v-col>
        </v-row>
    </v-content>
</template>

<script>
import SubjectsComponent from './AdminComponents/SubjectsComponent'

export default {
    name: 'AdminPanel',
    components: {
        SubjectsComponent
    },
    data: () => ({
       
    })
}
</script>
