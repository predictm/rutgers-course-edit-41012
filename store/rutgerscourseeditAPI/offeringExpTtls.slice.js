import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const course_api_v1_offering_exp_ttl_create = createAsyncThunk(
  "offeringExpTtls/course_api_v1_offering_exp_ttl_create",
  async payload => {
    const response = await apiService.course_api_v1_offering_exp_ttl_create(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_exp_ttl_retrieve = createAsyncThunk(
  "offeringExpTtls/course_api_v1_offering_exp_ttl_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_offering_exp_ttl_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_exp_ttl_update = createAsyncThunk(
  "offeringExpTtls/course_api_v1_offering_exp_ttl_update",
  async payload => {
    const response = await apiService.course_api_v1_offering_exp_ttl_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_exp_ttl_partial_update = createAsyncThunk(
  "offeringExpTtls/course_api_v1_offering_exp_ttl_partial_update",
  async payload => {
    const response = await apiService.course_api_v1_offering_exp_ttl_partial_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_exp_ttl_destroy = createAsyncThunk(
  "offeringExpTtls/course_api_v1_offering_exp_ttl_destroy",
  async payload => {
    const response = await apiService.course_api_v1_offering_exp_ttl_destroy(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const offeringExpTtlsSlice = createSlice({
  name: "offeringExpTtls",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        course_api_v1_offering_exp_ttl_create.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_retrieve.fulfilled,
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
        course_api_v1_offering_exp_ttl_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_update.fulfilled,
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
        course_api_v1_offering_exp_ttl_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_partial_update.fulfilled,
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
        course_api_v1_offering_exp_ttl_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_destroy.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_exp_ttl_destroy.fulfilled,
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
        course_api_v1_offering_exp_ttl_destroy.rejected,
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
  course_api_v1_offering_exp_ttl_create,
  course_api_v1_offering_exp_ttl_retrieve,
  course_api_v1_offering_exp_ttl_update,
  course_api_v1_offering_exp_ttl_partial_update,
  course_api_v1_offering_exp_ttl_destroy,
  slice: offeringExpTtlsSlice
}
