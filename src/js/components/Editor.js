import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import AceEditor from 'react-ace'
import 'brace/theme/tomorrow'
import 'brace/mode/javascript'
import 'brace/mode/css'
import 'brace/snippets/javascript'
import 'brace/snippets/css'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'

const style = {
  border: '1px solid #EBEBEB',
  margin: 0,
  height: '100%',
  width: '100%',
  lineHeight: '150%'
}

const setOptions = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  showLineNumbers: true,
  tabSize: 2
}

@inject('AppStore')
@observer
export default class Editor extends Component {
  static propTypes = {
    AppStore: PropTypes.shape({
      source: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    const { source, onChangeSource, mode } = this.props.AppStore
    return (
      <AceEditor
        theme='tomorrow'
        value={source}
        onChange={onChangeSource}
        showGutter
        showPrintMargin
        highlightActiveLine
        editorProps={{
          $blockScrolling: Infinity
        }}
        {...{ mode, style, setOptions }}
      />
    )
  }
}
