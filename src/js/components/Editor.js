import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import AceEditor from 'react-ace'
import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'

@inject('EditorStore')
@observer
export default class Editor extends Component {
  render () {
    const { EditorStore: { value, onChange } } = this.props
    return (
      <AceEditor
        mode='javascript'
        theme='tomorrow'
        value={value}
        onChange={onChange}
        style={{
          border: '1px solid #EBEBEB',
          margin: 0,
          height: 380,
          width: '100%',
          lineHeight: '150%'
        }}
        showGutter
        showPrintMargin
        highlightActiveLine
        wrapEnabled
        enableLiveAutocompletion
        enableBasicAutocompletion
        enableSnippets
        setOptions={{
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2
        }}
      />
    )
  }
}
