'use strict'

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

btnUpload.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = await tab.url
    
    chrome.scripting.executeScript({
        // скрипт будет выполняться во вкладке, которую нашли на пр2едыдущем этапе
      target: { tabId: tab.id},
      // вызываем функцию, в которой лежит запуск снежинок
      function: getParam,
    }, async(data) => {
        const {gameDate} = data[0].result;
        divLog.innerHTML = `<p>Игровой день: ${gameDate}</p>`
        const sports = getCheckedSport();
        const idSports = sports.map(sport => ID_SPORT[sport])
        let report = {}
        for(let i = 0; i < idSports.length; i++){
            const {error, data} = await requestPost(URL_POST_UPLOAD, {idSport: idSports[i], gameDate})
            Object.assign(report, data)
        }

        divLog.innerHTML += `<p>Получено ${Object.keys(report).length} записей</p>`

        let fillHandler = () => {};

        if(url.includes(URL_SETKA_CUP)) fillHandler = fillManagerSC
        if(url.includes(URL_ESB)) fillHandler = fillManagerESB

        chrome.scripting.executeScript({
            // скрипт будет выполняться во вкладке, которую нашли на пр2едыдущем этапе
          target: { tabId: tab.id},
          // вызываем функцию, в которой лежит запуск снежинок
          function: fillHandler,
          args: [report, NAME_BOOKMAKER],
        }, () => {
            divLog.innerHTML += `<p>Отчет заполнен</p>`
        })
    });
  });
  