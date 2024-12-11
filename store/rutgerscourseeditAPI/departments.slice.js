import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const department_api_v1_department_create = createAsyncThunk(
  "departments/department_api_v1_department_create",
  async payload => {
    const response = await apiService.department_api_v1_department_create(
      payload
    )
    return response.data
  }
)
export const department_api_v1_department_retrieve = createAsyncThunk(
  "departments/department_api_v1_department_retrieve",
  async payload => {
    const response = await apiService.department_api_v1_department_retrieve(
      payload
    )
    return response.data
  }
)
export const department_api_v1_department_update = createAsyncThunk(
  "departments/department_api_v1_department_update",
  async payload => {
    const response = await apiService.department_api_v1_department_update(
      payload
    )
    return response.data
  }
)
export const department_api_v1_department_partial_update = createAsyncThunk(
  "departments/department_api_v1_department_partial_update",
  async payload => {
    const response = await apiService.department_api_v1_department_partial_update(
      payload
    )
    return response.data
  }
)
export const department_api_v1_department_destroy = createAsyncThunk(
  "departments/department_api_v1_department_destroy",
  async payload => {
    const response = await apiService.department_api_v1_department_destroy(
      payload
    )
    return response.data
  }
)
export const department_api_v1_department_search_retrieve = createAsyncThunk(
  "departments/department_api_v1_department_search_retrieve",
  async payload => {
    const response = await apiService.department_api_v1_department_search_retrieve(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(department_api_v1_department_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        department_api_v1_department_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_department_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_department_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_department_retrieve.fulfilled,
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
        department_api_v1_department_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(department_api_v1_department_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        department_api_v1_department_update.fulfilled,
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
        department_api_v1_department_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_department_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_department_partial_update.fulfilled,
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
        department_api_v1_department_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_department_destroy.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_department_destroy.fulfilled,
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
        department_api_v1_department_destroy.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_department_search_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_department_search_retrieve.fulfilled,
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
        department_api_v1_department_search_retrieve.rejected,
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
  department_api_v1_department_create,
  department_api_v1_department_retrieve,
  department_api_v1_department_update,
  department_api_v1_department_partial_update,
  department_api_v1_department_destroy,
  department_api_v1_department_search_retrieve,
  slice: departmentsSlice
}
