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


const transformStatSetkaCup = (arr) => {
      
}

const transformStatESB = (arr) => {

}

btnStat.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = await tab.url
  
  let execFun = () => {}

  if(url.includes(URL_SETKA_CUP) || url.includes(URL_ESB)) execFun = getStat

  chrome.scripting.executeScript({
  	// скрипт будет выполняться во вкладке, которую нашли на пр2едыдущем этапе
    target: { tabId: tab.id},
    // вызываем функцию, в которой лежит запуск снежинок
    function: execFun,
  }, async(data) => {
    const {result} = data[0]


    

    console.log(result)
  });
});
