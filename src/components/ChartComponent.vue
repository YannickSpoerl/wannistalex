<template>
    <v-card>
        <v-sparkline
    :value="value"
    :gradient="gradient"
    :smooth="radius || false"
    :padding="padding"
    :line-width="width"
    :stroke-linecap="lineCap"
    :gradient-direction="gradientDirection"
    :fill="fill"
    :type="type"
    auto-draw
  >
    </v-sparkline>
    </v-card>
</template>

<script>
import {db} from '../db'

export default {
  name: 'ChartComponent',
  props: ['slots', 'bets'],
  data() {
      return {
        width: 2,
        radius: 10,
        padding: 8,
        lineCap: 'round',
        gradient: ['#009587'],
        gradientDirection: 'top',
        fill: false,
        type: 'trend',
      }
  },
  computed: {
      value () {
        let self = this
        let values = []
        this.slots.forEach(element => {
            let exists = false
            self.bets.forEach(bet => {
                if(bet.slot === element.slot) {
                    exists = true
                    return
                }
            })
            if(exists) {
                values.push(1)
            } else {
                values.push(0)
            }
        })
        return values
      }
  }
};
</script>
