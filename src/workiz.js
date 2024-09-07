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

    const jobSource = document.getElementById('job-source-select').value

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
          title: `JOB - ${firstName} ${lastName}`,
          add_time: new Date().toISOString(),
          '90b6d7867b88760207bd2c50949402600642979d':`${phoneNumber}`,
          "5cdd40ece34fa51686077eea1b8a45a6015fba10": `${email}`,
          'ef7d645cac543da5c457666b08698fa9a9e7c39e': `${date}`,
          '65ec34aa89ec2138cbc2488c1958d54a4754489a': `${jobDescription}`,
          'bc1f7b25cc42d2dd74074c23d6b7fbe688c32814': `${jobType}`,
          'ca3f363566948dd5b6c7917b5839d98e215bc10c': `${startTime}`,
          'a37fd2e426281c863eebe914b8cd56edd521aca6': `${endTime}`,
          'b85d774eb991dea75388ca7483647e5e1e9a745d': `${jobSource}`,
          '6bf0533cf7d8ca42419fd25c8e11466bd0350283': `${address}, ${city}, ${state}, ${zip}`,
          '2b83bef966adad1d365a5f680a5b047d79968c17': `${technician}`,
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

      const updateResponse = await fetch(
        `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${apiKey}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "a018e9713e35d227f69fdfe7201f5a64c125bdd5": dealId,
          }),
        }
      )

      const updateData = await updateResponse.json()

      if (updateResponse.ok) {
        console.log('Deal updated with jobID successfully!', updateData)
      } else {
        console.error('Failed to update deal:', updateData)
      }

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
