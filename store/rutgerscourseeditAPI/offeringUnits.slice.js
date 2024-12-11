import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const course_api_v1_offering_units_create = createAsyncThunk(
  "offeringUnits/course_api_v1_offering_units_create",
  async payload => {
    const response = await apiService.course_api_v1_offering_units_create(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_units_retrieve = createAsyncThunk(
  "offeringUnits/course_api_v1_offering_units_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_offering_units_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_units_update = createAsyncThunk(
  "offeringUnits/course_api_v1_offering_units_update",
  async payload => {
    const response = await apiService.course_api_v1_offering_units_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_units_partial_update = createAsyncThunk(
  "offeringUnits/course_api_v1_offering_units_partial_update",
  async payload => {
    const response = await apiService.course_api_v1_offering_units_partial_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_offering_units_destroy = createAsyncThunk(
  "offeringUnits/course_api_v1_offering_units_destroy",
  async payload => {
    const response = await apiService.course_api_v1_offering_units_destroy(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const offeringUnitsSlice = createSlice({
  name: "offeringUnits",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(course_api_v1_offering_units_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        course_api_v1_offering_units_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_units_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_units_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_units_retrieve.fulfilled,
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
        course_api_v1_offering_units_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(course_api_v1_offering_units_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        course_api_v1_offering_units_update.fulfilled,
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
        course_api_v1_offering_units_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_units_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_units_partial_update.fulfilled,
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
        course_api_v1_offering_units_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_offering_units_destroy.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_offering_units_destroy.fulfilled,
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
        course_api_v1_offering_units_destroy.rejected,
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
  course_api_v1_offering_units_create,
  course_api_v1_offering_units_retrieve,
  course_api_v1_offering_units_update,
  course_api_v1_offering_units_partial_update,
  course_api_v1_offering_units_destroy,
  slice: offeringUnitsSlice
}
