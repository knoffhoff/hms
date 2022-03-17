import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header  = () => {
	return (
		<React.Fragment>
			<header className="hackweek-header">
				<div className="grid grid-flex grid-align-center">
					<div className="grid-item one-third">
						Logo
					</div>

					<div className="lit-background lit-background-container"></div>

					<div className="grid-item desk-two-thirds lap-one-whole palm-one-whole">
						<div className="grid grid-flex grid-justify-end">
							<li className="nav-item grid-item active">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
							</li>
							<li className="nav-item grid-item active">
								<Link className="nav-link" to="/ideas">Ideas</Link>
							</li>
							<li className="nav-item grid-item">
								<a className="nav-link" href="/#team">Team</a>
							</li>
							<li className="nav-item grid-item">
								<a className="nav-link" href="/#faq">FAQ</a>
							</li>
							<li className="nav-item grid-item">
								<a className="nav-link" href="/#impressions">Impressions</a>
							</li>
						</div>
					</div>
				</div>
			</header>

		</React.Fragment>
	)
}

export default Header
