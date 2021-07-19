import React from 'react'
import './IdeaCardSmall.css'

const IdeaCardSmall = ({idea}) => {
	return (
		<div className="idea" style={{}}>
			<a href={`#`}>
				<div className='votes pull-right'>
					{Math.floor(Math.random()*10+1)} Votes
				</div>
				<div className='user-name'>
					unknown user
				</div>
				<div className="idea-name">
					<p>{idea.title}</p>
				</div>
				<div className='idea-description'>
					<div>{idea.problem_hypothesis}</div>
				</div>
				<div className='category'>
					{idea.category}
				</div>
			</a>
		</div>
	)
}

export default IdeaCardSmall