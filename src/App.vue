<template>
  <div id="app">
    <v-app>
      <v-app-bar app color="primary" dark>
        <h1><s v-if="appBar().to !== '/'">Wo</s> {{ appBar().title }}</h1>
        <v-spacer></v-spacer>
        <v-btn icon :to="appBar().to">
          <v-icon>{{appBar().icon}}</v-icon>
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
          <span>version {{ version }}</span>
        </v-card-title>
      </v-card>
    </v-footer>
    </v-app>
  </div>
</template>
<script>
import { version } from '../package.json';

export default {
  name: 'App',
  data: function() {
    return {
      icons: [
                { icon: 'fas fa-code', link: 'https://github.com/YannickSpoerl/wannistalex' },
                { icon: 'fab fa-vuejs', link: "https://vuejs.org/"},
                { icon: 'fas fa-user', link: "http://yannickspoerl.me" },
                { icon: 'fab fa-github', link: "https://github.com/YannickSpoerl" },
                { icon: 'fab fa-spotify', link: "https://open.spotify.com/playlist/454IGseDQQiMdW5y8DReBL?si=2O_FC2R4SF60hxiXnp2KoA" }
            ]
    }
  },
  methods: {
    appBar () {
      switch(this.$route.name) {
        case 'admin':
          return {
            icon: 'fas fa-dice',
            to: '/',
            title: 'AdminPanel'
          }
        default:
          return {
            icon: 'fas fa-cog',
            to: 'admin',
            title: 'Wann ist Alex?'
          }
      }
    }
  },
  computed: {
    version () {
      return version
    }
  }
}
</script>