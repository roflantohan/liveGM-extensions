//исполнение в среде браузера а не в самом расширении
const URL_LIVEGM_API = `http://181.215.69.105:4000/history_origin/add`;

const URL_TELEGRAM_API = "https://api.telegram.org/bot5082680059:AAHOLCDlcAci3Q-PqnKSv9XkxIdFjqCV3jQ/sendMessage"
const createDataTelegram = (msg) => ({"chat_id": "-1001708654017", "text": msg, "disable_notification": false})

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



const sendData = async(data) => {
    if(games.length){
        return requestPost(URL_TELEGRAM_API, data)
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "parsedData") {
        requestPost(URL_LIVEGM_API, {games: request.data})
    }
    if(request.type === "Error") {
        requestPost(URL_TELEGRAM_API, createDataTelegram(request.data))
    }
    return true;
})
