import React from 'react';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

import { ReactComponent as LastArrowIcon } from 'assets/icons/icon-arrow-right-double-fill.svg';
import { ReactComponent as NextArrowIcon } from 'assets/icons/icon-arrow-right-fill.svg';
import PageNumberButton from 'StyledComponents/PageNumberButton';
import PaginationArrowButton from 'StyledComponents/PaginationArrowButton';

const TablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  backIconButtonProps,
  ...rest
}) => {
  const testId = backIconButtonProps?.testId;
  const placement = backIconButtonProps?.placement || 'top';
  const totalPages = Math.ceil(count / rowsPerPage);
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i++);

  const handleFirstPageButtonClick = event => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = event => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const handlePageNumberChange = pageNumber => event => {
    onPageChange(event, pageNumber);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        [placement === 'top' ? 'marginBottom' : 'marginTop']: '1.5rem',
        marginRight: '2rem',
        height: '4.2rem',
        alignItems: placement === 'top' ? 'flex-end' : 'flex-start',
        width: 'auto',
      }}
    >
      <PaginationArrowButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        data-testid={`${testId}-first-page`}
        rotation="180deg"
        iconHeight="1rem"
        iconWidth="1.5rem"
      >
        <SvgIcon component={LastArrowIcon} inheritViewBox />
      </PaginationArrowButton>
      <PaginationArrowButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        data-testid={`${testId}-previous-page`}
        rotation="180deg"
        iconHeight="0.5rem"
        iconWidth="1rem"
      >
        <SvgIcon component={NextArrowIcon} inheritViewBox />
      </PaginationArrowButton>
      {pagesArray
        ?.filter(
          pageIndex =>
            pageIndex >= page - 5 && (pageIndex < 5 || pageIndex <= page + 1)
        )
        ?.map(pageIndex => (
          <PageNumberButton
            key={`${testId}-page-${pageIndex}`}
            active={page === pageIndex}
            onClick={handlePageNumberChange(pageIndex)}
            placement={placement}
            data-testid={`${testId}-page-${pageIndex}`}
          >
            {pageIndex + 1}
          </PageNumberButton>
        ))}
      {totalPages > 5 && (
        <span
          style={{
            width: '1rem',
            [placement === 'top' ? 'borderBottom' : 'borderTop']:
              '1px solid #C9C9C9',
            padding: '0.25rem',
            [placement === 'top' ? 'paddingBottom' : 'paddingTop']: '0',
            fontSize: '1.5rem',
            lineHeight: '1.75',
          }}
        >
          ..
        </span>
      )}

      <PaginationArrowButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        data-testid={`${testId}-next-page`}
        rotation="0deg"
        iconHeight="0.5rem"
        iconWidth="1rem"
      >
        <SvgIcon component={NextArrowIcon} inheritViewBox />
      </PaginationArrowButton>
      <PaginationArrowButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        data-testid={`${testId}-last-page`}
        rotation="0deg"
        iconHeight="1rem"
        iconWidth="1.5rem"
      >
        <SvgIcon component={LastArrowIcon} inheritViewBox />
      </PaginationArrowButton>
    </Box>
  );
};

export default TablePaginationActions;
