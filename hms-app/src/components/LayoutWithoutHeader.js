import React from 'react'

const LayoutWithoutHeader = ({children}) => {
	return (
		<React.Fragment>
			<div className="content">
				<div className="grid grid-flex gutter-m">
					{children}
				</div>
			</div>
			<footer>
			</footer>
		</React.Fragment>
	)
}

export default LayoutWithoutHeader