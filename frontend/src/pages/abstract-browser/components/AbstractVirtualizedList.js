import React from 'react';
import PropTypes from 'prop-types';
import { InfiniteLoader, List, WindowScroller } from 'react-virtualized';
import AbstractListItem from './AbstractListItem';

/**
 * AbstractVirtualizedList
 * @param {Object} props
 * @param {Boolean=} props.hasNextPage - whether there is next page to fetch
 * @param {Boolean=} props.isNextPageLoading - whether it is fetching next page
 * @param {import('..').SubmissionDataObj[]=} props.list - a list of submissions loaded
 * @param {Function=} props.loadNextPage - a function to fetch next page
 * @param {Number} props.parentHeight - height of the virtualizedList
 * @param {Number} props.parentWidth - width of the virtualizedList
 * @param {Function=} props.onPressItem - a callback function triggered on item pressed
 * @param {Boolean=} props.flushing - a flag to trigger force update virtualized list
 * @param {Function=} props.handleClickVote - a function to handle when clicking vote
 * @param {String[]=} props.myVotes - a list of submission ids this user votes for
 * @see
 * - https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md#examples
 * - https://github.com/bvaughn/react-virtualized/blob/master/docs/creatingAnInfiniteLoadingList.md
 */
const AbstractVirtualizedList = ({
  hasNextPage,
  isNextPageLoading,
  list,
  loadNextPage,
  parentWidth,
  onPressItem,
  flushing,
  handleClickVote,
  myVotes,
  timezone,
}) => {
  // when updating the whole data
  if (flushing) {
    return null;
  }

  const rowCount = hasNextPage ? list.length + 1 : list.length;
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  // Render a list item or a loading indicator.
  const rowRenderer = ({ index, key, style }) => {
    let content;

    if (!isRowLoaded({ index })) {
      content = null;
    } else {
      content = list[index];
    }

    return (
      <div
        key={key}
        style={{ ...style, display: 'flex', outline: 'none' }}
        onClick={() => (content ? onPressItem(index) : {})}
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
      >
        <AbstractListItem
          data={content}
          handleClickVote={(submissionId) => handleClickVote(submissionId)}
          isLiked={myVotes.includes(content?.submission_id)}
          timezone={timezone}
        />
      </div>
    );
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({
            height, isScrolling, scrollTop, onChildScroll,
          }) => (
            <List
              className="virtualized-list"
              style={{ margin: 'auto' }}
              height={height}
              ref={registerChild}
              onRowsRendered={onRowsRendered}
              rowRenderer={rowRenderer}
              rowCount={rowCount}
              rowHeight={125}
              width={parentWidth}
              // windowScroller
              autoHeight
              isScrolling={isScrolling}
              scrollTop={scrollTop}
              onScroll={onChildScroll}
            />
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  );
};

AbstractVirtualizedList.propTypes = {
  hasNextPage: PropTypes.bool,
  isNextPageLoading: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.object),
  loadNextPage: PropTypes.func,
  parentWidth: PropTypes.number.isRequired,
  onPressItem: PropTypes.func,
  flushing: PropTypes.bool,
  handleClickVote: PropTypes.func,
  myVotes: PropTypes.arrayOf(PropTypes.string),
  timezone: PropTypes.string.isRequired,
};

AbstractVirtualizedList.defaultProps = {
  hasNextPage: false,
  isNextPageLoading: false,
  list: [],
  loadNextPage: () => {},
  onPressItem: () => {},
  flushing: false,
  handleClickVote: () => {},
  myVotes: [],
};

export default AbstractVirtualizedList;
