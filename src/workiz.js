const addressDataMap = {
  '123 Main St': { city: 'Orlando', state: 'FL', zip: '32801' },
  '456 Oak Ave': { city: 'Miami', state: 'FL', zip: '33101' },
  '789 Pine Rd': { city: 'Tampa', state: 'FL', zip: '33602' },
  '101 River Dr': { city: 'Jacksonville', state: 'FL', zip: '32207' },
  '202 Cedar St': { city: 'Gainesville', state: 'FL', zip: '32601' },
}

window.showSuggestions = function () {
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

    const firstName = document.querySelector(
      '#сlient-details-form input[placeholder="First name"]'
    ).value
    const lastName = document.querySelector(
      '#сlient-details-form input[placeholder="Last name"]'
    ).value
    const phoneNumber = document.querySelector(
      '#сlient-details-form input[placeholder="Phone number"]'
    ).value
    const email = document.querySelector(
      '#сlient-details-form input[placeholder="Email"]'
    ).value

    const jobType = document.querySelector('#job-type-form select').value
    const jobDescription = document.querySelector(
      '#job-type-form input[placeholder="Job description (optional)"]'
    ).value

    const address = document.getElementById('address-select').value
    const city = document.getElementById('cityInput').value
    const state = document.getElementById('stateInput').value
    const zip = document.getElementById('zipInput').value

    const date = document.querySelector(
      '#scheduled-form input[type="date"]'
    ).value
    const startTime = document.querySelector(
      '#scheduled-form input[type="time"]:nth-child(1)'
    ).value
    const endTime = document.querySelector(
      '#scheduled-form input[type="time"]:nth-child(2)'
    ).value
    const technician = document.querySelector('#scheduled-form select').value

    const response = await fetch(
      `https://api.pipedrive.com/v1/deals?api_token=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${jobType} - ${firstName} ${lastName}`,
          value: 10000,
          currency: 'USD',
          user_id: null,
          person_id: null,
          org_id: 1,
          stage_id: 1,
          status: 'open',
          expected_close_date: date,
          probability: 60,
          lost_reason: null,
          visible_to: 1,
          add_time: new Date().toISOString(),
          custom_fields: {
            phone: phoneNumber,
            email: email,
            address: `${address}, ${city}, ${state}, ${zip}`,
            job_description: jobDescription,
            start_time: startTime,
            end_time: endTime,
            technician: technician,
          },
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('Deal was added successfully!', data)

      const buttons = document.querySelectorAll('button')
      buttons.forEach((button) => {
        button.style.display = 'none'
      })

      const formsContainer = document.querySelector('.forms-container')
      if (formsContainer) {
        formsContainer.style.display = 'none'
      }

      const dealId = data.data.id
      const dealUrl = `https://vladislav-sandbox.pipedrive.com/deal/${dealId}`

      const dealLink = document.getElementById('deal-link')
      dealLink.href = dealUrl

      const dealLinkContainer = document.getElementById('deal-link-container')
      dealLinkContainer.style.display = 'block'
    } else {
      console.error('Failed to add deal:', data)
    }
  } catch (error) {
    console.error('Adding failed', error)
  }
}

window.submitForm = function (event) {
  event.preventDefault()

  const clientForm = document.getElementById('сlient-details-form')
  const jobTypeForm = document.getElementById('job-type-form')
  const serviceLocationForm = document.getElementById('service-location-form')
  const scheduledForm = document.getElementById('scheduled-form')

  if (
    clientForm.checkValidity() &&
    jobTypeForm.checkValidity() &&
    serviceLocationForm.checkValidity() &&
    scheduledForm.checkValidity()
  ) {
    addDeal()
  } else {
    clientForm.reportValidity()
    jobTypeForm.reportValidity()
    serviceLocationForm.reportValidity()
    scheduledForm.reportValidity()
  }
}
