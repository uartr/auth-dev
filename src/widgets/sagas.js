import { call, put, takeLatest } from 'redux-saga/effects'
import { handleApiErrors } from '../lib/api-errors'
import {
  WIDGET_CREATING,
  WIDGET_REQUESTING,
} from './constants'

import {
  widgetCreateSuccess,
  widgetCreateError,
  widgetRequestSuccess,
  widgetRequestError,
} from './actions'

const widgetsUrl = `${process.env.REACT_APP_API_URL}/api/Clients`

function handleRequest (request) {
  return request
    .then(handleApiErrors)
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

function widgetCreateApi (client, widget) {
  const url = `${widgetsUrl}/${client.id}/widgets`
  const request = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: client.token.id || undefined, 
    },
    body: JSON.stringify(widget),
  })

  return handleRequest(request)
}

function* widgetCreateFlow (action) {
  try {
    const { client, widget } = action
    const createdWidget = yield call(widgetCreateApi, client, widget)
    yield put(widgetCreateSuccess(createdWidget))
  } catch (error) {
    yield put(widgetCreateError(error))
  }
}

function widgetRequestApi (client) {
  const url = `${widgetsUrl}/${client.id}/widgets`
  const request = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: client.token.id || undefined,
    },
  })

  return handleRequest(request)
}

function* widgetRequestFlow (action) {
  try {
    const { client } = action
    const widgets = yield call(widgetRequestApi, client)
    yield put(widgetRequestSuccess(widgets))
  } catch (error) {
    yield put(widgetRequestError(error))
  }
}

function* widgetsWatcher () {
  yield [
    takeLatest(WIDGET_CREATING, widgetCreateFlow),
    takeLatest(WIDGET_REQUESTING, widgetRequestFlow),
  ]
}

export default widgetsWatcher
