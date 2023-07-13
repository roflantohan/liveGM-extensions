'use strict'


const getStat = () => {
    const scripts = document.getElementsByTagName("script")
    const gameDate = document.getElementById("gaming_day").value
    let main = "";
    for(let script of scripts) if(script.innerHTML.includes("reportApp")) main = (script.innerHTML).toString()

    const indexF = main.indexOf(',"matches":{')
    const indexS = main.indexOf(',"companies":')
    const res = main.slice(indexF + 11, indexS)
    const json = JSON.parse(res)

    return {gameDate, json}
}

const getListGameSetkaCup = (arr, leagueCh, bmCh, statusCh) => {
  const listGame = []

  for(let name in arr){
    const record = arr[name]
    const division = record.division
    const location = record.location
    const league = `${location}_${division}`
    const bookmakers = {}
    const results = record.results
    for(let bm in results){
      bookmakers[bm] = results[bm].flag
    }

    if(leagueCh === league && bookmakers[bmCh] === statusCh){
      listGame.push({
        p1: record.player1.full_name,
        p2: record.player2.full_name,
        status: record.status.code,
        startTime: record.start_time,
        ...bookmakers,
      })
    }
  }

  return listGame
}

const transformStatSetkaCup = (arr) => {
  const generalStat = {
    exist: 0,
    start: 0,
    finish: 0,
    cancel: 0,
  }
  const leagueStat = {}

  for(let name in arr){
    const record = arr[name]
    const division = record.division
    const location = record.location
    const league = `${location}_${division}`
    const results = record.results

    if(!(league in leagueStat)){
      leagueStat[league] = {
        exist: 0,
        start: 0,
        finish: 0,
        cancel: 0,
      }
    }

    for(let bm in results){
      leagueStat[league][bm] = 0
      generalStat[bm] = 0;
    }
  
  }


  for(let name in arr){
    const record = arr[name]

    const division = record.division
    const location = record.location

    const league = `${location}_${division}`
    
    const status = record.status.code

    const bookmakers = {}

    const results = record.results
    for(let bm in results){
      const flag = results[bm].flag
      bookmakers[bm] = flag

      if(flag === '1'){
        leagueStat[league][bm] += 1
        generalStat[bm] += 1
      }
    }

    leagueStat[league].exist += 1
    if(status === "active") leagueStat[league].start += 1
    if(status === 'finished') leagueStat[league].finish += 1
    if(status === "canceled") leagueStat[league].cancel += 1


    generalStat.exist += 1
    if(status === "active") generalStat.start += 1
    if(status === 'finished') generalStat.finish += 1
    if(status === "canceled") generalStat.cancel += 1

  }
  leagueStat.general = generalStat

  return leagueStat
}

const getListGameESB = (arr, leagueCh, bmCh, statusCh, sportCh) => {
  const listGame = []

  for(let name in arr){
    const record = arr[name]
    const league = record.league
    const sport = record.sport.code
    const bookmakers = {}
    const results = record.results
    for(let bm in results){
      bookmakers[bm] = results[bm].flag
    }

    if(leagueCh !== null && leagueCh === league && bookmakers[bmCh] === statusCh){
      listGame.push({
        p1: record.participant1,
        p2: record.participant2,
        status: record.status.code,
        startTime: record.start_time,
        ...bookmakers,
      })
    }

    if(sportCh !== null && sportCh === sport && bookmakers[bmCh] === statusCh){
      listGame.push({
        p1: record.participant1,
        p2: record.participant2,
        status: record.status.code,
        startTime: record.start_time,
        ...bookmakers,
      })
    }

  }

  return listGame
}

const transformStatESB = (arr) => {
  const generalStat = {
    exist: 0,
    start: 0,
    finish: 0,
    cancel: 0,
  }
  const sportStat = {}
  let leagueStat = {}

  for(let name in arr){
    const record = arr[name]
    const league = record.league
    const results = record.results
    const sport = record.sport.code

    if(!(sport in sportStat)){
      sportStat[sport] = {
        exist: 0,
        start: 0,
        finish: 0,
        cancel: 0,
      }
    }

    if(!(league in leagueStat)){
      leagueStat[league] = {
        exist: 0,
        start: 0,
        finish: 0,
        cancel: 0,
      }
    }

    for(let bm in results){
      leagueStat[league][bm] = 0
      sportStat[sport][bm] = 0
      generalStat[bm] = 0
    }
  
  }


  for(let name in arr){
    const record = arr[name]

    const league = record.league

    const status = record.status.code

    const sport = record.sport.code

    const bookmakers = {}

    const results = record.results
    for(let bm in results){
      const flag = results[bm].flag
      bookmakers[bm] = flag

      if(flag === '1'){
        sportStat[sport][bm] += 1
        leagueStat[league][bm] += 1
        generalStat[bm] += 1
      }
    }

    sportStat[sport].exist += 1
    if(status === "active")  sportStat[sport].start += 1
    if(status === 'finished')  sportStat[sport].finish += 1
    if(status === "canceled")  sportStat[sport].cancel += 1

    leagueStat[league].exist += 1
    if(status === "active") leagueStat[league].start += 1
    if(status === 'finished') leagueStat[league].finish += 1
    if(status === "canceled") leagueStat[league].cancel += 1

    generalStat.exist += 1
    if(status === "active") generalStat.start += 1
    if(status === 'finished') generalStat.finish += 1
    if(status === "canceled") generalStat.cancel += 1

    

  }
  leagueStat.general = generalStat
  leagueStat = {...leagueStat, ...sportStat}
  return leagueStat

}

