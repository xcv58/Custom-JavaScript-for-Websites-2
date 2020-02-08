import React, { useEffect } from 'react'
import { getHostKey, getHostName } from 'libs'
import Loading from 'components/Loading'
import queryString from 'query-string'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import { Button, Table, message, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'

const Host = props => {
  const key = getHostKey(props)
  const { isRegex, pattern } = props
  const query = isRegex ? { isRegex, pattern } : { domain: key }
  const to = {
    pathname: '/',
    search: queryString.stringify(query)
  }
  return <Link to={to}>{getHostName(props)}</Link>
}

const Regex = isRegex => {
  if (isRegex) {
    return 'Yes'
  }
  return 'No'
}

export default observer(props => {
  useEffect(() => {
    AppStore.init({})
  }, [])
  const { AppStore } = useStore()
  const { hosts, loading } = AppStore
  if (loading) {
    return <Loading />
  }

  const data = hosts.map(host => {
    return {
      host,
      isRegex: Boolean(host.isRegex)
    }
  })
  const columns = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: Host,
      sorter: (a, b) => {
        const aKey = getHostKey(a.host)
        const bKey = getHostKey(b.host)
        return aKey.localeCompare(bKey)
      }
    },
    {
      title: 'isRegex',
      dataIndex: 'isRegex',
      key: 'isRegex',
      render: Regex,
      sorter: (a, b) => a.isRegex - b.isRegex
    },
    {
      title: 'Action',
      key: 'action',
      render: ({ host, isRegex }) => {
        const name = getHostName(host)
        return (
          <Popconfirm
            title={`Are you sure delete this host: ${name}`}
            onConfirm={() => {
              AppStore.removeHost(host)
              message.success(`Successfully remove host: ${name}`)
            }}
            okText='Yes'
            cancelText='No'
          >
            <Button type='danger'>Delete</Button>
          </Popconfirm>
        )
      }
    }
  ]
  return <Table columns={columns} dataSource={data} />
})
