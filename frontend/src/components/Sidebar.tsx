import  { useEffect, useState } from 'react'
import { useMessageStore } from '../store/UseMessage'
import SidebarSkeleton from './skeleton/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  // Add onlineUsers to the destructuring if it's available in your store
  const { getUsers, users, isUserLoading, selectedUser, setSelectedUser } = useMessageStore();
  console.log("selectedUser", selectedUser)
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  // const {onlineUsers}= useAuthStore();
  const { onlineUsers } = useAuthStore();
  
  useEffect(() => {
    getUsers();
  }, [getUsers])

  if (isUserLoading) {
    return <SidebarSkeleton />
  }
  
const filterData = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users


  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>

        <div className="overflow-y-hidden w-full py-3 flex-1">
          { filterData
          .map((user: any) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar