const pipedrive = require('pipedrive');
const defaultClient = new pipedrive.ApiClient();

// PIPEDRIVE_API_KEY is an environment variable that holds real api key
defaultClient.authentications.api_key.apiKey = process.env.PIPEDRIVE_API_KEY;

async function addDeal() {
    try {
        console.log('Sending request...');

        const api = new pipedrive.DealsApi(defaultClient);

        const data = {
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
        }
        const response = await api.addDeal(data);

        console.log('Deal was added successfully!', response);
    } catch (err) {
        const errorToLog = err.context?.body || err;

        console.log('Adding failed', errorToLog);
    }
}


addDeal();