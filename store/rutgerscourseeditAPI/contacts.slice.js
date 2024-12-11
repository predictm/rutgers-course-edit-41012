import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const department_api_v1_contact_create = createAsyncThunk(
  "contacts/department_api_v1_contact_create",
  async payload => {
    const response = await apiService.department_api_v1_contact_create(payload)
    return response.data
  }
)
export const department_api_v1_contact_retrieve = createAsyncThunk(
  "contacts/department_api_v1_contact_retrieve",
  async payload => {
    const response = await apiService.department_api_v1_contact_retrieve(
      payload
    )
    return response.data
  }
)
export const department_api_v1_contact_update = createAsyncThunk(
  "contacts/department_api_v1_contact_update",
  async payload => {
    const response = await apiService.department_api_v1_contact_update(payload)
    return response.data
  }
)
export const department_api_v1_contact_partial_update = createAsyncThunk(
  "contacts/department_api_v1_contact_partial_update",
  async payload => {
    const response = await apiService.department_api_v1_contact_partial_update(
      payload
    )
    return response.data
  }
)
export const department_api_v1_contact_destroy = createAsyncThunk(
  "contacts/department_api_v1_contact_destroy",
  async payload => {
    const response = await apiService.department_api_v1_contact_destroy(payload)
    return response.data
  }
)
export const department_api_v1_contact_toggle_active_create = createAsyncThunk(
  "contacts/department_api_v1_contact_toggle_active_create",
  async payload => {
    const response = await apiService.department_api_v1_contact_toggle_active_create(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(department_api_v1_contact_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(department_api_v1_contact_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(department_api_v1_contact_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(department_api_v1_contact_retrieve.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        department_api_v1_contact_retrieve.fulfilled,
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
      .addCase(department_api_v1_contact_retrieve.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(department_api_v1_contact_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(department_api_v1_contact_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(department_api_v1_contact_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(
        department_api_v1_contact_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_partial_update.fulfilled,
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
        department_api_v1_contact_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(department_api_v1_contact_destroy.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(department_api_v1_contact_destroy.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(department_api_v1_contact_destroy.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(
        department_api_v1_contact_toggle_active_create.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_toggle_active_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        department_api_v1_contact_toggle_active_create.rejected,
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
  department_api_v1_contact_create,
  department_api_v1_contact_retrieve,
  department_api_v1_contact_update,
  department_api_v1_contact_partial_update,
  department_api_v1_contact_destroy,
  department_api_v1_contact_toggle_active_create,
  slice: contactsSlice
}
