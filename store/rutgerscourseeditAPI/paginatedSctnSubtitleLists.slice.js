import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const course_api_v1_section_subtitle_list = createAsyncThunk(
  "paginatedSctnSubtitleLists/course_api_v1_section_subtitle_list",
  async payload => {
    const response = await apiService.course_api_v1_section_subtitle_list(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const paginatedSctnSubtitleListsSlice = createSlice({
  name: "paginatedSctnSubtitleLists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(course_api_v1_section_subtitle_list.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        course_api_v1_section_subtitle_list.fulfilled,
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
        course_api_v1_section_subtitle_list.rejected,
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
  course_api_v1_section_subtitle_list,
  slice: paginatedSctnSubtitleListsSlice
}
