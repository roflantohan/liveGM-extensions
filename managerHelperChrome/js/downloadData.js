'use strict'

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

btnDownload.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = await tab.url
  
  let execFun = () => {}

  if(url.includes(URL_SETKA_CUP)) execFun = getScheduleMngSC
  if(url.includes(URL_ESB)) execFun = getScheduleMngESB

  chrome.scripting.executeScript({
  	// скрипт будет выполняться во вкладке, которую нашли на пр2едыдущем этапе
    target: { tabId: tab.id},
    // вызываем функцию, в которой лежит запуск снежинок
    function: execFun,
  }, async(data) => {
    divLog.innerHTML = `Записи получены`
    const schedules = data[0].result;
    for(let i = 0; i < schedules.length; i++){
      const {sport, gameDate, schedule} = schedules[i]
      if(schedule.length){
        const {error, data} = await requestPost(URL_POST_DOWNLOAD, {idSport: ID_SPORT[sport], gameDate, schedule})
        if(error) divLog.innerHTML += `<p>${error}</p>`
      }
    }
    divLog.innerHTML += `<p>Записи отправлены</p>`
  });
});
