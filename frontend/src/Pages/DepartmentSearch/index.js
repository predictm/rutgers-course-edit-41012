import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import Button from 'Components/Button';
import FormInput from 'Components/FormInput';
import { useDepartmentQueries } from 'services/queries';
import NotificationBar from 'Components/NotificationBar';
import { useAppContext } from 'context/AppContext';

import './styles.scss';

const SearchButton = styled(Button)({
  width: 'auto',
  borderRadius: '100px',
  marginTop: '1.25rem',
  span: {
    margin: 0,
  },
});

const SearchInput = styled(FormInput)({
  '& .MuiInputBase-input': {
    borderRadius: '100px',
  },
});

const DepartmentSearch = () => {
  const { unreadNotificationList } = useAppContext();
  const [searchQuery, setSearchData] = useState({ unit: '', subject: '' });
  const { unit, subject } = searchQuery;
  const [newSearch, setNewSearch] = useState(true);
  const { data: searchResult, refetch } =
    useDepartmentQueries.useDepartmentSearchQuery({ payload: searchQuery });
  const departmentInfo = searchResult?.data;

  const handleInputChange = e => {
    const { name, value } = e.target;

    setNewSearch(true);
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    unit && subject && refetch?.();
    setNewSearch(false);
  };

  const renderItem = (label, value) => {
    return (
      <Grid item xs="4">
        <Typography
          paragraph
          variant="subtitle2"
          sx={{
            fontWeight: '400',
            color: '#383C49',
            fontSize: '1rem',
            margin: 0,
          }}
        >
          {label}:
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#383C49',
            fontSize: '1rem',
            margin: 0,
          }}
          data-testid={`department-search-${label}`}
        >
          {value || '---'}
        </Typography>
      </Grid>
    );
  };
  const renderResults = () => {
    if (!departmentInfo) {
      return null;
    }

    const { department, offering_unit: unitInfo } = departmentInfo || {};
    return Object.keys(department || {})?.length > 0 ? (
      <>
        <Typography
          variant="h6"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1.5rem',
          }}
          data-testid="department-search-department-name"
        >
          {department?.subj_descr}
        </Typography>
        <Grid container spacing={2} ml={0} mt={0} className="department-info">
          {renderItem('Unit', unitInfo?.offering_unit_cd)}
          {renderItem('Subject', department?.subj_cd)}
          {renderItem('Phone', department?.phone)}
          {renderItem('Website', department?.url)}
          {renderItem('School', department?.campus)}
        </Grid>
      </>
    ) : (
      <>
        <Typography
          variant="h6"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#333333',
            fontSize: '2.25rem',
            margin: 0,
          }}
          data-testid="department-search-no-results"
        >
          No Results Found
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1.5rem',
            margin: 0,
          }}
        >
          Please try new search by entering the School and Department Number
        </Typography>
      </>
    );
  };

  return (
    <div className="department-search">
      <Typography
        variant="h4"
        paragraph
        sx={{ fontWeight: '300', color: '#333333', fontSize: '3.25rem' }}
      >
        Department Search
      </Typography>
      {/* {unreadNotificationList?.length > 0 && (
        <NotificationBar notificationInfo={unreadNotificationList?.[0]} />
      )} */}
      <div className="department-search-form">
        <div className="department-search-form__grid">
          <div className="department-search-form__grid__item">
            <SearchInput
              label="Unit"
              placeholder="##"
              value={unit}
              onChange={handleInputChange}
              name="unit"
              required
              testId="department-search-unit"
            />
          </div>
          <div className="department-search-form__grid__item">
            <SearchInput
              label="Subject"
              placeholder="###"
              value={subject}
              name="subject"
              onChange={handleInputChange}
              required
              testId="department-search-subject"
            />
          </div>
          <div className="department-search-form__grid__item-action">
            <SearchButton
              startIcon={<SearchOutlinedIcon />}
              className="black-btn"
              disabled={!(unit && subject)}
              onClick={handleSearch}
              testId="department-search-btn"
            />
          </div>
        </div>
        <div className="department-search-form__results">
          {!(unit && subject) || newSearch ? (
            <Typography
              variant="h6"
              paragraph
              sx={{
                fontWeight: '600',
                color: '#333333',
                fontSize: '1.5rem',
                margin: 0,
              }}
            >
              Enter the School and Department Number
            </Typography>
          ) : (
            renderResults()
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentSearch;
