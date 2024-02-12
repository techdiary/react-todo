import React from 'react'
import renderer from 'react-test-renderer'
import App from '../App.js'

 
it('should take a snapshot', () => {
  const app = renderer.create(<App />)
  let appJSON = app.toJSON();
  expect(appJSON).toMatchSnapshot()
})