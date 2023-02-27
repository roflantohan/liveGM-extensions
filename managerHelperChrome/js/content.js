//исполнение сразу при загрузке страницы или по манифесту

const URL_SETKA_CUP = "https://manager.setka-cup.com/bookie-match-report/view";
const URL_ESB = "https://manager.esports-battle.com/bookie-match-report/default/view";

const handlerAlertComponent = (msg) => {
  const alert = document.getElementById("ext_alert_livegm")

  alert.innerText = msg

  alert.style.display = "initial"
  alert.style.position = "absolute"
  alert.style.zIndex = 99999

  alert.style.top = "10px"
  alert.style.left = "50%"
  alert.style.border = "1px solid #17202A "
  alert.style.backgroundColor = "#34495E"
  alert.style.color = "#FDFEFE"
  alert.style.padding = "3px"

  setTimeout(() => {
    alert.style.display = "none"
    alert.removeEventListener("click", handler)
  }, 3000)

  const handler = event => {
    alert.style.display = "none"
    alert.removeEventListener("click", handler)
  }

  alert.addEventListener("click", handler)
}

const createAlertComponent = () => {
  const body = document.body
  const alert = document.createElement("div");
  alert.setAttribute("id", "ext_alert_livegm");
  body.appendChild(alert)
  return 
}

const getScheduleMngSC = () => {
    const table = document.getElementsByClassName("table table-striped table-bordered table-condensed")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");
    const schedule = [] 
    
    Array.from(rows).forEach(element => {
      
      const statusText = element.getElementsByClassName("column-status")[0].getAttribute("title");
      if(statusText.includes("Удален")) return;
  
      const time = element.getElementsByClassName("column-time")[0].innerText;
      const date = element.getElementsByClassName("column-date")[0].innerText;
      const game = element.getElementsByClassName("column-match")[0].innerText;
      const playerOne = game.split(" - ")[0];
      const playerTwo = game.split(" - ")[1];
  
      let status = null
      if(statusText.includes("Завершен")) status = false
      if(statusText.includes("Активный")) status = true
  
      const location = element.getElementsByClassName("column-location")[0].innerText;
      const division = element.getElementsByClassName("column-division")[0].innerText;
  
      const datePlanned = new Date(`${date}T${time}:00`);
      const dateEnd = new Date(datePlanned.getTime() + 1000 * 60 * 30)
  
      schedule.push({
        playerOne, 
        playerTwo, 
        datePlanned: datePlanned.toISOString(),
        dateStart: datePlanned.toISOString(),
        dateEnd: dateEnd.toISOString(),
        status, 
        tournament: `${location}_${division}`
      })
    });
  
    const gameDate = document.getElementById("gaming_day").value
  
    return [
      {
        sport: "Table Tennis",
        gameDate,   
        schedule
      } 
    ]
}

const getScheduleMngESB = () => {
    const scheduleFIFA = [];
    const scheduleNBA = [];
    const scheduleNHL = [];
    const scheduleVirtual = [];
  
    const LEAGUE_VIRTUAL = "Virtual eComp"
    const LEAGUE_NBA = "Mixed conference"
    const LEAGUE_MASTER_CUP = "Master Cup"
    const LEAGUE_NHL_1 = "Смешанная конференция"
    const LEAGUE_NHL_2 = "Сборные команды"
  
    const table = document.getElementsByClassName("table table-striped table-bordered table-condensed")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");
  
    Array.from(rows).forEach(element => {
      const statusText = element.getElementsByClassName("column-status")[0].innerText;
      if(statusText.includes("Не состоялся")) return;
      const time = element.getElementsByClassName("column-time")[0].innerText;
      const date = element.getElementsByClassName("column-date")[0].innerText;
      const game = element.getElementsByClassName("column-match")[0].innerText;
      const playerOne = game.split(" - ")[0];
      const playerTwo = game.split(" - ")[1];
  
      let status = null
      if(statusText.includes("Завершен")) status = false
      if(statusText.includes("Начался")) status = true
  
      const tournament = element.getElementsByClassName("column-league")[0].innerText;
  
      const datePlanned = new Date(`${date}T${time}:00`);
  
      const record = {
        playerOne, 
        playerTwo, 
        datePlanned: datePlanned.toISOString(),
        dateStart: datePlanned.toISOString(),
        status, 
        tournament: tournament
      }
      
      if(tournament.includes(LEAGUE_VIRTUAL)) {
        record.dateEnd = new Date(datePlanned.getTime() + 1000 * 60 * 12).toISOString();
        scheduleVirtual.push(record);
      }
      if(tournament.includes(LEAGUE_NBA)) {
        record.dateEnd = new Date(datePlanned.getTime() + 1000 * 60 * 30).toISOString();
        scheduleNBA.push(record);
      }
      if(tournament.includes(LEAGUE_NHL_1) || tournament.includes(LEAGUE_NHL_2)) {
        record.dateEnd = new Date(datePlanned.getTime() + 1000 * 60 * 30).toISOString();
        scheduleNHL.push(record);
      }
      if(!tournament.includes(LEAGUE_VIRTUAL) && !tournament.includes(LEAGUE_NBA) && !tournament.includes(LEAGUE_NHL_1) && !tournament.includes(LEAGUE_NHL_2)) {
        record.dateEnd = new Date(datePlanned.getTime() + 1000 * 60 * 12).toISOString();
        if(tournament.includes(LEAGUE_MASTER_CUP)){
          record.dateEnd = new Date(datePlanned.getTime() + 1000 * 60 * 30).toISOString();
        }
        scheduleFIFA.push(record)
      }
    });
    
    const gameDate = document.getElementById("gaming_day").value
  
    return [
      {
        sport: "FIFA",
        gameDate,
        schedule: scheduleFIFA
      },
      {
        sport: "NBA",
        gameDate,
        schedule: scheduleNBA
      },
      {
        sport: "FIFA Bot",
        gameDate,
        schedule: scheduleVirtual
      },
      {
        sport: "NHL",
        gameDate,
        schedule: scheduleNHL
      }
    ]
}

const downloadData = async() => {
    const curURL = window.location.href;

    let msg;
    let result = null
    if(curURL.includes(URL_SETKA_CUP)) result = getScheduleMngSC()
    if(curURL.includes(URL_ESB)) result = getScheduleMngESB()

    if(result) {
        msg = "Sending schedule..."
        handlerAlertComponent(msg)

        const res = await chrome.runtime.sendMessage({type: "download", data: result})

        msg = res.status ? "Schedule's sended!" : "Schedule's not sended!"
        handlerAlertComponent(msg)
    }else {
        msg = "Schedule's not found"
        handlerAlertComponent(msg)
    }
}


createAlertComponent()

downloadData()


