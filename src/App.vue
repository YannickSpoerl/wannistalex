<template>
  <div id="app">
    <v-app>
      <v-app-bar app color="primary" dark>
      <h1><s>Wo</s> Wann ist Alex?</h1>
      <v-spacer></v-spacer>
      <v-btn icon :to="appBarButton().to">
        <v-icon>{{appBarButton().icon}}</v-icon>
      </v-btn>
    </v-app-bar>
      <router-view/>
      <v-footer dark padless height="auto">
      <v-card class="flex primary" flat tile>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn v-for="icon in icons" :key="icon.link" class="mx-3" dark icon v-bind:href="icon.link" target="_blank">
            <v-icon size="24px">{{ icon.icon }}</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
    </v-footer>
    </v-app>
  </div>
</template>
<script>
export default {
  name: 'App',
  data: function() {
    return {
      icons: [
                { icon: 'fab fa-vuejs', link: "https://vuejs.org/"},
                { icon: 'fas fa-user', link: "http://yannickspoerl.me" },
                { icon: 'fab fa-github', link: "https://github.com/YannickSpoerl" },
                { icon: 'fab fa-spotify', link: "https://open.spotify.com/playlist/454IGseDQQiMdW5y8DReBL?si=2O_FC2R4SF60hxiXnp2KoA" }
            ]
    }
  },
  methods: {
    appBarButton () {
      switch(this.$route.name) {
        case 'admin':
          return {
            icon: 'fas fa-dice',
            to: '/'
          }
        default:
          return {
            icon: 'fas fa-user-cog',
            to: 'admin'
          }
      }
    }
  }
}
</script>