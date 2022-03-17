import fetch from 'isomorphic-fetch'

export const putDataToDynamoDB = (data, endpoint) => {
	return fetch(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(response => {
		console.log(response)
		return response
	})
	.catch(err => console.log(err))
}

export const getListofDataFromDynamoDB = (endpoint) => {
	return fetch(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		return response.json()
	})
	.catch(err => console.log(err))
}

export const getItemFromDynamoDB = (endpoint, id) => {
	return fetch(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}/${id}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		return response.json()
	})
	.catch(err => console.log(err))
}

export const deleteItemFromDynamoDB = (id, endpoint) => {
	return fetch(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}/${id}`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.then(response => {
		console.log(response)
		return response
	})
	.catch(err => console.log(err))
}