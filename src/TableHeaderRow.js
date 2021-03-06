import React from 'react'
import PropTypes from 'prop-types'
import { TableConsumer } from './TableContext'

export class TableHeaderRow extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.element, PropTypes.func])
      ),
      PropTypes.element
    ]),
    component: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
      PropTypes.string
    ])
  }
  render() {
    const { children, component } = this.props
    return (
      <TableConsumer>
        {tableProps => {
          return (
            <React.Fragment>
              <HeaderData
                {...this.props}
                setHeaderData={tableProps ? tableProps.setHeaderData : null}
              />
              {component
                ? React.createElement(component, this.props)
                : children}
            </React.Fragment>
          )
        }}
      </TableConsumer>
    )
  }
}

export class HeaderData extends React.Component {
  state = {
    columns:
      React.Children.map(this.props.children, ({ props }) => ({
        ...props,
        accessor: props.accessor || false,
        label: props.children,
        sortable: props.sortable || false,
        filterable: props.filterable || false
      })) || [],
    shouldUpdateParent: true
  }

  setParentData = () => {
    const { setHeaderData } = this.props
    // TODO: warn when setHeaderData is null/undefined, not a nested cmp

    this.setState(
      { shouldUpdateParent: false },
      () => setHeaderData && setHeaderData({ columns: this.state.columns })
    )
  }

  componentDidMount() {
    this.state.shouldUpdateParent && this.setParentData()
  }

  render() {
    return null
  }
}
