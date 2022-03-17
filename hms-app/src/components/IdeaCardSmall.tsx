import React from "react";
import favIcon from "../images/favIcon.png"

//lag of knowledge about property types in react so intellij suggest to create the prop import like that
function IdeaCardSmall(idea: { titel: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; description: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; favNumber: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }){
    return(
        <>
            <h3>{idea.titel}</h3>
            <p>{idea.description}</p>
            <div style={{display: "flex", gap: "5px"}}>
                <img src={favIcon} style={{width: "30px", height: "30px"}}/>
                <p>number of favs: {idea.favNumber}</p>
            </div>
        </>
    )
}

export default IdeaCardSmall