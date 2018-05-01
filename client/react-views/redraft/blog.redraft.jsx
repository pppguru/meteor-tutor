import React, { PropTypes } from 'react';
import redraft from 'redraft';

import List from './list.redraft';
import AtomicBlock from './atomicblock.redraft';

import './blog.style.css';

const styles = {
  code: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 20,
  },
};

const inline = {
  BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
  CODE: (children, { key }) => <span
    key={key}
    style={styles.code}
  >
    {
        children
      }
  </span>,
  ITALIC: (children, { key }) => <em key={key}>{children}</em>,
  UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
};

inline.BOLD.displayName = 'BOLD';
inline.ITALIC.displayName = 'ITALIC';
inline.UNDERLINE.displayName = 'UNDERLINE';
inline.CODE.displayName = 'CODE';

const addBreaklines = children => children.map((child, key) => [child, <br key={key} />]);

const getList = ordered =>
  (children, { depth, keys }) =>
    <List
      depth={depth}
      key={keys[0]}
      keys={keys}
      ordered={ordered}
    >
      {children.map((child, index) => <li key={keys[index]} >{child}</li>)}
    </List>

  ;

const getAtomic = (children, { data, keys }) => data.map(
  (item, index) =>
    <AtomicBlock
      key={keys[index]}
      {...data[index]}
    />
);

/**
 * Note that children can be maped to render a list or do other cool stuff
 */
const blocks = {

  /**
   * Rendering blocks like this along with cleanup results in a single p tag for each paragraph
   * adding an empty block closes current paragraph and starts a new one
   * @param  {[type]} children [description]
   * @param  {[type]} keys     [description]
   * @return {[type]}          [description]
   */
  atomic: getAtomic,
  blockquote: (children, { keys }) =>
    <blockquote key={keys[0]} >{addBreaklines(children)}</blockquote>,
  'code-block': (children, { keys }) =>
    <pre
      key={keys[0]}
      style={styles.codeBlock}
    >
      {
        addBreaklines(children)
      }
    </pre>,
  'header-five': (children, { keys }) => children.map((child, index) => <h5 key={keys[index]}>{child}</h5>),
  'header-four': (children, { keys }) => children.map((child, index) => <h4 key={keys[index]}>{child}</h4>),
  'header-one': (children, { keys }) => children.map((child, index) => <h1 key={keys[index]}>{child}</h1>),
  'header-six': (children, { keys }) => children.map((child, index) => <h6 key={keys[index]}>{child}</h6>),
  'header-three': (children, { keys }) => children.map((child, index) => <h3 key={keys[index]}>{child}</h3>),
  'header-two': (children, { keys }) => children.map((child, index) => <h2 key={keys[index]}>{child}</h2>),
  'ordered-list-item': getList(true),
  'unordered-list-item': getList(),
  unstyled: (children, { keys }) =>
    <p key={keys[0]}>{addBreaklines(children)}</p>,
};

blocks.unstyled.displayName = 'unstyled';
blocks.atomic.displayName = 'atomic';
blocks.blockquote.displayName = 'blockquote';
blocks['header-six'].displayName = 'header-six';
blocks['header-five'].displayName = 'header-five';
blocks['header-four'].displayName = 'header-four';
blocks['header-three'].displayName = 'header-three';
blocks['header-two'].displayName = 'header-two';
blocks['header-one'].displayName = 'header-one';
blocks['code-block'].displayName = 'code-block';
blocks['unordered-list-item'].displayName = 'unordered-list-item';
blocks['ordered-list-item'].displayName = 'ordered-list-item';

const entities = {
  LINK: (children, entity, { key }) =>
    <a
      href={entity.url}
      key={key}
    >
      {children}
    </a>,
};

entities.LINK.displayName = 'LINK';


const isEmptyRaw = raw => !raw || !raw.blocks || (raw.blocks.length === 1 && raw.blocks[0].text === '');

const options = {
  cleanup: {
    after: 'all',
    split: true,
    types: 'all',
  },
};

const BlogPreview = ({ raw }) => {
  const isEmpty = isEmptyRaw(raw);

  window.redraft = redraft;

  return (
    <div className="BlogPreview">
      {
        isEmpty && <div className="BlogPreview-empty">{'There\'s nothing to render...'}</div>
      }
      {
        !isEmpty && redraft(raw, { blocks, entities, inline }, options)
      }
    </div>
  );
};

BlogPreview.propTypes = {
  raw: PropTypes.shape({
    blocks: PropTypes.array.isRequired, // eslint-disable-line react/no-unused-prop-types
    entityMap: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
  }).isRequired,
};
export default BlogPreview;
