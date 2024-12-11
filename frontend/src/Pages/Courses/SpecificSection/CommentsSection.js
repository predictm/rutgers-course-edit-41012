import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

import { ReactComponent as CommentsIcon } from 'assets/icons/icon-comment.svg';
import Button from 'Components/Button';
import HorizontalDivider from 'Components/HorizontalDivider';
import FormTextarea from 'Components/FormTextarea';
import { useCoursesMutation } from 'services/mutations';
import { sortComments } from 'utils/common';
import { getUserNameTags } from 'utils/helper';
import CommentsModal from '../CommentsModal';
//import SwitchInput from 'Components/SwitchInput';

const CommentsSection = ({
  commentsList,
  sectionDetails,
  refetchCourseSectionDetails,
}) => {
  //const [hideFromUnits, setHideFromUnits] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMoreComments, setShowMoreComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const addComments = useCoursesMutation.useAddCommentsMutation();

  const showModal = () => setShowMoreComments(true);
  const hideModal = () => setShowMoreComments(false);

  const handleCommentsChange = e => {
    if (e?.target?.value?.length < 500) {
      setCommentText(e?.target?.value);
    }
  };

  /*const handleCheckboxToggle = () => {
    setHideFromUnits(!hideFromUnits);
  };*/

  const handleAddComments = async () => {
    if (!commentText) return;

    try {
      setLoading(true);
      await addComments.mutateAsync({
        course_section: sectionDetails?.id,
        text: commentText,
        mention_users: getUserNameTags(commentText),
      });
      toast.success('Successfully added comment.',{
        hideProgressBar: true,
      });
      setCommentText('');
      refetchCourseSectionDetails?.();
    } catch (e) {
      toast.error(
        'An error occurred while adding comment. Please try again later.',{
          hideProgressBar: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={1} sx={{ marginTop: '2rem' }}>
      <Grid item xs="12">
        <Typography
          variant="h3"
          paragraph
          sx={{
            fontWeight: '600',
            color: '#333333',
            fontSize: '1.5rem',
            alignItems: 'center',
            display: 'flex',
            gap: '1.5rem',
          }}
        >
          <CommentsIcon style={{ height: '2.625rem', width: '3.05rem' }} />
          <span>
            Comments
            <span
              style={{ color: '#333333', fontSize: '1rem', fontWeight: '500' }}
            >
              &nbsp;({commentsList?.length})
            </span>
          </span>
        </Typography>
      </Grid>
      {sortComments(commentsList)
        ?.slice(0, 2)
        ?.map((comment, i) => {
          const commentDate = comment?.modified_at || comment?.created_at;
          return (
            <Grid
              item
              xs="12"
              key={comment?.id}
              sx={
                i > 0
                  ? {
                      borderTop: '1px dashed #C9C9C9',
                    }
                  : null
              }
            >
              <Typography variant="subtitle" paragraph sx={{ margin: 0 }}>
                <Typography
                  variant="subtitle"
                  component="span"
                  sx={{
                    fontWeight: '600',
                    color: '#383C49',
                    fontSize: '1.125rem',
                  }}
                  data-testid={`comment-${i}-username`}
                >
                  {comment?.username}
                </Typography>
                <Typography
                  variant="subtitle"
                  component="span"
                  sx={{
                    fontWeight: '300',
                    fontStyle: 'italic',
                    color: '#383C49',
                    fontSize: '1rem',
                  }}
                  data-testid={`comment-${i}-date`}
                >
                  &nbsp;-&nbsp;
                  {commentDate
                    ? moment.utc(commentDate).tz(moment.tz.guess()).fromNow()
                    : ''}
                </Typography>
              </Typography>
              <Typography
                variant="subtitle"
                paragraph
                sx={{
                  fontWeight: '400',
                  color: '#383C49',
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                }}
                data-testid={`comment-${i}-text`}
              >
                {comment?.text}
              </Typography>
            </Grid>
          );
        })}
      {commentsList?.length > 2 && (
        <Grid
          item
          container
          xs="12"
          spacing={1}
          sx={{ alignItems: 'center', marginBottom: '0.5rem' }}
        >
          <Grid xs item>
            <HorizontalDivider color="#C9C9C9" borderStyle="dashed" />
          </Grid>
          <Grid xs="auto" item>
            <Typography
              variant="subtitle"
              component="span"
              sx={{
                fontWeight: '300',
                fontStyle: 'italic',
                color: '#0071E3',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
              onClick={showModal}
              data-testid={`comment-view-more`}
            >
              View All Comments
            </Typography>
          </Grid>
        </Grid>
      )}
      <Grid xs="12" item>
        <FormTextarea
          onChange={handleCommentsChange}
          value={commentText}
          testId="new-comment-text"
        />
      </Grid>
      {/*
      <Grid xs="12" item>
        <SwitchInput
          label="Hide from unit"
          checked={hideFromUnits}
          onChange={handleCheckboxToggle}
          controlSx={{ '.MuiSwitch-track': { backgroundColor: '#707070' } }}
        />
      </Grid>
          */}
      <Grid
        item
        xs="12"
        sx={{
          marginTop: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <Button
          label="Add Comment"
          className="black-btn full-width"
          onClick={handleAddComments}
          loading={loading}
          testId="add-comment-btn"
        />
      </Grid>
      {showMoreComments && (
        <CommentsModal
          open={showMoreComments}
          onClose={hideModal}
          sectionDetails={sectionDetails}
          commentsList={commentsList}
          refetchCourseSectionDetails={refetchCourseSectionDetails}
        />
      )}
    </Grid>
  );
};

export default CommentsSection;
