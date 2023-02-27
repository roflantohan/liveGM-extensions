/*const ID_SPORT = {
    "FIFA": 1,
    "Table Tennis": 2,
    "NBA": 8,
    "FIFA Bot": 6
}
const NAME_BOOKMAKER = {
    'Bet365': 1,
    'Bet365 (prematch)': 2,
    'Betvictor': 14,
    'Fortuna': 6,
    'Hattrick': 7, 
    'Olimp': 15, 
    'Parimatch': 3, 
    'Tipsport': 19, 
    'Trillion': 16,
    'Williamhill': 17,
}*/

const ID_SPORT = {
    "FIFA": 1,
    "Table Tennis": 2,
    "NBA": 3,
    "FIFA Bot": 8,
    "NHL": 4
}
const NAME_BOOKMAKER = {
    'Bet365': 1,
    'Bet365 (prematch)': 2,
    'Betvictor': 11,
    'Fortuna': 5,
    'Hattrick': 6, 
    'Olimp': 9, 
    'Parimatch': 3, 
    'Tipsport': 4, 
    'Trillion': 10,
    'Williamhill': 7,
}

const INTERVALS_TO_TIME = {
    morning: {
      start: "06:00:00",
      end: "12:00:00",
    },
    lunch: {
      start: "12:00:00",
      end: "16:00:00",
    },
    evening: {
      start: "16:00:00",
      end: "20:00:00",
    },
    night: {
      start: "20:00:00",
      end: "09:59:00",
    }
}


const URL_SETKA_CUP = "https://manager.setka-cup.com/bookie-match-report/view";
const URL_ESB = "https://manager.esports-battle.com/bookie-match-report/default/view";
const URL_POST_DOWNLOAD = "http://181.215.69.105:4000/schedule/add"
const URL_POST_UPLOAD = "http://181.215.69.105:4000/report/get"
