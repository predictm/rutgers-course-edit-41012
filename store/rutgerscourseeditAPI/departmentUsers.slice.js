import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const department_api_v1_departmentuser_create = createAsyncThunk(
  "departmentUsers/department_api_v1_departmentuser_create",
  async payload => {
    const response = await apiService.department_api_v1_departmentuser_create(
      payload
    )
    return response.data
  }
)
export const department_api_v1_departmentuser_retrieve = createAsyncThunk(
  "departmentUsers/department_api_v1_departmentuser_retrieve",
  async payload => {
    const response = await apiService.department_api_v1_departmentuser_retrieve(
      payload
    )
    return response.data
  }
)
export const department_api_v1_departmentuser_update = createAsyncThunk(
  "departmentUsers/department_api_v1_departmentuser_update",
  async payload => {
    const response = await apiService.department_api_v1_departmentuser_update(
      payload
    )
    return response.data
  }
)
export const department_api_v1_departmentuser_partial_update = createAsyncThunk(
  "departmentUsers/department_api_v1_departmentuser_partial_update",
  async payload => {
    const response = await apiService.department_api_v1_departmentuser_partial_update(
      payload
    )
    return response.data
  }
)
export const department_api_v1_departmentuser_destroy = createAsyncThunk(
  "departmentUsers/department_api_v1_departmentuser_destroy",
  async payload => {
    const response = await apiService.department_api_v1_departmentuser_destroy(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const departmentUsersSlice = createSlice({
  name: "departmentUsers",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        department_api_v1_departmentuser_create.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_retrieve.fulfilled,
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
        department_api_v1_departmentuser_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_update.fulfilled,
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
        department_api_v1_departmentuser_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_partial_update.fulfilled,
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
        department_api_v1_departmentuser_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_destroy.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_departmentuser_destroy.fulfilled,
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
        department_api_v1_departmentuser_destroy.rejected,
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
  department_api_v1_departmentuser_create,
  department_api_v1_departmentuser_retrieve,
  department_api_v1_departmentuser_update,
  department_api_v1_departmentuser_partial_update,
  department_api_v1_departmentuser_destroy,
  slice: departmentUsersSlice
}
