import React from 'react'
import actions from 'redux/actions'

import { NavLink } from 'react-router-dom'
import { links } from 'helpers'

import cssModules from 'react-css-modules'
import styles from './Nav.scss'


const nav = [
  { title: 'Orders', link: links.home },
  { title: 'Balances', link: links.balance },
  { title: 'History', link: links.history },
]

const Nav = () => (
  <div styleName="nav">
    {
      nav.map(({ title, link }) => (
        <NavLink
          exact
          key={title}
          styleName="link"
          to={link}
          activeClassName={styles.active}
        >
          {title}
        </NavLink>
      ))
    }
    {
      process.env.TESTNET && <div
        key="Get demo money"
        styleName="button"
        onClick={() => actions.user.getDemoMoney()}
      >
        Get demo money
      </div>
    }
  </div>
)

export default cssModules(Nav, styles)
