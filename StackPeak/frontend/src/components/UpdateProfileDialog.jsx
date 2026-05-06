import { useState } from 'react'

function UpdateProfileDialog({ profile, isSaving, onClose, onSave }) {
  const [formValues, setFormValues] = useState({
    fullName: profile?.fullName || '',
    phoneNumber: profile?.phoneNumber || '',
    bio: profile?.bio || '',
    skills: profile?.skills || '',
    profileImage: null,
    resume: null,
  })

  function onChange(event) {
    const { name, value, files } = event.target

    if (name === 'profileImage' || name === 'resume') {
      setFormValues((prev) => ({ ...prev, [name]: files?.[0] || null }))
      return
    }

    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  function onSubmit(event) {
    event.preventDefault()
    onSave(formValues)
  }

  return (
    <div className="pp-modal-overlay">
      <form className="pp-modal-card" onSubmit={onSubmit}>
        <h2>Update Profile</h2>

        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" name="fullName" value={formValues.fullName} onChange={onChange} />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input id="phoneNumber" name="phoneNumber" value={formValues.phoneNumber} onChange={onChange} />

        <label htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" value={formValues.bio} onChange={onChange} rows={3} />

        <label htmlFor="skills">Skills (comma separated)</label>
        <input id="skills" name="skills" value={formValues.skills} onChange={onChange} />

        <label htmlFor="profileImage">Profile Image</label>
        <input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={onChange} />

        <label htmlFor="resume">Resume (pdf/doc)</label>
        <input id="resume" name="resume" type="file" onChange={onChange} />

        <div className="pp-action-row">
          <button type="submit" className="pp-link-btn" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="pp-link-btn pp-link-btn-light" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProfileDialog
