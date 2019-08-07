import React from 'react'
import Button from '@material-ui/core/Button'

export default () => {
  const href = 'https://paypal.me/xcv58'
  return (
    <Button color='primary' href={href} target='_blank'>
      Donate
    </Button>
  )
}
