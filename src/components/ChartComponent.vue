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
            case 2:
                return '10:30'
            case 4:
                return '13:00'
            case 6:
                return '15:30'
            case 9:
                return '18:00'
          }
      }
  },
  computed: {
      value () {
        let values = []
        for(let i = 0; i < 10; i++){
            values.push(0)
        }
        this.bets.forEach(bet => {
            let index = parseInt(bet.slot.split(' - ')[0].split(':')[0])
            values[index - 8] += 1
        })
        return values
      }
  }
};
</script>
