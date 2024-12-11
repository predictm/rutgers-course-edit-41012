import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const course_api_v1_course_mtg_create = createAsyncThunk(
  "courseMtgs/course_api_v1_course_mtg_create",
  async payload => {
    const response = await apiService.course_api_v1_course_mtg_create(payload)
    return response.data
  }
)
export const course_api_v1_course_mtg_retrieve = createAsyncThunk(
  "courseMtgs/course_api_v1_course_mtg_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_mtg_retrieve(payload)
    return response.data
  }
)
export const course_api_v1_course_mtg_update = createAsyncThunk(
  "courseMtgs/course_api_v1_course_mtg_update",
  async payload => {
    const response = await apiService.course_api_v1_course_mtg_update(payload)
    return response.data
  }
)
export const course_api_v1_course_mtg_partial_update = createAsyncThunk(
  "courseMtgs/course_api_v1_course_mtg_partial_update",
  async payload => {
    const response = await apiService.course_api_v1_course_mtg_partial_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_mtg_destroy = createAsyncThunk(
  "courseMtgs/course_api_v1_course_mtg_destroy",
  async payload => {
    const response = await apiService.course_api_v1_course_mtg_destroy(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const courseMtgsSlice = createSlice({
  name: "courseMtgs",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(course_api_v1_course_mtg_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(course_api_v1_course_mtg_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(course_api_v1_course_mtg_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(course_api_v1_course_mtg_retrieve.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(course_api_v1_course_mtg_retrieve.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(course_api_v1_course_mtg_retrieve.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(course_api_v1_course_mtg_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(course_api_v1_course_mtg_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(course_api_v1_course_mtg_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(
        course_api_v1_course_mtg_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_mtg_partial_update.fulfilled,
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
        course_api_v1_course_mtg_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(course_api_v1_course_mtg_destroy.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(course_api_v1_course_mtg_destroy.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(course_api_v1_course_mtg_destroy.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  course_api_v1_course_mtg_create,
  course_api_v1_course_mtg_retrieve,
  course_api_v1_course_mtg_update,
  course_api_v1_course_mtg_partial_update,
  course_api_v1_course_mtg_destroy,
  slice: courseMtgsSlice
}
