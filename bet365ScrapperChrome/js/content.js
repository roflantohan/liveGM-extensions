

//fifa, NBA, Table tennis

const sportSelector = ".ovm-ClassificationHeader_Text"

const leagueContainerSelector = ".ovm-Competition.ovm-Competition-open"

const leagueNameSelector = ".ovm-CompetitionHeader_NameText"

const gameContainerSelectorOne = ".ovm-FixtureDetailsTwoWay_TeamsWrapper" //FIFA, NBA

const gameNameSelectorOne = ".ovm-FixtureDetailsTwoWay_TeamName"//FIFA, NBA

const gameContainerSelectorTwo = ".ovm-FixtureDetailsWithIndicators_TeamsWrapper" //Table Tennis

const gameNameSelectorTwo = ".ovm-FixtureDetailsWithIndicators_Team"//Table Tennis


const FILTERS = [
    {
        sport: "Soccer",
        altSport: "FIFA",
        league: ["Esoccer Battle"] 
    },
    {
        sport: "Basketball",
        altSport: "NBA",
        league: ["Ebasketball Battle"]
    },
    {
        sport: "Table Tennis",
        altSport: "Table Tennis",
        league: ["Setka Cup"]
    }
]

const checkURL = () => {
    const urlDetect1 = "bet365"
    const curURL = window.location.href;

    if(curURL.includes(urlDetect1)) return true;
    else return false;
}


const parseData = () => {
    const games = []

    const sportDiv = document.querySelector(sportSelector);
    let sportName = ""
    if(sportDiv){
        sportName = sportDiv.innerText;
    }else{
        return games;
    }

    let gameContainerSelector, gameNameSelector;

    if(sportName.includes("Soccer") || sportName.includes("Basketball")){
        gameContainerSelector = gameContainerSelectorOne;
        gameNameSelector = gameNameSelectorOne;
    }

    if(sportName.includes("Table Tennis")){
        gameContainerSelector = gameContainerSelectorTwo;
        gameNameSelector = gameNameSelectorTwo;
    }

    const leagueDivs = document.querySelectorAll(leagueContainerSelector)
    if(leagueDivs.length){
        for(let lDiv of leagueDivs){
            const leagueNameDiv = lDiv.querySelector(leagueNameSelector)
            let leagueName = ""
            if(leagueNameDiv) leagueName = leagueNameDiv.innerText;
            
            const gameDivs = lDiv.querySelectorAll(gameContainerSelector) //FIFA, NBA

            if(gameDivs.length){
                for(let gDiv of gameDivs){
                    const gameNameDiv = gDiv.querySelectorAll(gameNameSelector)//FIFA, NBA
                    let playerOne = ""
                    let playerTwo = ""
                    if(gameNameDiv.length){
                        playerOne = gameNameDiv[0].innerText;
                        playerTwo = gameNameDiv[1].innerText;
                    }

                    games.push({
                        sport: sportName,
                        league: leagueName,
                        playerOne,
                        playerTwo,
                    })
                }
            }

        }
    }
    
    return games
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
                            nameBookmaker: "Bet365",
                            mode: "live",
                            dateDetect: new Date(),
                            playerOne: game.playerOne,
                            playerTwo: game.playerTwo,
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

    const games = parseData()

    if(!games.length) sendMessage("Error", "Not found games. Please check browser")

    const data = filterGames(games)

    const timeEnd = new Date();

    sendMessage("parsedData", data)

    const interval = 1*60*1000
    
    let timer = interval - (timeEnd - timeStart)

    timer = timer < 0 ? 100 : timer;

    return setTimeout(scrapper, timer)
}


setTimeout(scrapper, 30000)

