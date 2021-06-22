/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useGlobalFilter, useSortBy, useTable } from 'react-table';
import styled from 'styled-components';
import { media } from '../../utils/ui';
import { ToggleLineButton } from '../BaseComponents/Buttons';

const SortFilterBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1em;
  font-size: 0.85em;
`;

// both sort and filter use this unit as a wrapper
const BlockUnit = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  /* sort */
  &:first-child {
    /* wrap so that buttons are pushed to the next line in small screen */
    flex-wrap: wrap;

    /* sort text */
    p {
      /* display block so it doesn't get wrapped */
      display: block;
      margin: 0;
      margin-right: 0.5em;
      padding: 3px 0;
    }

    /* buttons container have to be flex to prevent button wrapped as multi-line  */
    div {
      display: flex;
    }
  }

  /* filter */
  &:last-child {
    justify-content: flex-end;
    align-items: flex-end;

    input {
      line-height: 1.9em;
      width: 225px;
      padding: 0 5px;
      border: none;
      border-bottom: 2px solid #333;

      :active, :focus {
        outline: none;
      }
    }

    ${media.small`
      /* this get wrapped in small screen so need margin */
      margin-top: 1.5em;
      /* center looks better */
      justify-content: center;
    `}
  }
`;

const FilterButton = styled(ToggleLineButton)`
`;

FilterButton.defaultProps = {
  color: '#333',
  hoverColor: '#fff',
  hoverBgColor: '#444',
};

const StyledTable = styled.table`
  /* this allows only table scroll in smallscreen */
  ${media.small`
    display: block;
    overflow-x: scroll;
  `}

  th {
    &:first-child {
      padding-left: 1em;
    }

    h4 {
      margin: 0;
    }
  }

  tr {
    :not(:nth-child(odd)) {
      background-color: #f4f4f4;
    }

    td {
      border: none;

      /* padding is removed in layout */
      &:first-child {
        padding-left: 1em;
      }

      &:last-child {
        padding-right: 1em;
      }
    }
  }
`;

// Define a default UI for filtering
const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
}) => (
  <input
    value={globalFilter || ''}
    onChange={(e) => {
      // Set undefined to remove the filter entirely
      setGlobalFilter(e.target.value || undefined);
    }}
    placeholder="type here to filter.."
  />
);

const Table = ({ defaultColumns, data }) => {
  // state used for highlight active button
  const [beingSorted, setBeingSorted] = useState('relevance');
  const [dataSet, setDataSet] = useState('relevance');

  // Use the state and functions returned from useTable to build your UI
  const {
    // for table
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
    // for sort
    columns,
    // for global filter
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns: defaultColumns,
      data: data[dataSet],
    },
    useGlobalFilter,
    useSortBy,
  );

  const sorters = {
    name: () => columns.find((x) => x.id === 'fullname').toggleSortBy(false),
    institution: () => columns.find((x) => x.id === 'institution').toggleSortBy(false),
    relevance: () => columns.forEach((x) => x.clearSortBy()),
    location: () => setDataSet('location'),
  };

  // Render the UI for your table
  return (
    <>
      <SortFilterBlock>
        <BlockUnit>
          <p>
            Sorted by:
          </p>
          <div>
            <FilterButton
              onClick={() => {
                setDataSet('relevance');
                setBeingSorted('relevance');
                sorters.relevance();
              }}
              active={beingSorted === 'relevance'}
            >
              Relevance
            </FilterButton>
            <FilterButton
              onClick={() => {
                setDataSet('relevance');
                setBeingSorted('name');
                sorters.name();
              }}
              active={beingSorted === 'name'}
            >
              Name
            </FilterButton>
            <FilterButton
              onClick={() => {
                setDataSet('relevance');
                setBeingSorted('institution');
                sorters.institution();
              }}
              active={beingSorted === 'institution'}
            >
              Institution
            </FilterButton>
            <FilterButton
              onClick={() => {
                setBeingSorted('location');
                sorters.location();
              }}
              active={beingSorted === 'location'}
            >
              Location
            </FilterButton>
          </div>
        </BlockUnit>
        <BlockUnit>
          <GlobalFilter
            setGlobalFilter={setGlobalFilter}
            globalFilter={state.globalFilter}
          />
        </BlockUnit>
      </SortFilterBlock>
      <StyledTable {...getTableProps()}>
        <thead>
          <tr>
            {headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </>
  );
};

export default Table;
