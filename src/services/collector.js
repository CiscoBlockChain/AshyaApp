const hname = window.location.hostname
export const API = "http://" + hname + ":5050"

const collectorAPI = {
  getContract() {
    return fetch(API + '/contract', {})
    .then(statusHelper)
    .then(data => {
      return data
    })
    .catch( (error) => {
      console.log("catch error: ", error)
      return error
    })
  },
  updateContract(userData) {
    console.log("updating new address: " + userData.address)
    return fetch(API + '/contract', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: userData.address
      }),
    })
  },
}

// thanks: https://github.com/redux-saga/redux-saga/issues/561
function statusHelper (response) {
  let json = response.json(); // there's always a body.
  if (response.status >= 200 && response.status < 300) {
    return json.then(Promise.resolve(response))
  } else {
    if (! json.error) {
      json.error = "Unable to get server settings."
    }
    return json.then(Promise.reject.bind(Promise))
  }
}

export default collectorAPI
