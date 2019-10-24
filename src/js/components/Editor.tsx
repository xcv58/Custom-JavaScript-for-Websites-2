import React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/snippets/css'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-searchbox'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

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

export default observer(() => {
  const { source, onChangeSource, mode } = useStore().AppStore
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
})
