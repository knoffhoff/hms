import React, { useEffect, useState } from 'react'
import './pitchGenerator/generator.css'
import IdeaCardSmall from '../components/IdeaCardSmall'
import { getListofDataFromDynamoDB } from '../actions/dynamoDBFetchActions'

const IdeasList = () => {

	const [values, setValues] = useState({
		error: false,
		isLoading: true,
		ideas: [],
		pagination: ''
	})

	const {error, isLoading, ideas, pagination} = values

	useEffect(() => {
		loadIdeas()
	},[])


	const loadIdeas = () => {
		getListofDataFromDynamoDB('idea').then(data => {
			setValues({...values, ideas: data, error: false, isLoading: false})
		}, () => {
			setValues({...values, error: true, isLoading: false})
		})
	}

	const listIdeas = () => {
		 return ideas.map((idea, i) => {
		 	return (
		 		<div key={i} className="grid-item desk-one-half lap-one-whole palm-one-whole margin-top-xl margin-bottom-l">
					<IdeaCardSmall idea={idea}/>
				</div>
			)
		 })
	}



	return (
		<div className="grid-item two-thirds" >
			<div className="grid grid-flex grid-justify-center">
				<div className="grid-item one-whole">
					<div className="align-center margin-top-l">
						<h2>Currently enrolled Ideas</h2>
					</div>
				</div>

				<div  className="grid-item one-whole">
					{error &&
						<div className="status-message status-message--short status-error">
							<h3>Error loading Ideas</h3>
							<p>
								Something went wrong.
							</p>
						</div>
					}
					{isLoading &&
						<div className="status-message status-message--short status-warning">
							<h3>Loading...</h3>
							<p>
								Data is coming.
							</p>
						</div>
					}
					<div className="grid grid-flex gutter">
						{ideas && listIdeas()}
					</div>
				</div>
			</div>
		</div>
	)
}

export default IdeasList