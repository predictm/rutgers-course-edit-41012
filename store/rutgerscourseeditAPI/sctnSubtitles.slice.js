import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const course_api_v1_section_subtitle_create = createAsyncThunk(
  "sctnSubtitles/course_api_v1_section_subtitle_create",
  async payload => {
    const response = await apiService.course_api_v1_section_subtitle_create(
      payload
    )
    return response.data
  }
)
export const course_api_v1_section_subtitle_retrieve = createAsyncThunk(
  "sctnSubtitles/course_api_v1_section_subtitle_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_section_subtitle_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_section_subtitle_update = createAsyncThunk(
  "sctnSubtitles/course_api_v1_section_subtitle_update",
  async payload => {
    const response = await apiService.course_api_v1_section_subtitle_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_section_subtitle_partial_update = createAsyncThunk(
  "sctnSubtitles/course_api_v1_section_subtitle_partial_update",
  async payload => {
    const response = await apiService.course_api_v1_section_subtitle_partial_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_section_subtitle_destroy = createAsyncThunk(
  "sctnSubtitles/course_api_v1_section_subtitle_destroy",
  async payload => {
    const response = await apiService.course_api_v1_section_subtitle_destroy(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const sctnSubtitlesSlice = createSlice({
  name: "sctnSubtitles",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        course_api_v1_section_subtitle_create.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_retrieve.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = [
              ...state.entities.filter(
                record => record.id !== action.payload.id
              ),
              action.payload
            ]
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_update.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = state.entities.map(record =>
              record.id === action.payload.id ? action.payload : record
            )
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_partial_update.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = state.entities.map(record =>
              record.id === action.payload.id ? action.payload : record
            )
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_destroy.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_destroy.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = state.entities.filter(
              record => record.id !== action.meta.arg?.id
            )
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_section_subtitle_destroy.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
  }
})
export default {
  course_api_v1_section_subtitle_create,
  course_api_v1_section_subtitle_retrieve,
  course_api_v1_section_subtitle_update,
  course_api_v1_section_subtitle_partial_update,
  course_api_v1_section_subtitle_destroy,
  slice: sctnSubtitlesSlice
}
