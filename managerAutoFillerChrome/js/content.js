//исполнение сразу при загрузке страницы или по манифесту

const URL_SETKA_CUP = "https://manager.setka-cup.com/bookie-match-report/view";
const URL_ESB = "https://manager.esports-battle.com/bookie-match-report/default/view";
const URL_POST_UPLOAD = "http://181.215.69.105:4000/report/get"

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
const ID_SPORT = {
    "FIFA": 1,
    "Table Tennis": 2,
    "NBA": 3,
    "FIFA Bot": 8,
    "NHL": 4
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


const checkURL = (urlDetect) => {
    const curURL = window.location.href;
    if(curURL.includes(urlDetect)) return true;
    else return false;
}


const getParam = () => {
    const gameDate = document.getElementById("gaming_day").value
    return { gameDate }
}

const fillManagerESB = async(report, NAME_BOOKMAKER) => {
    const table = document.getElementsByClassName("table table-striped table-bordered table-condensed")[0];

    const thead = table.getElementsByTagName("thead")[0];
    const headRow = thead.getElementsByTagName("tr")[0];

    const headBookies = headRow.getElementsByClassName("column-bookie_company")
    const bookies = []

    for(let col of headBookies) bookies.push(col.innerText)
    

    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");

    for(let row of rows) {
        const status = row.getElementsByClassName("column-status")[0].innerText;
        const league = row.getElementsByClassName("column-league")[0].innerText

        if(status.includes("Не состоялся")) continue;
        if(status.includes("Запланирован")) continue;

        const timeManager = row.getElementsByClassName("column-time")[0].innerText;
        const dateManager = row.getElementsByClassName("column-date")[0].innerText;

        const datePlanned = new Date(`${dateManager}T${timeManager}:00`).toISOString()
        const gameTR = row.getElementsByClassName("column-match")[0].innerText;
        for(let match in report){
            const record = report[match]
            const gameName = `${record.player_one} - ${record.player_two}`
            const recDatePlanned = record.date_planned
            if(gameTR === gameName && recDatePlanned === datePlanned){
                const bookmaker = bookies.map(bm => {
                    const id = NAME_BOOKMAKER[bm];
                    if(league.includes("Вольта")){
                        const arr = [3, 11, 5, 6, 9, 4]
                        if(!arr.includes(id)) return null;
                    }


                    if(!id) return null;
                    if(!record.bookmakers[id]) return null;
                    const status = record.bookmakers[id].status;
                    if(!status) return false;
                    return status
                })

                const bmCell = row.getElementsByClassName("clickable column-bookie_company")
                for(let i = 0; i < bmCell.length; i++){
                    if(bookmaker[i] === null) continue;
                    const spanOk = bmCell[i].getElementsByClassName("glyphicon glyphicon-ok flag-ok")[0];
                    const spanCancel = bmCell[i].getElementsByClassName("glyphicon glyphicon-remove flag-remove")[0];
                    if(spanCancel && bookmaker[i]){
                        bmCell[i].click();
                        bmCell[i].click();
                        await new Promise((res, rej) => setTimeout(() => res(), 2000))
                    }
                    if(!spanOk && !spanCancel){
                        if(bookmaker[i] === true) bmCell[i].click();
                        if(bookmaker[i] === false){
                            bmCell[i].click();
                            bmCell[i].click();
                        }
                        await new Promise((res, rej) => setTimeout(() => res(), 2000))
                    }
                }
            }
        }
    }
}

const fillManagerSC = async(report, NAME_BOOKMAKER) => {

    const table = document.getElementsByClassName("table table-striped table-bordered table-condensed")[0];

    const thead = table.getElementsByTagName("thead")[0];
    const headRow = thead.getElementsByTagName("tr")[0];

    const headBookies = headRow.getElementsByClassName("column-bookie_company")
    const bookies = []

    for(let col of headBookies) bookies.push(col.innerText)
    

    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");

    for(let row of rows) {
        const status = row.getElementsByClassName("column-status")[0].getAttribute("title");

        if(status === "Новый") continue;
        if(status === "Удален") continue;

        const timeManager = row.getElementsByClassName("column-time")[0].innerText;
        const dateManager = row.getElementsByClassName("column-date")[0].innerText;

        const datePlanned = new Date(`${dateManager}T${timeManager}:00`).toISOString()
        const gameTR = row.getElementsByClassName("column-match")[0].innerText;
        for(let match in report){
            const record = report[match]
            if(record.status === null) continue;
            const gameName = `${record.player_one} - ${record.player_two}`
            const recDatePlanned = record.date_planned
            if(gameTR === gameName && recDatePlanned === datePlanned){
                const bookmaker = bookies.map(bm => {
                    const id = NAME_BOOKMAKER[bm];
                    if(!id) return null;
                    const status = record.bookmakers[id].status;
                    if(!status) return false;
                    return status
                })
                const bmCell = row.getElementsByClassName("clickable column-bookie_company")
                for(let i = 0; i < bmCell.length; i++){
                    if(bookmaker[i] === null) continue;
                    const spanOk = bmCell[i].getElementsByClassName("glyphicon glyphicon-ok flag-ok")[0];
                    const spanCancel = bmCell[i].getElementsByClassName("glyphicon glyphicon-remove flag-remove")[0];
                    if(spanCancel && bookmaker[i]){
                        bmCell[i].click();
                        bmCell[i].click();
                        await new Promise((res, rej) => setTimeout(() => res(), 2000))
                    }
                    if(!spanOk && !spanCancel){
                        if(bookmaker[i] === true) bmCell[i].click();
                        if(bookmaker[i] === false){
                            bmCell[i].click();
                            bmCell[i].click();
                        }
                        await new Promise((res, rej) => setTimeout(() => res(), 2000))
                    }
                    
                }
                break;
            }
        }
    }
}

const getLocalStorage = async(key) => {
    const data = await chrome.storage.sync.get([key]);
    return data[key]
}

const sendMessage = (type, data) => chrome.runtime.sendMessage({type, data})

const fillReport = async() => {
    if(!checkURL(URL_ESB) && !checkURL(URL_SETKA_CUP)) return;

    const { gameDate } = getParam()

    let fillHandler = () => {};
    let idSports = []

    if(checkURL(URL_SETKA_CUP)) {
        fillHandler = fillManagerSC
        idSports = ["Table Tennis"].map(sport => ID_SPORT[sport])
    }
    if(checkURL(URL_ESB)) {
        fillHandler = fillManagerESB
        idSports = ["FIFA", "NBA", "FIFA Bot", "NHL"].map(sport => ID_SPORT[sport])
    }

    let raw = {}
    for(let i = 0; i < idSports.length; i++){
        const {data} = await sendMessage("getData", {url: URL_POST_UPLOAD, idSport: idSports[i], gameDate})
        Object.assign(raw, data)
    }

    let report = raw

    return fillHandler(report, NAME_BOOKMAKER)
}

const autoFill = async() => {
    if(!checkURL(URL_ESB) && !checkURL(URL_SETKA_CUP)) return;
    const answer = confirm("Start auto filling schedule ?")
    if(!answer) return
    await fillReport()
    setInterval(fillReport, 60000*5)
}

autoFill()


