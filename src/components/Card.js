import React from 'react';

function Card(props){
    if (props.value == 0){
        return (
            <div className={props.cardStyle}></div>
        );
    }
    return(
        <div className={props.cardStyle}>{props.value}</div>
    );
}

export default Card;