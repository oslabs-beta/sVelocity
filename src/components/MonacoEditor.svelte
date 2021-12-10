<script>
  import { onMount, onDestroy } from 'svelte'
  import * as monaco from 'monaco-editor';
  let editor
  onMount(mountEditor)
  function mountEditor() {
      editor = monaco.editor.create(document.getElementById('monaco-container'), {
        value: [
          'function x() {',
          '\tconsole.log("Hello world!");',
          '}'
        ].join('\n'),
        language: 'js',
      });
  }
  onDestroy(() => {
    if (editor) {
      editor.dispose();
      const model = editor.getModel();
      if (model) model.dispose();
    }
  })
</script>


<div id="monaco-container"></div>
