<template>
    <v-row>
        <v-col cols="6">
        </v-col>
        <v-col cols="6">
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
        </v-col>
    </v-row>
</template>
<script>
export default {
    name: 'OverviewComponent',
    props: [],
    data() { 
        return { 

        }
    }
}
</script>
<style>
</style>