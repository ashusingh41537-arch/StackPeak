import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UpdateProfileDialog from '../components/UpdateProfileDialog'
import useUserProfile from '../hooks/useUserProfile'
import { updateMyProfile } from '../services/authApi'
import { setUser } from '../features/auth/authSlice'

function UserProfilePage() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const { profile, isLoading, errorMessage, reloadProfile } = useUserProfile(token)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')

  async function handleSave(formValues) {
    setIsSaving(true)
    setInfoMessage('')

    try {
      const data = await updateMyProfile(formValues, token)
      dispatch(setUser(data.user))
      await reloadProfile()
      setInfoMessage(data.message || 'Profile updated.')
      setIsDialogOpen(false)
    } catch (error) {
      setInfoMessage(error?.response?.data?.message || 'Profile update failed.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <p className="pp-info-line">Loading profile...</p>
  }

  if (errorMessage) {
    return <p className="pp-error-block">{errorMessage}</p>
  }

  return (
    <section className="pp-job-details">
      <h1 className="pp-page-title">My Profile</h1>

      {profile?.profilePhoto ? (
        <img src={profile.profilePhoto} alt="Profile" className="pp-profile-image" />
      ) : null}

      <p className="pp-detail-line">Name: {profile?.fullName || '-'}</p>
      <p className="pp-detail-line">Email: {profile?.email || '-'}</p>
      <p className="pp-detail-line">Phone: {profile?.phoneNumber || '-'}</p>
      <p className="pp-detail-line">Role: {profile?.role || '-'}</p>
      <p className="pp-detail-line">Bio: {profile?.bio || '-'}</p>
      <p className="pp-detail-line">Skills: {profile?.skills || '-'}</p>

      <p className="pp-detail-line">
        Resume:{' '}
        {profile?.resume ? (
          <a href={profile.resume} target="_blank" rel="noreferrer">
            {profile.resumeOriginalName || 'Open Resume'}
          </a>
        ) : (
          'Not uploaded'
        )}
      </p>

      <div className="pp-action-row">
        <button type="button" className="pp-link-btn" onClick={() => setIsDialogOpen(true)}>
          Update Profile
        </button>
      </div>

      {infoMessage ? <p className="pp-info-line">{infoMessage}</p> : null}

      {isDialogOpen ? (
        <UpdateProfileDialog
          profile={profile}
          isSaving={isSaving}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
      ) : null}
    </section>
  )
}

export default UserProfilePage
