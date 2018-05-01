import React, { PropTypes } from 'react';
import Image from './image.redraft';
import Video from './video.redraft';
import HighlightJS from './highlightjs.redraft';

const typeMap = {
  image: Image,
  video: Video,
  'megadraft-codeblock-plugin': HighlightJS,
};

const AtomicBlock = ({ type, ...props }) => {
  const Component = typeMap[type];

  if (Component) {
    return <Component {...props} />;
  }

  return null;
};

AtomicBlock.propTypes = { type: PropTypes.string.isRequired };

export default AtomicBlock;
