import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const course_api_v1_offering_units_list = createAsyncThunk(
  "paginatedOfferingUnitLists/course_api_v1_offering_units_list",
  async payload => {
    const response = await apiService.course_api_v1_offering_units_list(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const paginatedOfferingUnitListsSlice = createSlice({
  name: "paginatedOfferingUnitLists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(course_api_v1_offering_units_list.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(course_api_v1_offering_units_list.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(course_api_v1_offering_units_list.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  course_api_v1_offering_units_list,
  slice: paginatedOfferingUnitListsSlice
}