const createTableList = (data) => {
  const table = document.querySelector("#list_table")

  const tbody = table.querySelector("tbody")
  const thead = table.querySelector("thead")

  const tr = thead.querySelector("tr")

  const headers = Object.keys(data[0])

  tr.innerHTML = ``

  headers.map(key => {
    tr.innerHTML += `<th class="vertical">${key}</th>`
  })

  tbody.innerHTML = ""
  for(let record of data){
    const values = Object.values(record)
    tbody.innerHTML += `<tr>${values.map(value => `<td>${value}</td>`).join("")}</tr>`
  }
}


const createTableStatSetkaCup = (data, report) => {

  const getList = (leagueCh, bmCh) => {
    const list = getListGameSetkaCup(report, leagueCh, bmCh, "1")
    createTableList(list)
  }

  const table = document.querySelector("#stat_table")

  const tbody = table.querySelector("tbody")
  const thead = table.querySelector("thead")
  const tr = thead.querySelector("tr")
  const headers = Object.keys(data.general)
  tr.innerHTML = ``
  tr.innerHTML += `<th class="vertical"> </th>`
  headers.map(key => {
    tr.innerHTML += `<th class="vertical">${key}</th>`
  })
  tbody.innerHTML = ""


  for(let name in data){
    const record = data[name]
    const values = Object.values(record)
    tbody.innerHTML += `<tr><td>${name}</td>${values.map((value, i) => `<td id="${name}_${headers[i]}">${value}</td>`).join("")}</tr>`
  }
  let events = []
  const STATUS = ['exist', "start", "finish", "cancel"]
  for(let name in data) {
    const record = data[name]
    const values = Object.values(record)
    
    if(name !== 'general'){
      values.map((value, i) => {
        if(!STATUS.includes(headers[i])){
          const btn = document.getElementById(`${name}_${headers[i]}`)
          const handler = () => {
            getList(name, headers[i])
          }
          btn.addEventListener("click", handler)
          events.push(btn)
        }
      })
    }
  }
}

const createTableStatESB = (data, report) => {

  const getList = (leagueCh, bmCh, sportCh) => {
    const list = getListGameESB(report, leagueCh, bmCh, "1", sportCh)
    createTableList(list)
  }

  const table = document.querySelector("#stat_table")
  const tbody = table.querySelector("tbody")
  const thead = table.querySelector("thead")
  const tr = thead.querySelector("tr")

  const headers = Object.keys(data.general)
  tr.innerHTML = ``
  tr.innerHTML += `<th class="vertical"> </th>`
  headers.map(key => {
    tr.innerHTML += `<th class="vertical">${key}</th>`
  })
  tbody.innerHTML = ""


  for(let name in data){
    const record = data[name]
    const values = Object.values(record)
    tbody.innerHTML += `<tr><td>${name}</td>${values.map((value, i) => `<td id="${name}_${headers[i]}">${value}</td>`).join("")}</tr>`
  }
  let events = []
  const STATUS = ['exist', "start", "finish", "cancel"]
  const SPORT = ["FIFA", "NBA", "NHL"]
  for(let name in data) {
    const record = data[name]
    const values = Object.values(record)
    
    if(name !== 'general'){
      values.map((value, i) => {
        if(!STATUS.includes(headers[i])){
          const btn = document.getElementById(`${name}_${headers[i]}`)
          const handler = () => {
            if(SPORT.includes(name)){
              getList(null, headers[i], name)
            }else{
              getList(name, headers[i], null)
            }
          }
          btn.addEventListener("click", handler)
          events.push(btn)
        }
      })
    }
  }
}

btnStat.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = await tab.url
  
  if(url.includes(URL_SETKA_CUP) || url.includes(URL_ESB)) {
    chrome.scripting.executeScript({
      // скрипт будет выполняться во вкладке, которую нашли на пр2едыдущем этапе
      target: { tabId: tab.id},
      // вызываем функцию, в которой лежит запуск снежинок
      function: getStat,
    }, async(data) => {
      const {result} = data[0]
      const {gameDate, json} = result
      console.log(result)
      if(url.includes(URL_SETKA_CUP)){
        const leagueStat = transformStatSetkaCup(json)
        createTableStatSetkaCup(leagueStat, json)
      }
      if(url.includes(URL_ESB)){
        const leagueStat = transformStatESB(json)
        console.log(leagueStat)
        createTableStatESB(leagueStat, json)
      }
    });
  }
});
