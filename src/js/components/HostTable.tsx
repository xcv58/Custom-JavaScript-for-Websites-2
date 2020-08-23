import React, { useEffect, useState } from 'react'
import { getHostKey, getHostName } from 'libs'
import Loading from 'components/Loading'
import queryString from 'query-string'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import { Affix, Button, Table, message, PageHeader, Popconfirm } from 'antd'
import { Link, useHistory } from 'react-router-dom'

const Host = (props) => {
  const key = getHostKey(props)
  const { isRegex, pattern } = props
  const query = isRegex ? { isRegex, pattern } : { domain: key }
  const to = {
    pathname: '/',
    search: queryString.stringify(query)
  }
  return <Link to={to}>{getHostName(props)}</Link>
}

const Regex = (isRegex) => {
  if (isRegex) {
    return 'Yes'
  }
  return 'No'
}

export default observer((props) => {
  useEffect(() => {
    AppStore.init({})
  }, [])
  const history = useHistory()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
  }

  const { AppStore } = useStore()
  const { hosts, loading } = AppStore
  if (loading) {
    return <Loading />
  }

  const data = hosts.map((host) => {
    return {
      key: getHostKey(host),
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
      render: ({ host }) => {
        const name = getHostName(host)
        return (
          <Popconfirm
            title={`Are you sure delete this host: ${name}`}
            onConfirm={() => {
              AppStore.removeHost({ host })
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
  const hasSelected = selectedRowKeys.length > 0
  return (
    <div style={{ overflow: 'scroll', height: '100vh' }}>
      <Affix offsetTop={0.01}>
        <PageHeader
          ghost={false}
          onBack={() => history.goBack()}
          title='All Hosts & Patterns'
          extra={
            <>
              <span style={{ marginLeft: 8 }}>
                {hasSelected
                  ? `Selected ${selectedRowKeys.length} host${
                      selectedRowKeys.length > 1 ? 's' : ''
                    }`
                  : ''}
              </span>
              <Popconfirm
                disabled={!hasSelected}
                title={`Are you sure delete all selected host${
                  selectedRowKeys.length > 1 ? 's' : ''
                }`}
                onConfirm={() => {
                  const toDelete = new Set(selectedRowKeys)
                  data
                    .filter((x) => toDelete.has(x.key))
                    .map((x) => x.host)
                    .forEach((host) => AppStore.removeHost({ host }))
                  message.success(
                    `Successfully remove all selected host${
                      selectedRowKeys.length > 1 ? 's' : ''
                    }`
                  )
                }}
                okText='Yes'
                cancelText='No'
              >
                <Button type='danger' disabled={!hasSelected}>
                  Delete
                </Button>
              </Popconfirm>
            </>
          }
        />
      </Affix>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={data}
        pagination={false}
      />
    </div>
  )
})
