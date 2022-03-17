import React, { useEffect, useState } from 'react'
import { getListofDataFromDynamoDB } from '../../actions/dynamoDBFetchActions'
import Select from 'react-select'

const SelectCategories = ({onChange, setCategoryIds}) => {

	const [values, setValues] = useState({
		availableCategories: [],
		error: true,
		success: false
	})

	const { availableCategories, error, success } = values


	useEffect(() => {
		getListofDataFromDynamoDB('category').then(data => {
			data.map((cat) => {
				cat.value = cat.id
				cat.label = cat.title
			})
			setValues({...values, availableCategories: data, error: false, success: true})
		})
	}, [setCategoryIds])



	return (
		<fieldset>
			<div className="grid grid-flex gutter-form">
				<div className="grid-item one-whole">
					<label className="input-label" >Categories</label>
					<Select options={availableCategories} isMulti onChange={onChange}/>
				</div>
			</div>
		</fieldset>
	)
}

export default SelectCategories