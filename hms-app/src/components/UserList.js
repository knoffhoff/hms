import React, { useEffect, useState } from 'react'
import { getListofDataFromDynamoDB } from '../actions/dynamoDBFetchActions'
import { Link } from 'react-router-dom'

const UserList = () => {

	const [values, setValues] = useState({
		users: [],
		error: true,
		success: false
	})

	const { users, error, success } = values


	useEffect(() => {
		getListofDataFromDynamoDB('user').then(data => {
			setValues({...values, users: data, error: false, success: true})
		}, () => {
			setValues({...values, error: true, success: false})
		})
	}, [])

	const deleteConfirm = id => {
		let answer = window.confirm('Are you sure you want to delete this Hackathon?')
		if (answer) {
			// deleteHackathon(id)
		}
	}

	const listUsers = () => {
		return users.map((user, i) => {
			return (
				<div key={i} className="item-card grid-item three-eights margin-s">
					<p>{user.id}</p>
					<p>{user.name}</p>
					<p>{user.email}</p>
					<p>{user.auth_info}</p>
					<br />
					<Link className="button button-secondary" to={`/edit/user/id=${user.id}`}>Edit</Link>
					<button onClick={() => deleteConfirm(user.id)} className="button">Delete</button>
				</div>
			)
		})
	}

	return (
		<React.Fragment>
			<div className="grid grid-flex">
				{listUsers()}
			</div>
		</React.Fragment>
	)
}

export default UserList
