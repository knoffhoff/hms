import React, { useState } from 'react'
import Datepicker from './Datepicker'
import fetch from 'isomorphic-fetch'
import { putDataToDynamoDB } from '../../actions/dynamoDBFetchActions'

const CreateUserForm = () => {

	const [values, setValues] = useState({
		id:          '',
		email:       '',
		name:        '',
		auth_info:    '',
		error:       false,
		success:     false
	})

	// destructure values
	const {id, email, name, auth_info, error, success} = values


	const handleSubmit = (e) => {
		e.preventDefault()
		console.table({id, email: email, name, error, success})
		// set State
		setValues({...values, id: id, email: email, name: name, auth_info: auth_info})

		const formData = {id, email, name, auth_info}

		// DB query
		putDataToDynamoDB(formData, 'user').then(data => {
			if (data.ok) {
				console.log("success")
				setValues({...values, error: false, success: true})

			} else {
				console.log("fail")
				setValues({...values, error: data.error, success: false})
			}
		})

	}

	const handleChange = name => (e) => {
		console.log(e.target.value)
		setValues({...values, [name]: e.target.value, error: false, success: false})
	}


	return (
		<form onSubmit={handleSubmit} action="#" className="form form-theme-dark padding-bottom-l">
			<fieldset>
				<div className="grid grid-flex gutter-form">
					<div className="grid-item one-half">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-with-value-1">User ID</label>
							<input value={id}
								   onChange={handleChange('id')}
								   type="text"
								   id="text-input-with-value-1"
								   className="input-text"
								   placeholder="a uniquely identifiying id" />
						</div>
					</div>
					<div className="grid-item one-half">
						<label className="input-label" htmlFor="users">Name</label>
						<div className="input-text-container">
							<input value={name}
								   onChange={handleChange('name')}
								   type="text"
								   id="users"
								   className="input-text" />
						</div>
					</div>
					<div className="grid-item one-half">
						<label className="input-label" htmlFor="user-email" type="email">E-Mail</label>
						<div className="input-text-container">
							<input value={email}
								   onChange={handleChange('email')}
								   type="text"
								   id="user-email"
								   className="input-text" />
						</div>
					</div>
					<div className="grid-item one-half">
						<label className="input-label" htmlFor="user-auth">Auth Info</label>
						<div className="input-text-container">
							<input value={auth_info}
								   onChange={handleChange('auth_info')}
								   type="text"
								   id="user-auth"
								   className="input-text" />
						</div>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<div className="grid grid-flex gutter-form grid-justify-end">
					<div className="grid-item">
						<a href="#" className="button button-margin-right cancel">Back</a>
					</div>
					<div className="grid-item">
						<input type="submit" className="button-primary" value="Submit" />
					</div>
				</div>
			</fieldset>
		</form>
	)
}

export default CreateUserForm
