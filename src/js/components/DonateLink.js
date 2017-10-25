import React, { Component } from 'react'
import Button from 'material-ui/Button'

export default class DonateLink extends Component {
  render () {
    const href = 'https://paypal.me/xcv58'
    return (
      <Button color='accent' href={href} target='_blank'>
        Donate
      </Button>
    )
  }
}
