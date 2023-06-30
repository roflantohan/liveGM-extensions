//исполнение в среде браузера а не в самом расширении

const URL_POST_DOWNLOAD = "http://181.215.69.105:4000/schedule/add"
const ID_SPORT = {
    "FIFA": 1,
    "Table Tennis": 2,
    "NBA": 3,
    "FIFA Bot": 8,
    "NHL": 4
}

const requestPost = (path, data) => fetch(path, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
  })
  .then(async response => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
    }

    return {error: null, data}
  })
  .catch(error => {
    console.error('There was an error!', error);
    return {error, data: []}
  });

const sendData = async(schedules) => {
    for(let i = 0; i < schedules.length; i++){
        const {sport, gameDate, schedule} = schedules[i]
        if(schedule.length){
          return requestPost(URL_POST_DOWNLOAD, {idSport: ID_SPORT[sport], gameDate, schedule})
        }
    }
    return false;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.type === "download") {
        sendData(request.data).then(() => {
          sendResponse({type: "response", status: true})
        }).catch(() => {
          sendResponse({type: "response", status: false})
        })
    }
    return true;
})
