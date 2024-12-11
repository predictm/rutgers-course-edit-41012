import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './style.scss';

const RichTextEditor = ({
  onChange,
  placeholder,
  defaultEditorState,
  error,
  label,
  required,
  wrapperId,
  mention,
  editorClassName
}) => {
  const onEditorStateChange = editor => {
    onChange(editor);
  };

  return (
    <FormControl error={Boolean(error)} fullWidth>
      {label && (
        <InputLabel shrink variant="standard" sx={{ transform: 'scale(1)' }}>
          {label}
          {required ? <span style={{ color: '#d32f2f' }}>&nbsp;*</span> : ''}
        </InputLabel>
      )}
      <Editor
        wrapperId={wrapperId}
        placeholder={placeholder}
        wrapperClassName={`rich-text-wrapper ${
          error ? 'rich-text-wrapper--error' : ''
        }`}
        editorClassName={`rich-text-editor ${editorClassName?editorClassName:''}`}
        toolbarClassName="rich-text-editor-toolbar"
        onEditorStateChange={onEditorStateChange}
        defaultEditorState={defaultEditorState || EditorState.createEmpty()}
        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'list',
            //'colorPicker',
            'textAlign',
            'link',
            'history',
          ],
          inline: {
            options: [
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'monospace',
            ],
            bold: {
              className: 'rich-text-editor-toolbar-option option-bold',
            },
            italic: {
              className: 'rich-text-editor-toolbar-option option-italic',
            },
            underline: {
              className: 'rich-text-editor-toolbar-option option-underline',
            },
            strikethrough: {
              className: 'rich-text-editor-toolbar-option option-strikethrough',
            },
            monospace: {
              className: 'rich-text-editor-toolbar-option option-monospace',
            },
          },
          blockType: {
            className: 'rich-text-editor-toolbar-option option-block-type',
            dropdownClassName: 'rich-text-editor-toolbar-option-dropdown',
          },
          fontSize: {
            className: 'rich-text-editor-toolbar-option option-font-size',
            dropdownClassName: 'rich-text-editor-toolbar-option-dropdown',
          },
          list: {
            unordered: {
              className: 'rich-text-editor-toolbar-option option-unordered',
            },
            ordered: {
              className: 'rich-text-editor-toolbar-option option-ordered',
            },
            indent: {
              className: 'rich-text-editor-toolbar-option option-indent',
            },
            outdent: {
              className: 'rich-text-editor-toolbar-option option-outdent',
            },
          },
          textAlign: {
            options: ['left', 'center', 'right'],
            left: {
              className: 'rich-text-editor-toolbar-option option-text-left',
            },
            center: {
              className: 'rich-text-editor-toolbar-option option-text-center',
            },
            right: {
              className: 'rich-text-editor-toolbar-option option-text-right',
            },
          },
          colorPicker: {
            className: 'rich-text-editor-toolbar-option option-color-picker',
            popupClassName: 'rich-text-editor-toolbar-option-dropdown',
          },
          link: {
            popupClassName: 'rich-text-editor-toolbar-popup',
            link: {
              className: 'rich-text-editor-toolbar-option option-link',
            },
            unlink: {
              className: 'rich-text-editor-toolbar-option option-unlink',
            },
          },
          history: {
            undo: {
              className: 'rich-text-editor-toolbar-option option-undo',
            },
            redo: {
              className: 'rich-text-editor-toolbar-option option-redo',
            },
          },
        }}
        mention={mention}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};

export default RichTextEditor;
