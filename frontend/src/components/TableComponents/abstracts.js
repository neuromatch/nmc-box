/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { media, basedStyles, growOverParentPadding } from '../../styles';
import { ToggleLineButton, ButtonWithLinkStyle } from '../BaseComponents/Buttons';

const SortFilterBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1em;
  font-size: 0.85em;
`;

// both sort and filter use this unit as a wrapper
const BlockUnit = styled.div`
  display: flex;
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

    input {
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

const TableContainer = styled.div`
  ${media.small`
    ${growOverParentPadding(96)}
  `}
  ${basedStyles.scrollStyle}

  display: block;
  overflow: auto;

  max-height: 400px;
  margin-bottom: 15px;
`;

const StyledTable = styled.table`
  thead th {
    background-color: #fff;
    position: sticky;
    top: 0;
  }

  th {
    &:first-child {
      padding-left: 1em;
      text-align: center;
    }

    h4 {
      margin: 0;
    }

    /* control column width */
    &:nth-child(2),
    &:nth-child(3) {
      min-width: 220px;

      ${media.small`
        min-width: 140px;
      `}
    }

    &:nth-child(4) {
      min-width: 320px;
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

        /* to align with status emoji */
        text-align: center;
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

const Table = ({ defaultColumns, data, handleTitleClick }) => {
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
      data,
    },
    useGlobalFilter,
    useSortBy,
  );

  // state used for highlight active button
  const [beingSorted, setBeingSorted] = useState('number');

  const sorters = {
    author: () => columns.find((x) => x.id === 'fullname').toggleSortBy(false),
    affiliation: () => columns.find((x) => x.id === 'institution').toggleSortBy(false),
    number: () => columns.forEach((x) => x.clearSortBy()),
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
                setBeingSorted('#');
                sorters.number();
              }}
              type="button"
              active={beingSorted === '#'}
            >
              #
            </FilterButton>
            <FilterButton
              onClick={() => {
                setBeingSorted('author');
                sorters.author();
              }}
              type="button"
              active={beingSorted === 'author'}
            >
              Author
            </FilterButton>
            <FilterButton
              onClick={() => {
                setBeingSorted('affiliation');
                sorters.affiliation();
              }}
              type="button"
              active={beingSorted === 'affiliation'}
            >
              Affiliation
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
      <TableContainer>
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
                  {row.cells.map((cell) => {
                    // render a clickable instead in title column
                    if (cell.column.id === 'title') {
                      return (
                        <td {...cell.getCellProps()}>
                          <ButtonWithLinkStyle
                            type="button"
                            onClick={() => handleTitleClick(cell.row.index)}
                          >
                            {cell.render('Cell')}
                          </ButtonWithLinkStyle>
                        </td>
                      );
                    }

                    // else render normal text
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      </TableContainer>
    </>
  );
};

export default Table;
