import axios from "axios"
const rutgerscourseeditAPI = axios.create({
  baseURL: "https://rutgers-course-edit-41012.botics.co",
  headers: { Accept: "application/json", "Content-Type": "application/json" }
})
function api_v1_login_create(payload) {
  return rutgerscourseeditAPI.post(`/api/v1/login/`, payload)
}
function api_v1_signup_create(payload) {
  return rutgerscourseeditAPI.post(`/api/v1/signup/`, payload)
}
function rest_auth_user_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/rest-auth/user/`)
}
function rest_auth_user_update(payload) {
  return rutgerscourseeditAPI.put(`/rest-auth/user/`, payload)
}
function rest_auth_user_partial_update(payload) {
  return rutgerscourseeditAPI.patch(`/rest-auth/user/`, payload)
}
function api_docs_schema_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/api-docs/schema/`, {
    params: { lang: payload.lang }
  })
}
function rest_auth_login_create(payload) {
  return rutgerscourseeditAPI.post(`/rest-auth/login/`, payload)
}
function rest_auth_logout_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/rest-auth/logout/`)
}
function rest_auth_logout_create(payload) {
  return rutgerscourseeditAPI.post(`/rest-auth/logout/`)
}
function rest_auth_registration_create(payload) {
  return rutgerscourseeditAPI.post(`/rest-auth/registration/`, payload)
}
function course_api_v1_course_mtg_list(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/course-mtg/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function course_api_v1_course_mtg_create(payload) {
  return rutgerscourseeditAPI.post(`/course/api/v1/course-mtg/`, payload)
}
function rest_auth_password_reset_create(payload) {
  return rutgerscourseeditAPI.post(`/rest-auth/password/reset/`, payload)
}
function department_api_v1_contact_list(payload) {
  return rutgerscourseeditAPI.get(`/department/api/v1/contact/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function department_api_v1_contact_create(payload) {
  return rutgerscourseeditAPI.post(`/department/api/v1/contact/`, payload)
}
function rest_auth_password_change_create(payload) {
  return rutgerscourseeditAPI.post(`/rest-auth/password/change/`, payload)
}
function course_api_v1_course_section_list(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/course-section/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function course_api_v1_course_section_create(payload) {
  return rutgerscourseeditAPI.post(`/course/api/v1/course-section/`, payload)
}
function course_api_v1_offering_units_list(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/offering-units/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function course_api_v1_offering_units_create(payload) {
  return rutgerscourseeditAPI.post(`/course/api/v1/offering-units/`, payload)
}
function department_api_v1_department_list(payload) {
  return rutgerscourseeditAPI.get(`/department/api/v1/department/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function department_api_v1_department_create(payload) {
  return rutgerscourseeditAPI.post(`/department/api/v1/department/`, payload)
}
function course_api_v1_course_mtg_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/course-mtg/${payload.id}/`)
}
function course_api_v1_course_mtg_update(payload) {
  return rutgerscourseeditAPI.put(
    `/course/api/v1/course-mtg/${payload.id}/`,
    payload
  )
}
function course_api_v1_course_mtg_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/course/api/v1/course-mtg/${payload.id}/`,
    payload
  )
}
function course_api_v1_course_mtg_destroy(payload) {
  return rutgerscourseeditAPI.delete(`/course/api/v1/course-mtg/${payload.id}/`)
}
function course_api_v1_offering_exp_ttl_list(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/offering-exp-ttl/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function course_api_v1_offering_exp_ttl_create(payload) {
  return rutgerscourseeditAPI.post(`/course/api/v1/offering-exp-ttl/`, payload)
}
function course_api_v1_section_subtitle_list(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/section-subtitle/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function course_api_v1_section_subtitle_create(payload) {
  return rutgerscourseeditAPI.post(`/course/api/v1/section-subtitle/`, payload)
}
function department_api_v1_contact_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/department/api/v1/contact/${payload.id}/`)
}
function department_api_v1_contact_update(payload) {
  return rutgerscourseeditAPI.put(
    `/department/api/v1/contact/${payload.id}/`,
    payload
  )
}
function department_api_v1_contact_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/department/api/v1/contact/${payload.id}/`,
    payload
  )
}
function department_api_v1_contact_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/department/api/v1/contact/${payload.id}/`
  )
}
function department_api_v1_contact_roles_list(payload) {
  return rutgerscourseeditAPI.get(`/department/api/v1/contact-roles/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function department_api_v1_contact_roles_create(payload) {
  return rutgerscourseeditAPI.post(`/department/api/v1/contact-roles/`, payload)
}
function department_api_v1_departmentuser_list(payload) {
  return rutgerscourseeditAPI.get(`/department/api/v1/departmentuser/`, {
    params: { limit: payload.limit, offset: payload.offset }
  })
}
function department_api_v1_departmentuser_create(payload) {
  return rutgerscourseeditAPI.post(
    `/department/api/v1/departmentuser/`,
    payload
  )
}
function rest_auth_password_reset_confirm_create(payload) {
  return rutgerscourseeditAPI.post(
    `/rest-auth/password/reset/confirm/`,
    payload
  )
}
function course_api_v1_course_section_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/course/api/v1/course-section/${payload.id}/`
  )
}
function course_api_v1_course_section_update(payload) {
  return rutgerscourseeditAPI.put(
    `/course/api/v1/course-section/${payload.id}/`,
    payload
  )
}
function course_api_v1_course_section_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/course/api/v1/course-section/${payload.id}/`,
    payload
  )
}
function course_api_v1_course_section_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/course/api/v1/course-section/${payload.id}/`
  )
}
function course_api_v1_offering_units_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/course/api/v1/offering-units/${payload.id}/`
  )
}
function course_api_v1_offering_units_update(payload) {
  return rutgerscourseeditAPI.put(
    `/course/api/v1/offering-units/${payload.id}/`,
    payload
  )
}
function course_api_v1_offering_units_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/course/api/v1/offering-units/${payload.id}/`,
    payload
  )
}
function course_api_v1_offering_units_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/course/api/v1/offering-units/${payload.id}/`
  )
}
function department_api_v1_department_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/department/api/v1/department/${payload.id}/`
  )
}
function department_api_v1_department_update(payload) {
  return rutgerscourseeditAPI.put(
    `/department/api/v1/department/${payload.id}/`,
    payload
  )
}
function department_api_v1_department_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/department/api/v1/department/${payload.id}/`,
    payload
  )
}
function department_api_v1_department_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/department/api/v1/department/${payload.id}/`
  )
}
function course_api_v1_course_section_course_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/course-section/course/`)
}
function course_api_v1_offering_exp_ttl_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/course/api/v1/offering-exp-ttl/${payload.id}/`
  )
}
function course_api_v1_offering_exp_ttl_update(payload) {
  return rutgerscourseeditAPI.put(
    `/course/api/v1/offering-exp-ttl/${payload.id}/`,
    payload
  )
}
function course_api_v1_offering_exp_ttl_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/course/api/v1/offering-exp-ttl/${payload.id}/`,
    payload
  )
}
function course_api_v1_offering_exp_ttl_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/course/api/v1/offering-exp-ttl/${payload.id}/`
  )
}
function course_api_v1_section_subtitle_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/course/api/v1/section-subtitle/${payload.id}/`
  )
}
function course_api_v1_section_subtitle_update(payload) {
  return rutgerscourseeditAPI.put(
    `/course/api/v1/section-subtitle/${payload.id}/`,
    payload
  )
}
function course_api_v1_section_subtitle_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/course/api/v1/section-subtitle/${payload.id}/`,
    payload
  )
}
function course_api_v1_section_subtitle_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/course/api/v1/section-subtitle/${payload.id}/`
  )
}
function department_api_v1_department_search_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/department/api/v1/department/search/`)
}
function rest_auth_registration_verify_email_create(payload) {
  return rutgerscourseeditAPI.post(
    `/rest-auth/registration/verify-email/`,
    payload
  )
}
function course_api_v1_course_section_section_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/course-section/section/`)
}
function course_api_v1_course_section_subject_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/course-section/subject/`)
}
function department_api_v1_contact_roles_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/department/api/v1/contact-roles/${payload.id}/`
  )
}
function department_api_v1_contact_roles_update(payload) {
  return rutgerscourseeditAPI.put(
    `/department/api/v1/contact-roles/${payload.id}/`,
    payload
  )
}
function department_api_v1_contact_roles_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/department/api/v1/contact-roles/${payload.id}/`,
    payload
  )
}
function department_api_v1_contact_roles_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/department/api/v1/contact-roles/${payload.id}/`
  )
}
function course_api_v1_course_section_semester_retrieve(payload) {
  return rutgerscourseeditAPI.get(`/course/api/v1/course-section/semester/`)
}
function department_api_v1_departmentuser_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/department/api/v1/departmentuser/${payload.id}/`
  )
}
function department_api_v1_departmentuser_update(payload) {
  return rutgerscourseeditAPI.put(
    `/department/api/v1/departmentuser/${payload.id}/`,
    payload
  )
}
function department_api_v1_departmentuser_partial_update(payload) {
  return rutgerscourseeditAPI.patch(
    `/department/api/v1/departmentuser/${payload.id}/`,
    payload
  )
}
function department_api_v1_departmentuser_destroy(payload) {
  return rutgerscourseeditAPI.delete(
    `/department/api/v1/departmentuser/${payload.id}/`
  )
}
function course_api_v1_course_section_offering_unit_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/course/api/v1/course-section/offering-unit/`
  )
}
function course_api_v1_course_section_search_course_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/course/api/v1/course-section/search-course/`
  )
}
function department_api_v1_contact_toggle_active_create(payload) {
  return rutgerscourseeditAPI.post(
    `/department/api/v1/contact/${payload.id}/toggle_active/`,
    payload
  )
}
function course_api_v1_course_section_search_course_section_retrieve(payload) {
  return rutgerscourseeditAPI.get(
    `/course/api/v1/course-section/search-course-section/`
  )
}
export const apiService = {
  api_v1_login_create,
  api_v1_signup_create,
  rest_auth_user_retrieve,
  rest_auth_user_update,
  rest_auth_user_partial_update,
  api_docs_schema_retrieve,
  rest_auth_login_create,
  rest_auth_logout_retrieve,
  rest_auth_logout_create,
  rest_auth_registration_create,
  course_api_v1_course_mtg_list,
  course_api_v1_course_mtg_create,
  rest_auth_password_reset_create,
  department_api_v1_contact_list,
  department_api_v1_contact_create,
  rest_auth_password_change_create,
  course_api_v1_course_section_list,
  course_api_v1_course_section_create,
  course_api_v1_offering_units_list,
  course_api_v1_offering_units_create,
  department_api_v1_department_list,
  department_api_v1_department_create,
  course_api_v1_course_mtg_retrieve,
  course_api_v1_course_mtg_update,
  course_api_v1_course_mtg_partial_update,
  course_api_v1_course_mtg_destroy,
  course_api_v1_offering_exp_ttl_list,
  course_api_v1_offering_exp_ttl_create,
  course_api_v1_section_subtitle_list,
  course_api_v1_section_subtitle_create,
  department_api_v1_contact_retrieve,
  department_api_v1_contact_update,
  department_api_v1_contact_partial_update,
  department_api_v1_contact_destroy,
  department_api_v1_contact_roles_list,
  department_api_v1_contact_roles_create,
  department_api_v1_departmentuser_list,
  department_api_v1_departmentuser_create,
  rest_auth_password_reset_confirm_create,
  course_api_v1_course_section_retrieve,
  course_api_v1_course_section_update,
  course_api_v1_course_section_partial_update,
  course_api_v1_course_section_destroy,
  course_api_v1_offering_units_retrieve,
  course_api_v1_offering_units_update,
  course_api_v1_offering_units_partial_update,
  course_api_v1_offering_units_destroy,
  department_api_v1_department_retrieve,
  department_api_v1_department_update,
  department_api_v1_department_partial_update,
  department_api_v1_department_destroy,
  course_api_v1_course_section_course_retrieve,
  course_api_v1_offering_exp_ttl_retrieve,
  course_api_v1_offering_exp_ttl_update,
  course_api_v1_offering_exp_ttl_partial_update,
  course_api_v1_offering_exp_ttl_destroy,
  course_api_v1_section_subtitle_retrieve,
  course_api_v1_section_subtitle_update,
  course_api_v1_section_subtitle_partial_update,
  course_api_v1_section_subtitle_destroy,
  department_api_v1_department_search_retrieve,
  rest_auth_registration_verify_email_create,
  course_api_v1_course_section_section_retrieve,
  course_api_v1_course_section_subject_retrieve,
  department_api_v1_contact_roles_retrieve,
  department_api_v1_contact_roles_update,
  department_api_v1_contact_roles_partial_update,
  department_api_v1_contact_roles_destroy,
  course_api_v1_course_section_semester_retrieve,
  department_api_v1_departmentuser_retrieve,
  department_api_v1_departmentuser_update,
  department_api_v1_departmentuser_partial_update,
  department_api_v1_departmentuser_destroy,
  course_api_v1_course_section_offering_unit_retrieve,
  course_api_v1_course_section_search_course_retrieve,
  department_api_v1_contact_toggle_active_create,
  course_api_v1_course_section_search_course_section_retrieve
}
