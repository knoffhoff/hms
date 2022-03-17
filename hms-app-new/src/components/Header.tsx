import React from 'react'
import { Link } from 'react-router-dom'

const Header  = () => {
    return (
        <React.Fragment>
            <nav className="nav">
                        <div className="nav-items">
                                <li>
                                    <Link to="/">HOME</Link>
                                </li>
                                <li>
                                    <a href="/Idea_Portal">Idea Portal</a>
                                </li>
                                <li>
                                    <a href="/Your_Idea">Your Idea</a>
                                </li>
                                <li>
                                    <a href="/Archive">Archive</a>
                                </li>
                        </div>
            </nav>
        </React.Fragment>
    )
}

export default Header
