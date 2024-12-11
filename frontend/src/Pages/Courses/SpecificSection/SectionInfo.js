import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { formatCredit, formatDateTime } from 'utils/helper';

const SectionInfo = ({ sectionDetails, StyledGridItem }) => {
  return (
    <>
      <Grid item xs="12" container>
        <StyledGridItem xs={2}>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
            }}
          >
            Course #:&nbsp;
          </Typography>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '600',
              color: '#383C49',
              fontSize: '1rem',
            }}
            data-testid="course-no"
          >
            {sectionDetails?.course_no}
          </Typography>
        </StyledGridItem>
        <StyledGridItem xs={5} sx={{ justifyContent: 'center' }}>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
            }}
            data-testid="section-no"
          >
            Section:&nbsp;
          </Typography>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '600',
              color: '#383C49',
              fontSize: '1rem',
            }}
          >
            {sectionDetails?.section_no +
              (sectionDetails?.course_suppl_cd ? '-' + sectionDetails?.course_suppl_cd : '')}

            {sectionDetails?.session_date?.start_date
              ? '/[' +
              formatDateTime(sectionDetails?.session_date?.start_date, 'MM/DD/YYYY') +
              (sectionDetails?.session_date?.end_date ? ' - ' : '') +
              formatDateTime(sectionDetails?.session_date?.end_date, 'MM/DD/YYYY') +
              ']'
              : null}
          </Typography>
        </StyledGridItem>
        <StyledGridItem xs={2} sx={{ justifyContent: 'center' }}>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
            data-testid="index-no"
          >
            Index:&nbsp;
          </Typography>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '600',
              color: '#383C49',
              fontSize: '1rem',
            }}
          >
            {sectionDetails?.reg_index_no}
          </Typography>
        </StyledGridItem>
        <StyledGridItem xs={2} sx={{ justifyContent: 'center' }}>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '400',
              color: '#383C49',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Credits:&nbsp;
          </Typography>
          <Typography
            variant="body1"
            component={'span'}
            sx={{
              fontWeight: '600',
              color: '#383C49',
              fontSize: '1rem',
            }}
            data-testid="credits"
          >
            {formatCredit(sectionDetails?.credits)}
          </Typography>
        </StyledGridItem>
      </Grid>
      <Grid
        item
        xs="12"
        sx={{ padding: '0 0.5rem 0.75rem', alignItems: 'center' }}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#383C49',
            fontSize: '1rem',
            margin: 0,
          }}
        >
          Title:
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1rem',
            margin: 0,
          }}
          data-testid="course-title"
        >
          {sectionDetails.course_title}
        </Typography>
      </Grid>
      <Grid
        item
        xs="12"
        sx={{ padding: '0.75rem 0.5rem', alignItems: 'center' }}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontWeight: '400',
            color: '#333333',
            fontSize: '1rem',
            margin: 0,
          }}
        >
          Sub-Title:
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1rem',
            margin: 0,
          }}
          data-testid="course-sub-title"
        >
          {sectionDetails.subtitle}
        </Typography>
      </Grid>
    </>
  );
};

export default SectionInfo;
