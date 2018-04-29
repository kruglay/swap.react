import React from 'react'
import proptypes from 'prop-types'

import CSSModules from 'react-css-modules'
import styles from './Head.scss'

const Head = ({ titles }) => (
    <thead>
        <tr>
        { titles.map((item, index) => 
            <th key={index}>
                <div styleName="table__headers">
                    <span styleName="table__titles">{ item }</span>
                    { item === 'RATING' || item === 'PRICE' ?
                        <span styleName="question">?</span> : ''
                    }
                </div>
            </th>
        ) }
        </tr>
    </thead>         
)

Head.proptypes = {

}

export default CSSModules(Head, styles)