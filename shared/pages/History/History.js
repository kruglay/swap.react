import React, { Component } from 'react'
import { connect } from 'redaction'
import actions from 'redux/actions'

import PageHeadline from 'components/PageHeadline/PageHeadline'
import Table from 'components/Table/Table'
import Filter from 'components/Filter/Filter'

import Row from './Row/Row'


const filterHistory = (items, filter) => {
  if (filter === 'SENT') {
    return items.filter(({ direction }) => direction === 'out')
  }

  if (filter === 'RECEIVED') {
    return items.filter(({ direction }) => direction === 'in')
  }

  return items
}

@connect(({ history: { transactions, filter } }) => ({
  items: filterHistory(transactions, filter),
}))
export default class History extends Component {

  componentDidMount() {
    actions.analytics.dataEvent('open-page-history')
    actions.user.setTransactions()
  }

  render() {
    const { items } = this.props

    const titles = [ 'Coin', 'Status', 'Amount' ]

    return (
      <section>
        <PageHeadline subTitle="History" />
        <Filter />
        <Table
          titles={titles}
          rows={items}
          rowRender={(row, index) => (
            <Row key={index} {...row} />
          )}
        />
      </section>
    )
  }
}
