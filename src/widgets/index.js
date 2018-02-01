import React, { Component, PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'

import Messages from '../notifications/Messages'
import Errors from '../notifications/Errors'

import { widgetCreate, widgetRequest } from './actions'

const nameRequired = value => (value ? undefined : 'Name Required')

class Widgets extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    client: PropTypes.shape({
      id: PropTypes.string.isRequired,
      token: PropTypes.object.isRequired,
    }),
    widgets: PropTypes.shape({
      list: PropTypes.array,
      requesting: PropTypes.bool,
      successful: PropTypes.bool,
      messages: PropTypes.array,
      errors: PropTypes.array,
    }).isRequired,
    widgetCreate: PropTypes.func.isRequired,
    widgetRequest: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }
  constructor (props) {
    super(props)
    this.fetchWidgets()
  }

  fetchWidgets = () => {
    const { client, widgetRequest } = this.props
    if (client && client.token) return widgetRequest(client)
    return false
  }


  submit = (widget) => {
    const { client, widgetCreate, reset } = this.props
    widgetCreate(client, widget)
    reset()
  }

  renderNameInput = ({ input, type, meta: { touched, error } }) => (
    <div>
      <input
        {...input}
        type={type}
      />
      {touched && error && (
        <div style={{ color: '#cc7a6f', margin: '-10px 0 15px', fontSize: '0.7rem' }}>
          {error}
        </div>
        )
      }
    </div>
  )

  render () {
    const {
      handleSubmit,
      invalid,
      widgets: {
        list,
        requesting,
        successful,
        messages,
        errors,
      },
    } = this.props

    return (
      <div className="widgets">
        <div className="widget-form">
          <form onSubmit={handleSubmit(this.submit)}>
            <h1>CREATE THE WIDGET</h1>
            <label htmlFor="name">Name</label>
            <Field
              name="name"
              type="text"
              id="name"
              className="name"
              component={this.renderNameInput}
              validate={nameRequired}
            />
            <label htmlFor="description">Description</label>
            <Field
              name="description"
              type="text"
              id="description"
              className="description"
              component="input"
            />
            <label htmlFor="size">Size</label>
            <Field
              name="size"
              type="number"
              id="size"
              className="number"
              component="input"
            />
            <button
              disabled={invalid}
              action="submit"
            >CREATE</button>
          </form>
          <hr />
          <div className="widget-messages">
            {requesting && <span>Creating widget...</span>}
            {!requesting && !!errors.length && (
              <Errors message="Failure to create Widget due to:" errors={errors} />
            )}
            {!requesting && successful && !!messages.length && (
              <Messages messages={messages} />
            )}
          </div>
        </div>
        <div className="widget-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {list && !!list.length && (
                list.map(widget => (
                  <tr key={widget.id}>
                    <td>
                      <strong>{`${widget.name}`}</strong>
                    </td>
                    <td>
                      {`${widget.description}`}
                    </td>
                    <td>
                      {`${widget.size}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button onClick={this.fetchWidgets}>Refetch Widgets!</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  client: state.client,
  widgets: state.widgets,
})

const connected = connect(mapStateToProps, { widgetCreate, widgetRequest })(Widgets)
const formed = reduxForm({
  form: 'widgets',
})(connected)

export default formed
