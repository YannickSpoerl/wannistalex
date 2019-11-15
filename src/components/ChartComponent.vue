<template>
    <v-card>
        <v-sparkline
    :value="value"
    :gradient="gradient"
    :smooth="radius || false"
    :padding="padding"
    :line-width="width"
    :stroke-linecap="lineCap"
    :fill="fill">
      <template v-slot:label="item">
            {{ getLabel(item.index) }}
        </template>
    </v-sparkline>
    </v-card>
</template>

<script>
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
        fill: false,
      }
  },
  methods: {
      getLabel(index){
          switch(index){
            case 0:
                return '8:00'
            case 9:
                return '10:30'
            case 19:
                return '13:00'
            case 28:
                return '15:30'
            case 38:
                return '18:00'
          }
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
