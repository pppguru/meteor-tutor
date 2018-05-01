import React, { Proptypes, Component } from 'react';
import hljs from 'highlight.js';

class HighlightJS extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    document.querySelectorAll('code').forEach((obj, i) => {
      hljs.highlightBlock(obj);
    });
  }
  render() {
    console.log(this.props);

    return (
      <pre>
        <code
          className={'megadraft-codeblock-plugin preview'}
          ref={c => this.code = c}
        >
          { this.props.code || '- NO CODE -'}
        </code>
      </pre>
    );
  }
}

export default HighlightJS;
