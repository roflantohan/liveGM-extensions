//выполнение в расширении
'use strict'
const divHeader = document.getElementById("header");
const divLog = document.getElementById("log")
const divSport = document.getElementById("sport")
const divOpt = document.getElementById("options")

const btnUpload = document.getElementById("btn_upload");
const btnDownload = document.getElementById("btn_download");

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
    addComponent(divLog, error)
    console.error('There was an error!', error);
    return {error, data: []}
  });

const getCheckedIntervals = () => {
  const checkboxes = document.querySelectorAll('input[name="interval"]:checked');
  const output = [];
  checkboxes.forEach((checkbox) => {
      output.push(checkbox.value);
  });
  return output;
}

const updateLocalStorage = (key, value) => {
  const options = {}
  options[key] = value
  chrome.storage.sync.set({...options});
  return options
}

const getLocalStorage = async(key) => {
  const data = await chrome.storage.sync.get([key]);
  return data[key]
}

const ErrorHeaderPageComponent = `
  <p><img src="./assets/non_icon.png" width="20" height="20" alt="non"> Not found</p>
`
const SetkaHeaderPageComponent = `
  <p><img src="./assets/setkacup_icon.png" width="20" height="20" alt="setka cup"> Manager Setka Cup</p>
`
const SetkaSportListComponent = `
  <p>Sports: Table Tennis</p>
`
const EsbHeaderPageComponent = `
  <p><img src="./assets/esb_icon.png" width="20" height="20" alt="esb"> Manager eSport</p>
`
const EsbSportListComponent = `
  <p>Sports: FIFA, NBA, FIFA Bot, NHL</p>
`
const GeneralIntervalListComponent = `
  <p>Upload's intervals:</p>
  <p><input class="check" type="checkbox" checked value="morning" name="interval"/> 06:00 - 12:00</p>
  <p><input class="check" type="checkbox" checked value="lunch" name="interval"/> 12:00 - 16:00</p>
  <p><input class="check" type="checkbox" checked value="evening" name="interval"/> 16:00 - 20:00</p>
  <p><input class="check" type="checkbox" checked value="night" name="interval"/> 20:00 - 08:00</p>
`

const createComponent = (tag, component) => tag.innerHTML = component
const addComponent = (tag, component) => tag.innerHTML += component
const clearComponent = (tag) => tag.innerHTML = ""

window.onload = async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = await tab.url

  //components set
  let headerComponent = ErrorHeaderPageComponent
  let sportListComponent = null
  let intervalListComponent = null
  let visibility = false

  if(url.includes(URL_SETKA_CUP)){
    headerComponent = SetkaHeaderPageComponent
    sportListComponent = SetkaSportListComponent
    intervalListComponent = GeneralIntervalListComponent
    visibility = true
  }
  if(url.includes(URL_ESB)){
    headerComponent = EsbHeaderPageComponent
    sportListComponent = EsbSportListComponent
    intervalListComponent = GeneralIntervalListComponent
    visibility = true
  }


  createComponent(divHeader, headerComponent)
  createComponent(divSport, sportListComponent)
  createComponent(divOpt, intervalListComponent)

  btnUpload.style.visibility = visibility ? "visible" : "hidden"
  btnDownload.style.visibility = visibility ? "visible" : "hidden"

  //checkboxes set
  const checkboxes = document.querySelectorAll('input[name="interval"]');
  const intervals = await getLocalStorage("intervals");

  if(checkboxes.length !== intervals.length && intervals.length){
    checkboxes.forEach(box => {
      box.checked = false;
      if(intervals.includes(box.value)) box.checked = true
    });
  }

  updateLocalStorage("intervals", getCheckedIntervals())

  checkboxes.forEach(box => {
    box.addEventListener("change", () => {
      updateLocalStorage("intervals", getCheckedIntervals())
    });
  })

}





