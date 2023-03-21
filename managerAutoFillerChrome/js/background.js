//исполнение в среде браузера а не в самом расширении
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.type === "getData") {
        const {url, idSport, gameDate} = request.data
        requestPost(url, {idSport, gameDate}).then((res) => {
          sendResponse({type: "response", data: res.data})
        }).catch(() => {
          sendResponse({type: "response", data: {}})
        })
    }
    return true;
})

