

const BOOKMAKER = "Betvictor";
const MODE = "live";
const FILTERS = [
  {
    altSport: "Table Tennis",
    sport: 'Table Tennis',
    league: ['Setka Cup', 'Ukraine Ping Pong Point']
  },
  {
    altSport: "FIFA",
    sport: "Football",
    league: ["Esports - Battle", "ESportsBattle","eSports Battle", "Esports Battle", "eSportsBattle","Champions VOLTA League"],
  },
  {
    altSport: "NBA",
    sport: "Basketball",
    league: ["eSportsBattle e-Basketball"],
  }
]
//https://www.betvictor.com/bv_in_play/v2/en-gb/1/in_play/650
//https://www.betvictor.com/bv_in_play/v2/en-gb/1/in_play/100
//https://www.betvictor.com/bv_in_play/v2/en-gb/1/in_play/601600

const checkURL = () => {
    const urlDetect1 = "betvictor.com/bv_in_play"
    const curURL = window.location.href;

    if(curURL.includes(urlDetect1)) return true;
    else return false;
}


const parseData = () => {
    let data = {}
    try{
        const pre = document.getElementsByTagName('pre')[0]
        data = JSON.parse(pre.innerHTML)
    }catch(err){
        console.log(err)
    }
    const games = [];
    const sports = data.sports;
    if(Array.isArray(sports)){
      sports.forEach(sport => {
          const sportName = sport.desc
          const comp = sport.comp;
          if(Array.isArray(comp)){
            comp.forEach(tour => {
              const tournament = tour.desc;
              const events = tour.events;
              if(Array.isArray(events)){
                events.forEach(event => {
                  const player1 = event.oppADesc;
                  const player2 = event.oppBDesc;
                  games.push({
                    sport: sportName,
                    league: tournament,
                    player1, 
                    player2,
                  })
                })
              }
            })
          }
      })
    }
    return games;
  }


const filterGames = (games) => {
    const profile = [];

    for(let game of games){
        for(let filter of FILTERS){
            if(game.sport === filter.sport){
                for(let league of filter.league){
                    if(game.league.includes(league)){
                        profile.push({
                            nameSport: filter.altSport,
                            nameBookmaker: BOOKMAKER,
                            mode: "live",
                            dateDetect: new Date(),
                            playerOne: game.player1,
                            playerTwo: game.player2,
                            tournament: game.league,
                        })
                    }
                }
            }
        }
    }

    return profile;
}

const sendMessage = (type, data) => chrome.runtime.sendMessage({type, data})

const scrapper = () => {
    if(!checkURL) return;
    
    
    const timeStart = new Date();
    let timer;
    
    const games = parseData()

    if(!games.length) sendMessage("Error", "Betvictor: Not found games. Please check browser")
    const data = filterGames(games)
    const timeEnd = new Date();
    sendMessage("parsedData", data)

    const interval = 1*60*1000
    
    timer = interval - (timeEnd - timeStart)

    timer = timer < 0 ? 100 : timer;

    return setTimeout(async() => {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                location.reload()
                resolve()
            }, 100)
        })

        scrapper()
    }, timer)
}


setTimeout(scrapper, 30000)

