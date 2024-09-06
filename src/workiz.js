const addressDataMap = {
  '123 Main St': { city: 'Orlando', state: 'FL', zip: '32801' },
  '456 Oak Ave': { city: 'Miami', state: 'FL', zip: '33101' },
  '789 Pine Rd': { city: 'Tampa', state: 'FL', zip: '33602' },
  '101 River Dr': { city: 'Jacksonville', state: 'FL', zip: '32207' },
  '202 Cedar St': { city: 'Gainesville', state: 'FL', zip: '32601' },
}

function showSuggestions() {
  const input = document.getElementById('address-select').value.toLowerCase()
  const suggestionsContainer = document.getElementById('suggestions-container')
  suggestionsContainer.innerHTML = ''

  if (input) {
    const filteredAddresses = Object.keys(addressDataMap).filter((address) =>
      address.toLowerCase().includes(input)
    )

    if (filteredAddresses.length > 0) {
      filteredAddresses.forEach((address) => {
        const suggestion = document.createElement('div')
        suggestion.classList.add('suggestion')
        suggestion.textContent = address
        suggestion.onclick = () => selectAddress(address)
        suggestionsContainer.appendChild(suggestion)
      })
    }
  }
}

function selectAddress(address) {
  const addressData = addressDataMap[address]

  document.getElementById('address-select').value = address
  document.getElementById('cityInput').value = addressData.city
  document.getElementById('stateInput').value = addressData.state
  document.getElementById('zipInput').value = addressData.zip

  document.getElementById('suggestions-container').innerHTML = ''
}

window.addDeal = async function () {
  try {
    console.log('Sending request...')
    const button = document.querySelector('.first')
    button.textContent = 'Request is sent'
    button.style.backgroundColor = 'red'

    const apiKey = import.meta.env.VITE_API_KEY
    console.log(apiKey)

    const response = await fetch(
      `https://api.pipedrive.com/v1/deals?api_token=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Deal of the century',
          value: 10000,
          currency: 'USD',
          user_id: null,
          person_id: null,
          org_id: 1,
          stage_id: 1,
          status: 'open',
          expected_close_date: '2022-02-11',
          probability: 60,
          lost_reason: null,
          visible_to: 1,
          add_time: '2021-02-11',
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('Deal was added successfully!', data)

      const dealId = data.data.id
      const dealUrl = `https://yourcompanyname.pipedrive.com/deal/${dealId}`
      window.open(dealUrl, '_blank')
    } else {
      console.error('Failed to add deal:', data)
    }
  } catch (error) {
    console.error('Adding failed', error)
  }
}
