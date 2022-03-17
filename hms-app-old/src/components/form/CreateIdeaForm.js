import React, { useEffect, useState } from 'react'
import { getItemFromDynamoDB } from '../../actions/dynamoDBFetchActions'
import { putDataToDynamoDB } from "../../actions/dynamoDBFetchActions";

const CreateIdeaForm = ({ideaId}) => {
	{ideaId ? console.log(ideaId) : console.log(ideaId)}

	const [values, setValues] = useState({
		id: '',
		hackathonId: '',
		title: '',
		owner: Number(9999),
		problem_hypothesis: '',
		benefit: '',
		people_needed: '',
		communication_channel: '',
		git_repo: '',
		pitch_video: '',
		final_video: '',
		enroll: false,
		category: '💸 Move the needle',
		error: false,
		success: false
	})

	const { id,
			  hackathonId,
			  title,
			  owner,
			  problem_hypothesis,
			  benefit,
			  people_needed,
			  communication_channel,
			  git_repo,
			  pitch_video,
			  final_video,
			  enroll,
			  category,
			  error,
			  success
		  } = values


	const initIdea = () => {
		if (ideaId) {
			getItemFromDynamoDB('idea', ideaId).then(data => {
				console.log(data)
				if(data) {
					console.log("success")
					setValues({
						...values,
						id: data.id,

						error:   false,
						success: true
					})

				} else {
					console.log("fail")
					setValues({...values, error: true, success: false})
				}
			})
		}
	}


	useEffect(() => {
		initIdea()
	})


	const handleChange = name => (e) => {
		console.log(e.target.value)
		setValues({...values, [name]: e.target.value, error: false, success: false})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.table({id, title, hackathonId, owner, problem_hypothesis, benefit, people_needed, communication_channel, git_repo, pitch_video, final_video, enroll, category, error, success})

		setValues({...values,
			id: id,
			title: title,
			hackathonId: hackathonId,
			owner: owner,
			problem_hypothesis: problem_hypothesis,
			benefit: benefit,
			people_needed: people_needed,
			communication_channel: communication_channel,
			git_repo: git_repo,
			pitch_video: pitch_video,
			final_video: final_video,
			enroll: enroll,
			category: category
		})

		const formData = {id, title, hackathonId, owner, problem_hypothesis, benefit, people_needed, communication_channel, git_repo, pitch_video, final_video, enroll, category}

		// DB query
		putDataToDynamoDB(formData, 'idea').then(data => {
			setValues({...values, error: false, success: true})
		}, () => {
			setValues({...values, error: true, success: false})
		})
	}


	return (
		<form onSubmit={handleSubmit} action="#" className="form form-theme-dark padding-bottom-l">
			<fieldset>
				<div className="grid grid-flex gutter-form">
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="idea-id">Idea Id</label>
							<input value={id}
								   onChange={handleChange('id')}
								   type="text"
								   id="idea-id"
								   className="input-text" />
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-with-value-1">Idea Title</label>
							<input value={title}
								   onChange={handleChange('title')}
								   type="text"
								   id="text-input-with-value-1"
								   className="input-text"
								   placeholder="One sentence summary of the idea" />
						</div>
					</div>
					<div className="grid-item one-whole">
						<label className="input-label" htmlFor="category-input">Choose a category for this idea</label>
						<div className="select-container">
							<select value={category} id="category-input" className="select" onChange={handleChange('category')}>
								<option value="🚀 Bleeding edge technology">🚀 Bleeding edge technology</option>
								<option value="💝 Give something back">💝 Give something back</option>
								<option value="💸 Move the needle">💸 Move the needle</option>
							</select>
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-area-1">What is your problem hypothesis?</label>
							<textarea value={problem_hypothesis}
									  onChange={handleChange('problem_hypothesis')}
									  id="text-area-1"
									  className="textarea"
									  rows="9"
									  placeholder="Please give us a short summary of the problem to tackle..." />
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-area-2">Who benefits?</label>
							<textarea value={benefit}
									  onChange={handleChange('benefit')}
									  id="text-area-2"
									  className="textarea"
									  rows="3"
									  placeholder="Please give us a short summary of the problem to tackle..." />
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-area-3">Who do you need?</label>
							<textarea value={people_needed}
									  onChange={handleChange('people_needed')}
									  id="text-area-3"
									  className="textarea"
									  rows="1"
									  placeholder="Please give us a short summary of the problem to tackle..." />
						</div>
					</div>
				</div>
			</fieldset>
			<br/>
			<hr />
			<br/>
			<fieldset>
				<div className="grid grid-flex gutter-form">
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-2">Slack Channel</label>
							<input value={communication_channel}
								   onChange={handleChange('communication_channel')}
								   type="text" id="text-input-2"
								   className="input-text"
								   placeholder="Let people know how to reach you during the Hackathon or upfront"/>
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-3">GitHub Repository</label>
							<input value={git_repo}
								   onChange={handleChange('git_repo')}
								   type="text" id="text-input-3"
								   className="input-text"
								   placeholder=""/>
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-4">Link to pitch video</label>
							<input value={pitch_video}
								   onChange={handleChange('pitch_video')}
								   type="text" id="text-input-4"
								   className="input-text"
								   placeholder="Please provide a link to your pitch video (maximum 2 minutes long, mp4 format, publicly available" />
						</div>
					</div>
					<div className="grid-item one-whole">
						<div className="input-text-container">
							<label className="input-label" htmlFor="text-input-5">Link to final presentation video</label>
							<input value={final_video}
								   onChange={handleChange('final_video')}
								   type="text"
								   id="text-input-5"
								   className="input-text"
								   placeholder="Please provide a link to your pitch video (maximum 2 minutes long, mp4 format, publicly available" />
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

export default CreateIdeaForm
