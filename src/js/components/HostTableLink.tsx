import React from 'react'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <Link to='/list'>
      <Button color='primary'>Hosts Table</Button>
    </Link>
  )
}
