# Wann ist Alex?

Bet on the time your coworkers will show up to work!
Showcase: https://wannistalex.yannickspoerl.de

## Getting Started

Clone Repository

```
git clone https://github.com/YannickSpoerl/wannistalex
```

### Prerequisites

- You need Vue-CLI to work on this project.

```
npm install -g @vue/cli
```

- Create firebase-app and insert configuration into `db.js`

- Create *collection* `bets` in firebase and insert sample *document*
```
{   amount: "3"
    bettor: "Person A"
    id: ""
    slot: "17:45 - 18:00"
    subject: "Person B"  }
```

- Create *collection* `arrivals` in firebase and insert sample *document* 
```
{   subject: "Person B"
    time: 21. November 2019 um 17:38:49 UTC+1   }
```

- Create *collection* `subjects` in firebase and insert sample *document* 
```
{   id: ""
    jackpot: 3
    subject: "Person B"  }
```

- Create *collection* `configuration` in firebase and insert sample *document* 
```
{   endTime: "11:00 Uhr"
    id ""
    slotSize: "30 min"
    startTime: "18:00 Uhr"  }
``` 

### Installing

Install node-dependencies.

```
npm install
```

## Development

Live preview with hot-reload

```
npm run serve
```

## Deployment

Following: https://cli.vuejs.org/guide/deployment.html#platform-guides

1. Modify `vue.config.js` according to your needs
2. Modify `deploy.sh` according to your needs
3. Run ```npm run build```
4. Run ```./deploy.sh```
## Built With

* [Vue](https://vuejs.org/) - JavaScript Framework
* [Vuetify](https://vuetifyjs.com) - Material Design Component Framework
* [Firebase](https://firebase.google.com/) - Realtime Database

## Versioning

- 1.0 - 17.11.19 - Finish implementation of main-screen
- 0.1 - 13.11.19 - Initial working prototype

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
