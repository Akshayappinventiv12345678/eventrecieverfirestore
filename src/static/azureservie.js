const axios = require('axios');
// const url="https://almpridertracking.azurewebsites.net/api/ridertracking?code=09DSPdilw0t2MJvm2kgb3gMLEo_MdUi8DgcFCSK9EPMaAzFuX5jRLQ%3D%3D"
const url="https://almpridertracing.azurewebsites.net/api/ridertracking?code=auebG2JJEjzT9pTuUIz_BL2WWuDBkUbm_XN6bU6K11NwAzFum58qJw%3D%3D"
// const url='http://localhost:7071/api/ridertracking'
// const url="https://adpalmpridertracking.azurewebsites.net/api/ridertracking?code=n8p7IxHOK1_xMNghNYdmQ9-01-JYT5SRZQg-JqumFsGWAzFu_OD5qw%3D%3D"
/**
 * 
 * Makes an HTTP POST request to a given URL with provided data and headers.
 * @param {string} url - The URL to send the POST request to.
 * @param {Object} data - The data to send in the POST request body.
 * @param {Object} headers - Optional headers for the POST request.
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 */
const makePostRequest = async ( data, headers = {'Content-Type': 'application/json'}) => {
    try {
        const response = await axios.post(url, data, { headers });
        return response.data; // Returning the response data
    } catch (error) {
        console.error(`Error in POST request to ${url}:`, error.message,error.response.data);
        // return error.message
        throw error;
        // retu // Re-throw the error to handle it in the caller
    }
};

// Exporting the function
module.exports = { makePostRequest };
