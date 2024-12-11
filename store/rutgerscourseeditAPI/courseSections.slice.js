import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const course_api_v1_course_section_create = createAsyncThunk(
  "courseSections/course_api_v1_course_section_create",
  async payload => {
    const response = await apiService.course_api_v1_course_section_create(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_update = createAsyncThunk(
  "courseSections/course_api_v1_course_section_update",
  async payload => {
    const response = await apiService.course_api_v1_course_section_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_partial_update = createAsyncThunk(
  "courseSections/course_api_v1_course_section_partial_update",
  async payload => {
    const response = await apiService.course_api_v1_course_section_partial_update(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_destroy = createAsyncThunk(
  "courseSections/course_api_v1_course_section_destroy",
  async payload => {
    const response = await apiService.course_api_v1_course_section_destroy(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_course_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_course_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_course_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_section_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_section_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_section_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_subject_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_subject_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_subject_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_semester_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_semester_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_semester_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_offering_unit_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_offering_unit_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_offering_unit_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_search_course_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_search_course_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_search_course_retrieve(
      payload
    )
    return response.data
  }
)
export const course_api_v1_course_section_search_course_section_retrieve = createAsyncThunk(
  "courseSections/course_api_v1_course_section_search_course_section_retrieve",
  async payload => {
    const response = await apiService.course_api_v1_course_section_search_course_section_retrieve(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const courseSectionsSlice = createSlice({
  name: "courseSections",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(course_api_v1_course_section_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        course_api_v1_course_section_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_retrieve.fulfilled,
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
        course_api_v1_course_section_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(course_api_v1_course_section_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        course_api_v1_course_section_update.fulfilled,
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
        course_api_v1_course_section_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_partial_update.fulfilled,
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
        course_api_v1_course_section_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_destroy.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_destroy.fulfilled,
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
        course_api_v1_course_section_destroy.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_course_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_course_retrieve.fulfilled,
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
        course_api_v1_course_section_course_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_section_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_section_retrieve.fulfilled,
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
        course_api_v1_course_section_section_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_subject_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_subject_retrieve.fulfilled,
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
        course_api_v1_course_section_subject_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_semester_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_semester_retrieve.fulfilled,
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
        course_api_v1_course_section_semester_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_offering_unit_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_offering_unit_retrieve.fulfilled,
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
        course_api_v1_course_section_offering_unit_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_search_course_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_search_course_retrieve.fulfilled,
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
        course_api_v1_course_section_search_course_retrieve.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_search_course_section_retrieve.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        course_api_v1_course_section_search_course_section_retrieve.fulfilled,
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
        course_api_v1_course_section_search_course_section_retrieve.rejected,
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
  course_api_v1_course_section_create,
  course_api_v1_course_section_retrieve,
  course_api_v1_course_section_update,
  course_api_v1_course_section_partial_update,
  course_api_v1_course_section_destroy,
  course_api_v1_course_section_course_retrieve,
  course_api_v1_course_section_section_retrieve,
  course_api_v1_course_section_subject_retrieve,
  course_api_v1_course_section_semester_retrieve,
  course_api_v1_course_section_offering_unit_retrieve,
  course_api_v1_course_section_search_course_retrieve,
  course_api_v1_course_section_search_course_section_retrieve,
  slice: courseSectionsSlice
}
