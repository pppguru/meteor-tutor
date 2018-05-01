import React from 'react';

/**
 * PostLatestHeader stateless component.
 * @param {Object} data Data to be rendered by the stateless component.
 */
const PostLatestHeader = ({ ...data }) => {
  const { slug, headerImage, title, tutorName } = data.data;
  const doc = data.data;
  const divStyle = {
    background: `
      ${(headerImage !== null) && 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)'}),
      url("${headerImage || ''}")
    `,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  return (
    <section
      className="user-post-header-list-wrapper"
      style={divStyle}
    >
      <ul>
        <li>
          <h2>
            {title}
          </h2>
        </li>
        <li>
          <span>
            {tutorName && `By ${tutorName} on ${doc.formattedDate()}`}
          </span>
        </li>
        <li>
          <a href={`/blogposts/single/${slug}`}>{'Read More'}</a>
        </li>
      </ul>
    </section>
  );
};

export default PostLatestHeader;
