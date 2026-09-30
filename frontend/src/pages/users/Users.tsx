import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Plus, ShieldCheck, UserCog, UsersRound, X } from "lucide-react"
import { createUser, getRoles, getUsers, updateUser } from "../../services/users"
import type { RoleRecord, UserRecord } from "../../types"

export default function Users() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ email: "", password: "", full_name: "", role_id: "" })

  async function load() {
    try {
      setLoading(true)
      setError("")
      const [userData, roleData] = await Promise.all([getUsers(), getRoles()])
      setUsers(userData)
      setRoles(roleData)
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to load users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    try {
      setSaving(true)
      await createUser({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        role_id: form.role_id ? Number(form.role_id) : null,
      })
      setOpen(false)
      setForm({ email: "", password: "", full_name: "", role_id: "" })
      await load()
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to create user.")
    } finally {
      setSaving(false)
    }
  }

  async function toggleUser(user: UserRecord) {
    try {
      await updateUser(user.id, { is_active: !user.is_active })
      await load()
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to update user.")
    }
  }

  async function changeRole(user: UserRecord, roleId: string) {
    try {
      await updateUser(user.id, { role_id: Number(roleId) })
      await load()
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to update role.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">Administration</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Users & Roles</h1>
          <p className="mt-1 text-gray-500">Manage DineOps accounts and role access.</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
          <Plus size={17} /> Add User
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-5 md:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck size={21} /></div>
            <h2 className="mt-5 font-bold text-gray-900 dark:text-white">{role.name}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">{role.description}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <div className="flex items-center gap-3"><UsersRound className="text-emerald-600" size={21} /><div><h2 className="font-bold text-gray-900 dark:text-white">System Users</h2><p className="text-sm text-gray-400">{users.length} account(s)</p></div></div>
        </div>
        {loading ? <div className="p-8 text-center text-sm text-gray-400">Loading users...</div> : users.length === 0 ? <div className="p-8 text-center"><UserCog className="mx-auto text-gray-300" size={34}/><p className="mt-3 text-sm text-gray-400">No users found.</p></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:bg-gray-800/60"><tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => <tr key={user.id}>
                  <td className="px-6 py-4"><p className="font-semibold text-gray-900 dark:text-white">{user.name}</p><p className="text-xs text-gray-400">{user.email}</p></td>
                  <td className="px-6 py-4"><select value={user.role_id ?? ""} onChange={(e) => void changeRole(user, e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></td>
                  <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>{user.is_active ? "Active" : "Inactive"}</span></td>
                  <td className="px-6 py-4"><button onClick={() => void toggleUser(user)} className="font-semibold text-emerald-600 hover:text-emerald-700">{user.is_active ? "Deactivate" : "Activate"}</button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Create User</h2><p className="text-sm text-gray-400">Create a dedicated ERP account.</p></div><button onClick={() => setOpen(false)}><X size={20}/></button></div>
          <form onSubmit={handleCreate} className="space-y-4">
            <input required placeholder="Full name" value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"/>
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"/>
            <input required minLength={8} type="password" placeholder="Password (8+ characters)" value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"/>
            <select required value={form.role_id} onChange={e => setForm({...form, role_id:e.target.value})} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"><option value="">Select role</option>{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
            <button disabled={saving} className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60">{saving ? "Creating..." : "Create User"}</button>
          </form>
        </div>
      </div>}
    </div>
  )
}
