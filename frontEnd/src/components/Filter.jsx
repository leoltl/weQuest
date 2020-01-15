import React from 'react';

import './Filter.scss'

const Filter = (props) => {
  console.log(props);
  const selectors = props.filters.map(filter => (
    <span className="search-page__filter-selector" onClick={() => props.setFilter(filter)}>
      {`${filter}`}
    </span>
  ))
  return (
    <div className="search-page__filter" >
      {selectors}
    </div>
  )
}

export default Filter;


