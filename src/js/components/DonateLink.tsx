import React, { Component } from 'react'
import Button from 'material-ui/Button'

export default class DonateLink extends Component {
  render () {
    const href = 'https://paypal.me/xcv58'
    return (
      <Button color='primary' href={href} target='_blank'>
        Donate
      </Button>
    )
  }
}
