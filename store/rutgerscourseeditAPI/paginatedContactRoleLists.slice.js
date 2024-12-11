import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const department_api_v1_contact_roles_list = createAsyncThunk(
  "paginatedContactRoleLists/department_api_v1_contact_roles_list",
  async payload => {
    const response = await apiService.department_api_v1_contact_roles_list(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const paginatedContactRoleListsSlice = createSlice({
  name: "paginatedContactRoleLists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        department_api_v1_contact_roles_list.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        department_api_v1_contact_roles_list.fulfilled,
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
        department_api_v1_contact_roles_list.rejected,
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
  department_api_v1_contact_roles_list,
  slice: paginatedContactRoleListsSlice
}
