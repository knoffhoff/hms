import React, { useEffect, useState } from 'react'
import { deleteItemFromDynamoDB, getListofDataFromDynamoDB } from '../actions/dynamoDBFetchActions'
import { Link } from 'react-router-dom'

const HackathonList = () => {

	const [values, setValues] = useState({
		hackathons: [],
		error: true,
		success: false
	})

	const { hackathons, error, success } = values


	useEffect(() => {
		getListofDataFromDynamoDB('hackathon').then(data => {
			setValues({...values, hackathons: data, error: false, success: true})
		}, () => {
			setValues({...values, error: true, success: false})
		})
	}, [])

	const deleteConfirm = id => {
		let answer = window.confirm('Are you sure you want to delete this Hackathon?')
		if (answer) {
			deleteItemFromDynamoDB(id, 'hackathon')
		}
	}

	const listHackathons = () => {
		return hackathons.map((hackathon, i) => {
			return (
				<div key={i} className="item-card grid-item three-eights margin-s">
					<p>{hackathon.id}</p>
					<p>{hackathon.title}</p>
					<p>{hackathon.description}</p>
					<p>{hackathon.startDate}</p>
					<p>{hackathon.endDate}</p>
					<p>{hackathon.categories}</p>
					<p>{hackathon.maxPitchTime}</p>
					<br />
					<Link className="button button-secondary" to={`/edit/hackathon/${hackathon.id}`}>Edit</Link>
					<button onClick={() => deleteConfirm(hackathon.id)} className="button">Delete</button>
				</div>
			)
		})
	}

	return (
		<React.Fragment>
			<div className="grid grid-flex">
				{listHackathons()}
			</div>
		</React.Fragment>
	)
}

export default HackathonList