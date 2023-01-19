//выполнение в расширении
'use strict'
const divHeader = document.getElementById("header");
const divLog = document.getElementById("log")
const divSport = document.getElementById("sport")

const btnUpload = document.getElementById("btn_upload");
const btnDownload = document.getElementById("btn_download");

const getCheckedSport = () => {
  const checkboxes = document.querySelectorAll('input[name="sport"]:checked');
  const output = [];
  checkboxes.forEach((checkbox) => {
      output.push(checkbox.value);
  });
  return output
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



window.onload = async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = await tab.url

  if(url.includes(URL_SETKA_CUP)){
    divHeader.innerHTML = `
      <img src="./assets/setkacup_icon.png" width="20" height="20" alt="setka cup">
      <p>Вы находитесь на странице мониторинга Setka Cup</p>
    `
    divSport.innerHTML = `
      <input type="checkbox" checked value="Table Tennis" name="sport"/> Table Tennis
    `
    return;
  }
  if(url.includes(URL_ESB)){
    divHeader.innerHTML = `
      <img src="./assets/esb_icon.png" width="20" height="20" alt="esb">
      <p>Вы находитесь на странице мониторинга ESB</p>
    `
    divSport.innerHTML = `
      <input type="checkbox" checked value="FIFA" name="sport"/> FIFA
      <input type="checkbox" checked value="NBA" name="sport"/> NBA
      <input type="checkbox" checked value="FIFA Bot" name="sport"/> FIFA Bot
      <input type="checkbox" checked value="NHL" name="sport"/> NHL
    `
    return;
  }

  divHeader.innerHTML = `
    <img src="./assets/non_icon.png" width="20" height="20" alt="non">
    <p>Вы не находитесь на странице мониторинга</p>
  `
  btnUpload.disabled = true
  btnDownload.disabled = true
  return;
}


