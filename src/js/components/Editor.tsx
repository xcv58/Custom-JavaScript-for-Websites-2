import React from 'react'
import AceEditor from 'react-ace'
import 'brace/theme/tomorrow'
import 'brace/mode/javascript'
import 'brace/mode/css'
import 'brace/snippets/javascript'
import 'brace/snippets/css'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
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
