import React, { useState } from 'react'

function NewIdea() {
  //TODO automaticly add ID and owner for a idea
  const [ideaText, setIdeaText] = useState({
    titel: '',
    description: '',
    reason: '',
    problem: '',
    goal: '',
    skills: '',
    aws_needed: '',
  })

  function handleChange(event: { target: { name: any; value: any } }) {
    setIdeaText((prevIdeaText) => ({
      ...prevIdeaText,
      [event.target.name]: event.target.value,
    }))
  }
  function submitForm(event: any) {
    event.preventDefault()
    alert({ ideaText } + JSON.stringify(ideaText))
  }

  return (
    <>
      <form onSubmit={submitForm}>
        <div className="titel">
          <h3>titel</h3>
          <input
            type="text"
            placeholder="titel"
            onChange={handleChange}
            name="titel"
            value={ideaText.titel}
          />
        </div>
        <div className="description">
          <h3>description</h3>
          <input
            type="text"
            placeholder="description"
            onChange={handleChange}
            name="description"
            value={ideaText.description}
          />
        </div>
        <div className="reason">
          <h3>why you chosed it?</h3>
          <input
            type="text"
            placeholder="why you chosed it?"
            onChange={handleChange}
            name="reason"
            value={ideaText.reason}
          />
        </div>
        <div className="problem">
          <h3>what problem solves it?</h3>
          <input
            type="text"
            placeholder="what problem solves it?"
            onChange={handleChange}
            name="problem"
            value={ideaText.problem}
          />
        </div>
        <div className="goal">
          <h3>goal?</h3>
          <input
            type="text"
            placeholder="goal?"
            onChange={handleChange}
            name="goal"
            value={ideaText.goal}
          />
        </div>
        <div className="skills">
          <h3>skills needed?</h3>
          <input
            type="text"
            placeholder="skills?"
            onChange={handleChange}
            name="skills"
            value={ideaText.skills}
          />
        </div>
        <div className="aws_needed">
          <h3>aws needed?</h3>
          <input
            type="text"
            placeholder="aws needed?"
            onChange={handleChange}
            name="aws_needed"
            value={ideaText.aws_needed}
          />
        </div>

        <h3></h3>
        <button type="submit">Create new idea</button>
      </form>
    </>
  )
}

export default NewIdea
