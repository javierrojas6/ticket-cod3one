import React from 'react';
import classNames from 'classnames';
import { isIE } from 'lib-core/navigator';
import Base64ImageParser from 'lib-core/base64-image-parser';

let ReactQuillComponent = null;
let QuillInstance = null;
let quillLoader = null;
let quillModulesRegistered = false;

const loadQuillEditor = () => {
  if (ReactQuillComponent && QuillInstance) {
    return Promise.resolve({ ReactQuillComponent, QuillInstance });
  }

  if (!quillLoader) {
    quillLoader = Promise.all([
      import('react-quill'),
      import('quill-image-resize-module-react'),
      import('quill-magic-url')
    ]).then(([reactQuillModule, imageResizeModule, magicUrlModule]) => {
      const loadedReactQuill = reactQuillModule.default || reactQuillModule;
      const loadedQuill = reactQuillModule.Quill || loadedReactQuill.Quill;
      const imageResize = imageResizeModule.default || imageResizeModule;
      const magicUrl = magicUrlModule.default || magicUrlModule;

      if (!quillModulesRegistered) {
        loadedQuill.register('modules/ImageResize', imageResize);
        loadedQuill.register('modules/magicUrl', magicUrl);
        quillModulesRegistered = true;
      }

      ReactQuillComponent = loadedReactQuill;
      QuillInstance = loadedQuill;

      return { ReactQuillComponent, QuillInstance };
    });
  }

  return quillLoader;
};

class TextEditor extends React.Component {
  static propTypes = {
    errored: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
    allowImages: React.PropTypes.bool
  };

  static createEmpty() {
    return '';
  }

  static getEditorStateFromHTML(htmlString) {
    return htmlString;
  }

  static getHTMLFromEditorState(editorState) {
    return editorState;
  }

  static isEditorState(editorState) {
    return typeof editorState === 'String';
  }

  static getContentFormData(content) {
    const images = Base64ImageParser.getImagesSrc(content).map(Base64ImageParser.dataURLtoFile);
    const contentFormData = {
      content: Base64ImageParser.removeImagesSrc(content),
      images: images.length
    };

    images.forEach((image, index) => (contentFormData[`image_${index}`] = image));

    return contentFormData;
  }

  state = {
    value: this.props.value,
    focused: false,
    quillReady: isIE()
  };

  componentDidMount() {
    if (!isIE()) {
      this.loadQuillEditor();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  loadQuillEditor() {
    return loadQuillEditor().then(() => {
      if (!this.unmounted) {
        this.setState({ quillReady: true });
      }
    });
  }

  render() {
    return (
      <div className={this.getClass()} onPaste={this.onPaste.bind(this)}>
        {isIE() || !this.state.quillReady ? this.renderTextArea() : this.renderQuill()}
      </div>
    );
  }

  renderQuill() {
    return <ReactQuillComponent {...this.getEditorProps()} />;
  }

  renderTextArea() {
    return (
      <textarea
        className="text-editor__editor"
        onChange={this.onEditorChange.bind(this)}
        onFocus={this.onEditorFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        ref="editor"
        value={this.props.value}
      />
    );
  }

  getClass() {
    let classes = {
      'text-editor': true,
      'text-editor_errored': this.props.errored,
      'text-editor_focused': this.state.focused,
      'text-editor_textarea': isIE(),

      [this.props.className]: this.props.className
    };

    return classNames(classes);
  }

  getEditorProps() {
    return {
      className: 'text-editor__editor',
      value: this.props.value !== undefined ? this.props.value : this.state.value,
      ref: 'editor',
      modules: this.getModulesOptions(),
      onChange: this.onEditorChange.bind(this),
      onFocus: this.onEditorFocus.bind(this),
      onBlur: this.onBlur.bind(this),
      onKeyDown: (e) => {
        if (e.key == 'Tab') {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
  }

  getModulesOptions() {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ align: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          this.props.allowImages ? ['link', 'image'] : ['link']
        ]
      },
      ImageResize: { parchment: QuillInstance.import('parchment') },
      magicUrl: true
    };
  }

  onEditorChange(value) {
    if (isIE()) value = value.target.value;
    if (this.props.value === undefined) this.setState({ value });

    if (this.props.onChange) {
      this.props.onChange({ target: { value } });
    }
  }

  onEditorFocus(event) {
    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  onBlur(event) {
    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  onPaste(event) {
    let items = event.nativeEvent && event.nativeEvent.clipboardData.items;

    for (let index in items) {
      let item = items[index];
      if (item.kind === 'file') {
        event.preventDefault();
        let blob = item.getAsFile();
        let reader = new FileReader();
        reader.onload = (event) => {
          this.props.onChange({
            target: {
              value: this.props.value + `<img src="${event.target.result}" />`
            }
          });
        };
        reader.readAsDataURL(blob);
      }
    }
  }

  focus() {
    if (this.refs.editor) {
      this.refs.editor.focus();
    }
  }
}

export default TextEditor;
