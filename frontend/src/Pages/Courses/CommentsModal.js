import React, { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import Button from 'Components/Button';
import FormTextarea from 'Components/FormTextarea';
import { useCoursesMutation } from 'services/mutations';
import { sortComments } from 'utils/common';
import { getUserNameTags } from 'utils/helper';
import SimpleModal from 'Components/SimpleModal';

const CommentsModal = ({
  open,
  onClose,
  commentsList,
  sectionDetails,
  refetchCourseSectionDetails,
}) => {
  const addCommentRef = useRef();
  const [commentText, setCommentText] = useState('');
  const [commentFormHeight, setCommentFormHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const addComments = useCoursesMutation.useAddCommentsMutation();

  useEffect(() => {
    setCommentFormHeight(addCommentRef?.current?.clientHeight);
  }, [addCommentRef?.current?.clientHeight]);

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
    <SimpleModal open={open} onClose={onClose}>
      <Grid
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
          padding: '2rem',
        }}
      >
        <Grid container ref={addCommentRef}>
          <Grid
            container
            item
            xs="12"
            justifyContent="space-between"
            alignItems="center"
            sx={{ borderBottom: '2px solid #C9C9C9' }}
          >
            <Grid item>
              <Typography
                variant="h2"
                sx={{
                  color: '#383C49',
                  fontSize: '2rem',
                  fontWeight: '400',
                }}
                data-testid="comments-modal-course-info"
              >
                Comments - {sectionDetails?.offering_unit}&nbsp;:&nbsp;
                {sectionDetails?.subj_cd}&nbsp;:&nbsp;
                {sectionDetails?.course_no}&nbsp;:&nbsp;
                {sectionDetails?.section_no}
              </Typography>
            </Grid>
            <Grid item>
              <CloseIcon
                onClick={onClose}
                style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
                data-testid="comments-modal-close-icon"
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs="12"
            justifyContent="space-between"
            alignItems="center"
            sx={{ margin: '2rem 0' }}
          >
            <FormTextarea
              onChange={handleCommentsChange}
              value={commentText}
              label={
                <>
                  <Typography
                    variant="subtitle"
                    component="span"
                    sx={{
                      color: '#383C49',
                      fontSize: '2rem',
                      fontWeight: '400',
                    }}
                  >
                    New Comment
                  </Typography>
                  <Typography
                    variant="subtitle"
                    component="span"
                    sx={{
                      color: '#333333',
                      fontSize: '1rem',
                      fontWeight: '400',
                      fontStyle: 'italic',
                    }}
                  >
                    &nbsp;~&nbsp;max 500 characters
                  </Typography>
                </>
              }
              sx={{
                'label + &': {
                  marginTop: '2.725rem',
                },
              }}
              testId="comments-modal-new-comment-text"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              paddingBottom: '2rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            }}
          >
            <Button
              className="black-btn full-width"
              label="Add Comment"
              onClick={handleAddComments}
              loading={loading}
              testId="comments-modal-add-comment-btn"
            />
          </Grid>
        </Grid>
        <Grid item xs="12" sx={{ marginTop: '2rem' }}>
          <Typography
            variant="h2"
            sx={{
              color: '#333333',
              fontSize: '1.5rem',
              fontWeight: '400',
            }}
          >
            All Comments{' '}
            <span
              style={{ fontSize: '1rem' }}
              data-testid="comments-modal-comments-count"
            >
              ({commentsList?.length})
            </span>
          </Typography>
        </Grid>
        <Grid
          container
          sx={{
            maxHeight: `calc(80vh - ${commentFormHeight}px)`,
            overflowY: 'auto',
          }}
        >
          {sortComments(commentsList)?.map((comment, i) => {
            const commentDate = comment?.modified_at || comment?.created_at;
            return (
              <Grid
                item
                xs="12"
                key={comment?.id}
                sx={{
                  borderBottom: '1px dashed #C9C9C9',
                  paddingBottom: '2rem',
                  paddingTop: i > 0 ? '2rem' : '1rem',
                }}
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
                    data-testid={`comments-modal-${i}-username`}
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
                    data-testid={`comments-modal-${i}-date`}
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
                  data-testid={`comments-modal-${i}-text`}
                >
                  {comment?.text}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </SimpleModal>
  );
};

export default CommentsModal;
