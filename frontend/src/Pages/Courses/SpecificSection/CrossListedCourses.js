import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import LightTooltip from 'StyledComponents/LightTooltip';
import StyledBadge from 'StyledComponents/StyledBadge';

const CrossListedCourses = ({ sectionDetails }) => {
  const preRequisite =
    sectionDetails.prerequisite_course?.expr?.split(' ') || [];

  return (
    <Grid container>
      <Grid
        item
        xs="6"
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
          Crosslisted Courses:
        </Typography>
        {sectionDetails.cross_listings?.length > 0 ? (
          <LightTooltip
            placement="right-start"
            arrow
            title={
              <>
                {sectionDetails?.cross_listings?.map(item => (
                  <p style={{ margin: 0, marginBottom: '0.25rem' }}>{item}</p>
                ))}
              </>
            }
            data-testid="crosslisted-courses-tooltip"
          >
            <Typography
              variant="body1"
              component={'span'}
              sx={{
                fontWeight: '600',
                color: '#333333',
                fontSize: '1rem',
                margin: 0,
              }}
              data-testid="crosslisted-courses"
            >
              {sectionDetails.cross_listings?.[0]}
              {sectionDetails.cross_listings?.length > 1 && '...'}&nbsp;
              <StyledBadge data-testid="crosslisted-courses-count">
                {sectionDetails.cross_listings?.length}
              </StyledBadge>
            </Typography>
          </LightTooltip>
        ) : (
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
              margin: 0,
            }}
            data-testid="crosslisted-courses"
          >
            --N/A--
          </Typography>
        )}
      </Grid>
      <Grid
        item
        xs="6"
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
          CMS Type:
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
          data-testid="cmp-type-cd"
        >
          {sectionDetails.cms_type_cd || '--N/A--'}
        </Typography>
      </Grid>
      <Grid
        item
        xs="6"
        sx={{ padding: '0.5rem 0.5rem 0.75rem', alignItems: 'center' }}
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
          Prerequisite:
        </Typography>
        {sectionDetails.prerequisite_course?.unique_course > 0 ? (
          <LightTooltip
            placement="right-start"
            arrow
            title={
              <>
                {preRequisite?.map((item, index) => (
                  <p
                    key={`${item}-${index}`}
                    style={{ margin: 0, marginBottom: '0.25rem' }}
                  >
                    {item?.replace(/[()]/g, '')}
                  </p>
                ))}
              </>
            }
            data-testid="courses-prerequisite-tooltip"
          >
            <Typography
              variant="body1"
              component="span"
              sx={{
                fontWeight: '600',
                color: '#333333',
                fontSize: '1rem',
                margin: 0,
              }}
              data-testid="courses-prerequisite"
            >
              {preRequisite[0]}
              {sectionDetails.prerequisite_course?.unique_course > 1 && '...'}
              &nbsp;
              <StyledBadge data-testid="courses-prerequisite-count">
                {sectionDetails.prerequisite_course?.unique_course}
              </StyledBadge>
            </Typography>
          </LightTooltip>
        ) : (
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: '600',
              color: '#333333',
              fontSize: '1rem',
              margin: 0,
            }}
            data-testid="courses-prerequisite"
          >
            --N/A--
          </Typography>
        )}
      </Grid>
      <Grid
        item
        xs="6"
        sx={{ padding: '0.5rem 0.5rem 0.75rem', alignItems: 'center' }}
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
          Online Course Type:
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
          data-testid="courses-type-cd"
        >
          {sectionDetails.course_type_cd || '--N/A--'}
        </Typography>
      </Grid>
      <Grid
        item
        xs="6"
        sx={{ padding: '0.5rem 0.5rem 0.75rem', alignItems: 'center' }}
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
          Course Sup:
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
          data-testid="courses-suppl-cd"
        >
          {sectionDetails.course_suppl_cd || '--N/A--'}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CrossListedCourses;
