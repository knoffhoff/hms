import React, { useState } from 'react'
import Datepicker from './Datepicker'
import fetch from 'isomorphic-fetch'
import { putDataToDynamoDB } from '../../actions/dynamoDBFetchActions'

const CreateCategoryForm = () => {

	const [values, setValues] = useState({
		id:          '',
		title:       '',
		description: '',
		error:       false,
		success:     false
	})

	// destructure values
	const {id, title, description, error, success} = values


	const handleSubmit = (e) => {
		e.preventDefault()
		console.table({id, title: title, description, error, success})
		// set State
		setValues({...values, id: id, title: title, description: description})

		const formData = {id, title, description}

		// DB query
		putDataToDynamoDB(formData, 'category').then(data => {
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
							<label className="input-label" htmlFor="text-input-with-value-1">Category ID</label>
							<input value={id}
								   onChange={handleChange('id')}
								   type="text"
								   id="text-input-with-value-1"
								   className="input-text"
								   placeholder="a uniquely identifiying id" />
						</div>
					</div>
					<div className="grid-item one-half">
						<label className="input-label" htmlFor="categories">Name</label>
						<div className="input-text-container">
							<input value={title}
								   onChange={handleChange('title')}
								   type="text"
								   id="categories"
								   className="input-text" />
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-are-1">Description</label>
							<textarea value={description}
									  onChange={handleChange('description')}
									  id="text-area-1"
									  className="textarea"
									  rows="6"
									  placeholder="describe this category please..." />
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

export default CreateCategoryForm
