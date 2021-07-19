import React, { useEffect, useState } from 'react'
import { deleteItemFromDynamoDB, getListofDataFromDynamoDB } from '../actions/dynamoDBFetchActions'
import { Link } from 'react-router-dom'

const CategoryList = () => {

	const [values, setValues] = useState({
		categories: [],
		error: true,
		success: false
	})

	const { categories, error, success } = values


	useEffect(() => {
		getListofDataFromDynamoDB('category').then(data => {
			setValues({...values, categories: data, error: false, success: true})
		}, () => {
			setValues({...values, error: true, success: false})
		})
	}, [])

	const deleteConfirm = id => {
		let answer = window.confirm('Are you sure you want to delete this' +
			' category?')
		if (answer) {
			deleteItemFromDynamoDB(id, 'category')
		}
	}

	const listCategories = () => {
		return categories.map((category, i) => {
			return (
				<div key={i} className="item-card grid-item three-eights margin-s">
					<p>{category.id}</p>
					<p>{category.title}</p>
					<p>{category.description}</p>
					<br />
					<Link className="button button-secondary" to={`/edit/category/id=${category.id}`}>Edit</Link>
					<button onClick={() => deleteConfirm(category.id)} className="button">Delete</button>
				</div>
			)
		})
	}

	return (
		<React.Fragment>
			<div className="grid grid-flex">
				{listCategories()}
			</div>
		</React.Fragment>
	)
}

export default CategoryList
