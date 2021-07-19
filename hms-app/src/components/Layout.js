import React from 'react'
import Header from './Header'

const Layout = ({children}) => {
	return (
		<React.Fragment>
			<Header/>
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

export default Layout