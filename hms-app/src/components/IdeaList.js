import React, { useEffect, useState } from 'react'
import { getListofDataFromDynamoDB } from '../actions/dynamoDBFetchActions'
import IdeaCardBigManageable from './IdeaCardBigManageable'

const IdeaList = () => {

	const [values, setValues] = useState({
		ideas: [],
		error: true,
		success: false
	})

	const { ideas, error, success } = values


	useEffect(() => {
		getListofDataFromDynamoDB('idea').then(data => {
			setValues({...values, ideas: data, error: false, success: true})
		}, () => {
			setValues({...values, error: true, success: false})
		})
	}, [])

	const listIdeas = () => {
		return ideas.map((idea, i) => {
			return (
				<div key={i} className="grid-item desk-one-whole lap-one-whole palm-one-whole">
					<IdeaCardBigManageable idea={idea}/>
				</div>
			)
		})
	}

	return (
		<React.Fragment>
			<div className="grid grid-flex">
				{listIdeas()}
			</div>
		</React.Fragment>
	)
}

export default IdeaList
