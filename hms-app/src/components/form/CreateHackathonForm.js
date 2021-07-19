import React, { useEffect, useState } from 'react'
import Datepicker from './Datepicker'
import { getItemFromDynamoDB, getListofDataFromDynamoDB, putDataToDynamoDB } from '../../actions/dynamoDBFetchActions'
import SelectCategories from './SelectCategories'
import {Link} from "react-router-dom";

const CreateHackathonForm = ({hackathonId}) => {
	{hackathonId ? console.log(hackathonId) : console.log("nope")}

	const [values, setValues] = useState({
		id: '',
		title: '',
		description: '',
		categories: [],											// IDs
		startDate: new Date('2020-10-10T10:00:00'),
		endDate: new Date('2020-10-15T15:00:00'),
		maxPitchTime: Number(120),						// seconds
		error: false,
		success: false
	})

	// destructure values
	const {id, title, description, categories, startDate, endDate, maxPitchTime, error, success} = values


	const initHackathon = () => {
		if (hackathonId) {
			getItemFromDynamoDB('hackathon', hackathonId).then(data => {
				console.log(data)
				if (data) {
					console.log("success")
					setValues({...values,
						id: data.id,
						title: data.title,
						description: data.description,
						categories: data.categories,						// Array of Ids
						startDate: data.startDate,
						endDate: data.endDate,
						maxPitchTime: data.maxPitchTime,
						error: false,
						success: true})

				} else {
					console.log("fail")
					setValues({...values, error: data.error, success: false})
				}
			})
		}
	}


	useEffect(() => {
		initHackathon()
	}, [])


	const handleSubmit = (e) => {
		e.preventDefault()
		console.table({id, title, description, categories, startDate, endDate, maxPitchTime, error, success})
		// set State
		setValues({...values, id: id, title: title, description: description, categories: categories, startDate: startDate, endDate: endDate, maxPitchTime: maxPitchTime})

		const formData = {id, title, description, categories, startDate, endDate, maxPitchTime}

		// DB query
		putDataToDynamoDB(formData, 'hackathon').then(data => {
			if (data.error) {
				setValues({...values, error: data.error, success: false})
			} else {
				console.log("success")
				setValues({...values, error: false, success: true})
			}
		})

	}

	const handleChange = name => (e) => {
		console.log(e.target.value)
		console.table({id, title, description, categories, startDate, endDate, maxPitchTime, error, success})
		setValues({...values, [name]: e.target.value, error: false, success: false})
	}

	const handleDateChange = name => (date) => {
		setValues({...values, [name]: date, error: false, success: false});
		console.log("startDate:", startDate, " endDate: ", endDate)
		console.table({id, title, description, categories, startDate, endDate, maxPitchTime, error, success})
	};

	const handleCategoryChange = (categories) => {
		const categoryIds = categories.map((cat) => {
			return cat.id
		})
		setValues({...values, categories: categoryIds, error: false, success: false});
	};




	return (
		<form onSubmit={handleSubmit} action="#" className="form form-theme-dark padding-bottom-l">
			<fieldset>
				<div className="grid grid-flex gutter-form">
					<div className="grid-item one-half">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-with-value-1">Hackathon Title</label>
							<input value={title}
								   onChange={handleChange('title')}
								   type="text"
								   id="text-input-with-value-1"
								   className="input-text"
								   placeholder="the name of the upcoming Hackathon" />
						</div>
					</div>
					<div className="grid-item one-half">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-with-value-1">Hackathon ID</label>
							<input value={id}
								   onChange={handleChange('id')}
								   type="text"
								   id="text-input-with-value-1"
								   className="input-text"
								   placeholder="a uniquely identifiying id" />
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
									  placeholder="what is this hackathon about..." />
						</div>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<div className="grid grid-flex gutter-form">
					<div className="grid-item one-whole">
						<label className="input-label" htmlFor="text-are-1">Pick the dates of the Hackathon</label>
						<div className="grid-item one-fourth" style={{ backgroundColor: "white", borderRadius: 4, color: "black"}}>
							<Datepicker action={handleDateChange('startDate')} date={startDate}/>
						</div>
						<div className="grid-item one-fourth push-one-twelfth" style={{ backgroundColor: "white", borderRadius: 4, color: "black"}}>
							<Datepicker action={handleDateChange('endDate')} date={endDate}/>
						</div>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<div className="grid grid-flex gutter-form">
					<div className="grid-item one-half">
						<SelectCategories onChange={handleCategoryChange} setCategoryIds={categories}  />
					</div>
					<div className="grid-item one-half">
						<Link className="button margin-top-l" to="/create/category">Add Category</Link>
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

export default CreateHackathonForm
