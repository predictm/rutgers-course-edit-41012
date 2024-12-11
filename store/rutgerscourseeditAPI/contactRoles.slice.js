import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const department_api_v1_contact_roles_create = createAsyncThunk(
  "contactRoles/department_api_v1_contact_roles_create",
  async payload => {
    const response = await apiService.department_api_v1_contact_roles_create(
      payload
    )
    return response.data
  }
)
export const department_api_v1_contact_roles_retrieve = createAsyncThunk(
  "contactRoles/department_api_v1_contact_roles_retrieve",
  async payload => {
    const response = await apiService.department_api_v1_contact_roles_retrieve(
      payload
    )
    return response.data
  }
)
export const department_api_v1_contact_roles_update = createAsyncThunk(
  "contactRoles/department_api_v1_contact_roles_update",
  async payload => {
    const response = await apiService.department_api_v1_contact_roles_update(
      payload
    )
    return response.data
  }
)
export const department_api_v1_contact_roles_partial_update = createAsyncThunk(
  "contactRoles/department_api_v1_contact_roles_partial_update",
  async payload => {
    const response = await apiService.department_api_v1_contact_roles_partial_update(
      payload
    )
    return response.data
  }
)
export const department_api_v1_contact_roles_destroy = createAsyncThunk(
  "contactRoles/department_api_v1_contact_roles_destroy",
  async payload => {
    const response = await apiService.department_api_v1_contact_roles_destroy(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const contactRolesSlice = createSlice({
  name: "contactRoles",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        department_api_v1_contact_roles_create.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_retrieve.fulfilled,
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
        department_api_v1_contact_roles_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_update.fulfilled,
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
        department_api_v1_contact_roles_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_partial_update.fulfilled,
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
        department_api_v1_contact_roles_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_destroy.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_destroy.fulfilled,
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
        department_api_v1_contact_roles_destroy.rejected,
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
  department_api_v1_contact_roles_create,
  department_api_v1_contact_roles_retrieve,
  department_api_v1_contact_roles_update,
  department_api_v1_contact_roles_partial_update,
  department_api_v1_contact_roles_destroy,
  slice: contactRolesSlice
}
