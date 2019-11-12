<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1><s>Wo</s> Wann ist Alex?</h1>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <div>
        <TableComponent style="left:0; width=50%"/>
              <BetComponent style="right:0; width=50%; color:red"/>

      </div>
    </v-content>
    <v-footer dark padless height="auto">
            <v-card class="flex primary" flat tile>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn v-for="icon in icons" :key="icon.link" class="mx-3" dark icon v-bind:href="icon.link"
                        target="_blank">
                        <v-icon size="24px">{{ icon.icon }}</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-title>
            </v-card>
        </v-footer>
  </v-app>
</template>

<script>
import BetComponent from './components/BetComponent'
import TableComponent from './components/TableComponent'

export default {
  name: 'App',

  components: {
    TableComponent,
    BetComponent
  },

  data: () => ({
    icons: [
                { icon: 'fab fa-vuejs', link: "https://vuejs.org/"},
                { icon: 'fas fa-user', link: "http://yannickspoerl.me" },
                { icon: 'fab fa-github', link: "https://github.com/YannickSpoerl" },
                { icon: 'fab fa-spotify', link: "https://open.spotify.com/playlist/454IGseDQQiMdW5y8DReBL?si=2O_FC2R4SF60hxiXnp2KoA" }
            ]
  }),
};
</script>
